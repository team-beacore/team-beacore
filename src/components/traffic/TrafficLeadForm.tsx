import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { siteConfig } from "../../config/site";
import { channelName, trafficChannels, trafficGoals, type TrafficChannel } from "../../content/trafficPage";
import { trackEvent } from "../../lib/analytics";
import { submitTrafficLead } from "../../lib/leads";
import { CheckIcon, SendIcon, WhatsAppIcon } from "../../lib/icons";
import { cn, whatsappUrl } from "../../lib/utils";
import { Button } from "../Button";
import { Core } from "../core/Core";
import { EMAIL_PATTERN, inputClassDark, invalidClass, isValidBrazilianPhone } from "../LeadForm";

type Values = {
  name: string;
  company: string;
  email: string;
  whatsapp: string;
  site: string;
  goal: string;
  context: string;
};

type Errors = Partial<Record<keyof Values | "channel", string>>;
type Status = "idle" | "submitting" | "success" | "error";

const empty: Values = { name: "", company: "", email: "", whatsapp: "", site: "", goal: "", context: "" };
const MAX_CONTEXT = 1500;

/** Site é opcional; se vier, precisa parecer um endereço (com ou sem https://). */
const SITE_PATTERN = /^(https?:\/\/)?[^\s/$.?#]+\.[^\s]{2,}$/i;

function validate(values: Values, channel: TrafficChannel | null): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = "Informe seu nome.";
  if (values.company.trim().length < 2) errors.company = "Informe o nome da empresa.";
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = "Informe um e-mail válido.";
  if (values.whatsapp.trim() && !isValidBrazilianPhone(values.whatsapp)) errors.whatsapp = "Informe um número válido, com DDD.";
  if (values.site.trim() && !SITE_PATTERN.test(values.site.trim())) errors.site = "Informe um endereço válido (ex.: suaempresa.com.br).";
  if (!channel) errors.channel = "Escolha o canal de interesse.";
  if (!values.goal) errors.goal = "Selecione o principal objetivo.";
  return errors;
}

type Props = {
  channel: TrafficChannel | null;
  onChannelChange: (channel: TrafficChannel) => void;
};

/**
 * Formulário de avaliação estratégica de tráfego pago.
 *
 * Grava na mesma tabela `leads` do formulário geral (ver submitTrafficLead).
 * O canal é controlado pela página: os cards "Escolha seu canal" o preenchem.
 * Eventos de analytics nunca levam dados pessoais, e o de sucesso só dispara
 * depois da confirmação do banco.
 */
export function TrafficLeadForm({ channel, onChannelChange }: Props) {
  const baseId = useId();
  const id = (field: string) => `${baseId}-${field}`;
  const errorId = (field: string) => `${baseId}-${field}-error`;
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [honeypot, setHoneypot] = useState("");
  const started = useRef(false);
  const successRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const submitting = status === "submitting";

  const markStarted = () => {
    if (started.current) return;
    started.current = true;
    trackEvent("traffic_form_start", { channel: channel ?? "none" });
  };

  function update<K extends keyof Values>(field: K, value: string) {
    markStarted();
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    if (status === "error") setStatus("idle");
  }

  function chooseChannel(next: TrafficChannel) {
    markStarted();
    onChannelChange(next);
    setErrors((current) => {
      if (!current.channel) return current;
      const rest = { ...current };
      delete rest.channel;
      return rest;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || status === "success") return;
    if (honeypot.trim()) {
      setStatus("success");
      return;
    }

    const nextErrors = validate(values, channel);
    setErrors(nextErrors);
    const first = Object.keys(nextErrors)[0];
    if (first) {
      document.getElementById(first === "channel" ? id("channel-meta-ads") : id(first))?.focus();
      return;
    }

    const goal = trafficGoals.find((item) => item.value === values.goal)!;
    setStatus("submitting");
    const result = await submitTrafficLead({
      name: values.name,
      company: values.company,
      email: values.email,
      whatsapp: values.whatsapp,
      site: values.site,
      channel: channel!,
      channelLabel: channelName(channel!),
      goal: goal.value,
      goalLabel: goal.label,
      fallbackGoal: goal.fallbackGoal,
      context: values.context,
    });

    if (result.ok) {
      trackEvent("traffic_form_submit_success", { channel: channel!, goal: goal.value });
      setStatus("success");
    } else {
      setStatus("error");
    }
  }

  const whatsappHref = whatsappUrl(
    siteConfig.contact.whatsapp,
    `Olá! Gostaria de uma avaliação de tráfego pago${channel ? ` (${channelName(channel)})` : ""} com a Beacore.`,
  );

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-center rounded-2xl border border-white/10 bg-night-850 p-8 text-center sm:p-10"
      >
        <Core pose="thumbs-up-2" className="h-32 w-auto" />
        <h3 ref={successRef} tabIndex={-1} className="mt-5 font-display text-xl font-bold text-white outline-none">
          Recebemos suas informações!
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-300">
          Vamos avaliar o cenário e entrar em contato para conversar sobre os caminhos que fazem sentido
          para o seu negócio.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button
            variant="outline-light"
            onClick={() => {
              setValues(empty);
              setErrors({});
              setStatus("idle");
              started.current = false;
            }}
          >
            Enviar outra solicitação
          </Button>
          <Button href={whatsappHref} external variant="primary">
            <WhatsAppIcon className="h-4 w-4" />
            Falar pelo WhatsApp
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-describedby={`${baseId}-required`}
      className="relative rounded-2xl border border-white/10 bg-night-850 p-6 [color-scheme:dark] sm:p-8"
    >
      <p id={`${baseId}-required`} className="text-xs text-ink-400">
        Campos marcados com <span className="text-brand-300">*</span> são obrigatórios.
      </p>

      {/* Canal: rádios reais, acessíveis por teclado e toque. */}
      <fieldset className="mt-5" aria-describedby={errors.channel ? errorId("channel") : undefined}>
        <legend className="mb-2 text-sm font-medium text-ink-200">
          Serviço de interesse <span aria-hidden="true" className="text-brand-300">*</span>
        </legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {trafficChannels.map((option) => {
            const checked = channel === option.id;
            return (
              <label
                key={option.id}
                htmlFor={id(`channel-${option.id}`)}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-3 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-400",
                  checked
                    ? "border-brand-400 bg-brand-500/15 text-white"
                    : "border-white/12 bg-white/[0.03] text-ink-200 hover:border-white/25",
                  errors.channel && "border-red-400",
                )}
              >
                <input
                  id={id(`channel-${option.id}`)}
                  type="radio"
                  name="channel"
                  value={option.id}
                  checked={checked}
                  disabled={submitting}
                  onChange={() => chooseChannel(option.id)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                    checked ? "border-brand-300 bg-brand-400" : "border-white/30",
                  )}
                >
                  {checked && <CheckIcon className="h-2.5 w-2.5 text-night-950" strokeWidth={3} />}
                </span>
                <span className="font-medium">{option.short}</span>
              </label>
            );
          })}
        </div>
        {errors.channel && <FieldError id={errorId("channel")}>{errors.channel}</FieldError>}
      </fieldset>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Field label="Nome" required htmlFor={id("name")} error={errors.name} errorId={errorId("name")}>
          <input
            id={id("name")}
            name="name"
            autoComplete="name"
            maxLength={120}
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            disabled={submitting}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? errorId("name") : undefined}
            className={cn(inputClassDark, errors.name && invalidClass)}
            placeholder="Seu nome"
          />
        </Field>
        <Field label="Empresa" required htmlFor={id("company")} error={errors.company} errorId={errorId("company")}>
          <input
            id={id("company")}
            name="company"
            autoComplete="organization"
            maxLength={120}
            value={values.company}
            onChange={(e) => update("company", e.target.value)}
            disabled={submitting}
            aria-invalid={Boolean(errors.company)}
            aria-describedby={errors.company ? errorId("company") : undefined}
            className={cn(inputClassDark, errors.company && invalidClass)}
            placeholder="Nome da empresa"
          />
        </Field>
        <Field label="E-mail" required htmlFor={id("email")} error={errors.email} errorId={errorId("email")}>
          <input
            id={id("email")}
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            disabled={submitting}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? errorId("email") : undefined}
            className={cn(inputClassDark, errors.email && invalidClass)}
            placeholder="voce@empresa.com"
          />
        </Field>
        <Field label="WhatsApp" hint="opcional" htmlFor={id("whatsapp")} error={errors.whatsapp} errorId={errorId("whatsapp")}>
          <input
            id={id("whatsapp")}
            name="whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={32}
            value={values.whatsapp}
            onChange={(e) => update("whatsapp", e.target.value)}
            disabled={submitting}
            aria-invalid={Boolean(errors.whatsapp)}
            aria-describedby={errors.whatsapp ? errorId("whatsapp") : undefined}
            className={cn(inputClassDark, errors.whatsapp && invalidClass)}
            placeholder="(00) 00000-0000"
          />
        </Field>
        <Field label="Site" hint="se houver" htmlFor={id("site")} error={errors.site} errorId={errorId("site")}>
          <input
            id={id("site")}
            name="site"
            inputMode="url"
            autoComplete="url"
            maxLength={200}
            value={values.site}
            onChange={(e) => update("site", e.target.value)}
            disabled={submitting}
            aria-invalid={Boolean(errors.site)}
            aria-describedby={errors.site ? errorId("site") : undefined}
            className={cn(inputClassDark, errors.site && invalidClass)}
            placeholder="suaempresa.com.br"
          />
        </Field>
        <Field label="Principal objetivo" required htmlFor={id("goal")} error={errors.goal} errorId={errorId("goal")}>
          <select
            id={id("goal")}
            name="goal"
            value={values.goal}
            onChange={(e) => update("goal", e.target.value)}
            disabled={submitting}
            aria-invalid={Boolean(errors.goal)}
            aria-describedby={errors.goal ? errorId("goal") : undefined}
            className={cn(inputClassDark, "[&>option]:text-white", !values.goal && "text-ink-500!", errors.goal && invalidClass)}
          >
            <option value="">Selecione</option>
            {trafficGoals.map((goal) => (
              <option key={goal.value} value={goal.value}>
                {goal.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Contexto adicional" hint="opcional" htmlFor={id("context")}>
          <textarea
            id={id("context")}
            name="context"
            rows={4}
            maxLength={MAX_CONTEXT}
            value={values.context}
            onChange={(e) => update("context", e.target.value)}
            disabled={submitting}
            className={cn(inputClassDark, "resize-none")}
            placeholder="Já anuncia? Qual região atende? Qual o orçamento previsto para mídia?"
          />
        </Field>
      </div>

      {/* Honeypot: invisível para pessoas, preenchido só por bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("company-url")}>Não preencha este campo</label>
        <input
          id={id("company-url")}
          name="company-url"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {status === "error" && (
        <div role="alert" className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm leading-relaxed text-red-200">
          <p>Não conseguimos enviar suas informações agora. Tente novamente ou fale conosco pelo WhatsApp.</p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 font-semibold text-red-100 underline underline-offset-4 hover:text-white"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Falar pelo WhatsApp
          </a>
        </div>
      )}

      <div className="mt-7">
        <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
          <SendIcon className="h-4 w-4" />
          {submitting ? "Enviando..." : "Solicitar avaliação estratégica"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  hint,
  htmlFor,
  error,
  errorId,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  htmlFor: string;
  error?: string;
  errorId?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink-200">
        {label}
        {required && (
          <span aria-hidden="true" className="text-brand-300">
            {" "}
            *
          </span>
        )}
        {hint && <span className="ml-1 font-normal text-ink-400">({hint})</span>}
      </label>
      {children}
      {error && errorId && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}

function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-1.5 text-sm font-medium text-red-300">
      {children}
    </p>
  );
}
