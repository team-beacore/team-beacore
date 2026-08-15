import { useEffect, useRef, useState, type FormEvent } from "react";
import { siteConfig } from "../config/site";
import { whatsappUrl } from "../lib/utils";
import { CheckIcon, SendIcon, WhatsAppIcon } from "../lib/icons";
import { Button } from "./Button";

const inputClass =
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-base text-ink-900 placeholder:text-ink-400 transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10";

type FieldProps = {
  id: string;
  label: string;
  required?: boolean;
};

function Field({ id, label, required }: FieldProps) {
  return (
    <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink-700">
      {label}
      {required && (
        <span aria-hidden="true" className="text-brand-600">
          {" "}
          *
        </span>
      )}
    </label>
  );
}

type FormStatus = "idle" | "sending" | "sent";

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status !== "idle") return;

    setStatus("sending");
    timeoutRef.current = window.setTimeout(() => setStatus("sent"), 800);
  }

  if (status === "sent") {
    const whatsapp = whatsappUrl(siteConfig.contact.whatsapp, siteConfig.contact.whatsappMessage);

    return (
      <div
        role="status"
        className="flex h-full flex-col items-center justify-center rounded-2xl border border-ink-100 bg-white p-10 text-center"
      >
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckIcon className="h-7 w-7" />
        </span>
        <h3 className="mt-5 font-display text-xl font-bold text-ink-950">Mensagem registrada!</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-500">
          Obrigado pelo contato. Em breve entraremos em contato. Este é um formulário de
          demonstração — o envio real será ativado quando o backend estiver conectado.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button variant="secondary" onClick={() => setStatus("idle")}>
            Enviar outra mensagem
          </Button>
          <Button href={whatsapp} external variant="primary">
            <WhatsAppIcon className="h-4 w-4" />
            Falar pelo WhatsApp
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-ink-100 bg-white p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Field id="nome" label="Nome" required />
          <input id="nome" name="nome" type="text" required autoComplete="name" className={inputClass} placeholder="Seu nome" />
        </div>
        <div>
          <Field id="email" label="Email" required />
          <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} placeholder="voce@empresa.com" />
        </div>
      </div>

      <div className="mt-5">
        <Field id="empresa" label="Empresa" />
        <input id="empresa" name="empresa" type="text" autoComplete="organization" className={inputClass} placeholder="Sua empresa (opcional)" />
      </div>

      <div className="mt-5">
        <Field id="mensagem" label="Mensagem" required />
        <textarea
          id="mensagem"
          name="mensagem"
          rows={5}
          required
          className={`${inputClass} resize-none`}
          placeholder="Conte sobre o seu projeto..."
        />
      </div>

      <div className="mt-7">
        <Button type="submit" size="lg" disabled={status === "sending"} className="w-full sm:w-auto">
          <SendIcon className="h-4 w-4" />
          {status === "sending" ? "Enviando..." : "Enviar mensagem"}
        </Button>
      </div>
    </form>
  );
}