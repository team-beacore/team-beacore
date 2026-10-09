import { createContext, useContext, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { siteConfig } from "../config/site";
import { goalOptions, needOptions, whatsappMessageForNeed } from "../data/leadOptions";
import { submitLead, type LeadSource } from "../lib/leads";
import { cn, whatsappUrl } from "../lib/utils";
import { CheckIcon, SendIcon, WhatsAppIcon } from "../lib/icons";
import { Button } from "./Button";
import { Core } from "./core/Core";

const inputClass =
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-base text-ink-900 placeholder:text-ink-400 transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10";
export const invalidClass = "border-red-400 focus:border-red-500 focus:ring-red-500/10";

/** Variante para fundos escuros (Home). Só o visual muda — a lógica é a mesma. */
export const inputClassDark =
  "w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 text-base text-white placeholder:text-ink-500 transition focus:border-brand-400 focus:bg-white/[0.06] focus:outline-none focus:ring-4 focus:ring-brand-500/15";

type Tone = "light" | "dark";
const ToneContext = createContext<Tone>("light");

const MIN_NAME = 2;
const MIN_MESSAGE = 10;
const MAX_MESSAGE = 2000;

export const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

type FormValues = {
  name: string;
  email: string;
  whatsapp: string;
  need: string;
  goal: string;
  message: string;
};

type FieldErrors = Partial<Record<keyof FormValues, string>>;

type FormStatus = "idle" | "submitting" | "success" | "error";

const emptyValues: FormValues = {
  name: "",
  email: "",
  whatsapp: "",
  need: "",
  goal: "",
  message: "",
};

/** Aceita os formatos brasileiros comuns, com ou sem DDI, máscara ou espaços. */
export function isValidBrazilianPhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("55")) return digits.length === 12 || digits.length === 13;
  return digits.length === 10 || digits.length === 11;
}

function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {};

  if (values.name.trim().length < MIN_NAME) {
    errors.name = "Informe seu nome.";
  }
  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Informe um e-mail válido.";
  }
  if (values.whatsapp.trim() && !isValidBrazilianPhone(values.whatsapp)) {
    errors.whatsapp = "Informe um número válido, com DDD.";
  }
  if (!values.need) {
    errors.need = "Selecione uma opção.";
  }
  if (!values.goal) {
    errors.goal = "Selecione uma opção.";
  }
  if (values.message.trim().length < MIN_MESSAGE) {
    errors.message = `Escreva um pouco mais (mínimo ${MIN_MESSAGE} caracteres).`;
  }

  return errors;
}

type LeadFormProps = {
  /** De onde o lead veio. As páginas de serviço usarão valores específicos. */
  source?: LeadSource;
  className?: string;
  /** `dark`: campos e textos para fundos escuros. Padrão: claro. */
  tone?: Tone;
};

export function LeadForm({ source = "home", className, tone = "light" }: LeadFormProps) {
  const isDark = tone === "dark";
  const fieldClass = isDark ? inputClassDark : inputClass;
  // Vazio = cor de placeholder (com `!`: a cor do campo vem depois no CSS e
  // venceria). As opções mantêm a cor normal na lista aberta.
  const selectClass = isDark ? "[&>option]:text-white" : "[&>option]:text-ink-900";
  const fieldId = useId();
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  /** Honeypot: preenchido apenas por bots que completam todos os campos. */
  const [honeypot, setHoneypot] = useState("");
  /** O formulário some no sucesso: o foco vai para a confirmação, não para o <body>. */
  const successRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const id = (field: string) => `${fieldId}-${field}`;
  const errorId = (field: string) => `${fieldId}-${field}-error`;

  const whatsappHref = whatsappUrl(
    siteConfig.contact.whatsapp,
    whatsappMessageForNeed(values.need, siteConfig.contact.whatsappMessage),
  );

  function update<K extends keyof FormValues>(field: K, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    if (status === "error") setStatus("idle");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Bloqueia reenvio durante o envio e após o sucesso.
    if (status === "submitting" || status === "success") return;

    // Honeypot preenchido: encerra silenciosamente, sem gravar nada.
    if (honeypot.trim()) {
      setStatus("success");
      return;
    }

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstField = Object.keys(nextErrors)[0];
      document.getElementById(id(firstField))?.focus();
      return;
    }

    setStatus("submitting");

    const result = await submitLead({
      name: values.name,
      email: values.email,
      whatsapp: values.whatsapp,
      need: values.need,
      goal: values.goal,
      message: values.message,
      source,
    });

    setStatus(result.ok ? "success" : "error");
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className={cn(
          "flex h-full flex-col items-center justify-center rounded-2xl border p-10 text-center",
          isDark ? "border-white/10 bg-night-850" : "border-ink-100 bg-white",
          className,
        )}
      >
        {/* No fundo escuro, o Core comemora; no claro (recortes de fundo preto), o ícone. */}
        {isDark ? (
          <Core pose="thumbs-up-2" className="h-32 w-auto" />
        ) : (
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckIcon className="h-7 w-7" />
          </span>
        )}
        <h3
          ref={successRef}
          tabIndex={-1}
          className={cn("mt-5 font-display text-xl font-bold outline-none", isDark ? "text-white" : "text-ink-950")}
        >
          Mensagem enviada!
        </h3>
        <p className={cn("mt-2 max-w-sm text-sm leading-relaxed", isDark ? "text-ink-300" : "text-ink-500")}>
          Recebemos sua mensagem. Em breve entraremos em contato.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button
            variant={isDark ? "outline-light" : "secondary"}
            onClick={() => {
              setValues(emptyValues);
              setErrors({});
              setStatus("idle");
            }}
          >
            Enviar outra mensagem
          </Button>
          <Button href={whatsappHref} external variant="primary">
            <WhatsAppIcon className="h-4 w-4" />
            Falar pelo WhatsApp
          </Button>
        </div>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn(
        "rounded-2xl border p-6 sm:p-8",
        isDark ? "border-white/10 bg-night-850 [color-scheme:dark]" : "border-ink-100 bg-white",
        className,
      )}
    >
      <ToneContext.Provider value={tone}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id={id("name")}
          errorId={errorId("name")}
          label="Nome"
          required
          error={errors.name}
        >
          <input
            id={id("name")}
            name="name"
            type="text"
            autoComplete="name"
            maxLength={120}
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            disabled={submitting}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? errorId("name") : undefined}
            className={cn(fieldClass, errors.name && invalidClass)}
            placeholder="Seu nome"
          />
        </Field>

        <Field
          id={id("email")}
          errorId={errorId("email")}
          label="E-mail"
          required
          error={errors.email}
        >
          <input
            id={id("email")}
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            disabled={submitting}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? errorId("email") : undefined}
            className={cn(fieldClass, errors.email && invalidClass)}
            placeholder="voce@empresa.com"
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field
          id={id("whatsapp")}
          errorId={errorId("whatsapp")}
          label="WhatsApp"
          hint="opcional"
          error={errors.whatsapp}
        >
          <input
            id={id("whatsapp")}
            name="whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.whatsapp}
            onChange={(event) => update("whatsapp", event.target.value)}
            disabled={submitting}
            aria-invalid={Boolean(errors.whatsapp)}
            aria-describedby={errors.whatsapp ? errorId("whatsapp") : undefined}
            className={cn(fieldClass, errors.whatsapp && invalidClass)}
            placeholder="(00) 00000-0000"
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Field
          id={id("need")}
          errorId={errorId("need")}
          label="O que você precisa?"
          required
          error={errors.need}
        >
          <select
            id={id("need")}
            name="need"
            value={values.need}
            onChange={(event) => update("need", event.target.value)}
            disabled={submitting}
            aria-invalid={Boolean(errors.need)}
            aria-describedby={errors.need ? errorId("need") : undefined}
            className={cn(fieldClass, selectClass, !values.need && "text-ink-500!", errors.need && invalidClass)}
          >
            <option value="">Selecione</option>
            {needOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field
          id={id("goal")}
          errorId={errorId("goal")}
          label="Qual é o objetivo?"
          required
          error={errors.goal}
        >
          <select
            id={id("goal")}
            name="goal"
            value={values.goal}
            onChange={(event) => update("goal", event.target.value)}
            disabled={submitting}
            aria-invalid={Boolean(errors.goal)}
            aria-describedby={errors.goal ? errorId("goal") : undefined}
            className={cn(fieldClass, selectClass, !values.goal && "text-ink-500!", errors.goal && invalidClass)}
          >
            <option value="">Selecione</option>
            {goalOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Field
          id={id("message")}
          errorId={errorId("message")}
          label="Mensagem"
          required
          error={errors.message}
        >
          <textarea
            id={id("message")}
            name="message"
            rows={5}
            maxLength={MAX_MESSAGE}
            value={values.message}
            onChange={(event) => update("message", event.target.value)}
            disabled={submitting}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? errorId("message") : undefined}
            className={cn(fieldClass, "resize-none", errors.message && invalidClass)}
            placeholder="Conte sobre o seu projeto..."
          />
        </Field>
      </div>

      {/* Honeypot — escondido de pessoas, visível para bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("company-url")}>Não preencha este campo</label>
        <input
          id={id("company-url")}
          name="company-url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      {status === "error" && (
        <div
          role="alert"
          className={cn(
            "mt-6 rounded-xl border p-4 text-sm leading-relaxed",
            isDark ? "border-red-400/30 bg-red-500/10 text-red-200" : "border-red-200 bg-red-50 text-red-800",
          )}
        >
          <p>
            Não conseguimos enviar sua mensagem agora. Tente novamente ou fale conosco pelo
            WhatsApp.
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "mt-3 inline-flex items-center gap-2 font-semibold underline underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600",
              isDark ? "text-red-100 hover:text-white" : "text-red-900 hover:text-red-950",
            )}
          >
            <WhatsAppIcon className="h-4 w-4" />
            Falar pelo WhatsApp
          </a>
        </div>
      )}

      <div className="mt-7">
        <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
          <SendIcon className="h-4 w-4" />
          {submitting ? "Enviando..." : "Enviar mensagem"}
        </Button>
      </div>
      </ToneContext.Provider>
    </form>
  );
}

type FieldProps = {
  id: string;
  errorId: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
};

function Field({ id, errorId, label, required, hint, error, children }: FieldProps) {
  const isDark = useContext(ToneContext) === "dark";
  return (
    <div>
      <label
        htmlFor={id}
        className={cn("mb-1.5 block text-sm font-medium", isDark ? "text-ink-200" : "text-ink-700")}
      >
        {label}
        {required && (
          <span aria-hidden="true" className={isDark ? "text-brand-300" : "text-brand-600"}>
            {" "}
            *
          </span>
        )}
        {hint && (
          <span className={cn("ml-1 font-normal", isDark ? "text-ink-400" : "text-ink-500")}>({hint})</span>
        )}
      </label>
      {children}
      {error && (
        <p id={errorId} className={cn("mt-1.5 text-sm font-medium", isDark ? "text-red-300" : "text-red-600")}>
          {error}
        </p>
      )}
    </div>
  );
}
