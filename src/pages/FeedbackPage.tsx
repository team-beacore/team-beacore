import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { TechnologyBadge } from "../components/TechnologyBadge";
import {
  submitFeedback,
  validateFeedbackToken,
  type FeedbackTokenValidation,
  type SubmitFeedbackErrorReason,
} from "../lib/feedbackTokens";
import { CheckIcon, SendIcon } from "../lib/icons";

const inputClass =
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-base text-ink-900 placeholder:text-ink-400 transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10";

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MIN_CONTENT_LENGTH = 10;
const MAX_CONTENT_LENGTH = 2000;

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const tokenErrors: Record<Exclude<FeedbackTokenValidation, { valid: true }>["reason"], string> = {
  invalid: "Este link de feedback não é válido.",
  expired: "Este link de feedback expirou. Peça um novo convite.",
  revoked: "Este link de feedback não está mais ativo.",
  used: "Este feedback já foi enviado.",
  error: "Não foi possível carregar este link. Tente novamente mais tarde.",
};

const submitErrors: Record<SubmitFeedbackErrorReason, string> = {
  invalid: "Este link de feedback não é válido.",
  expired: "Este link de feedback expirou. Peça um novo convite.",
  revoked: "Este link de feedback não está mais ativo.",
  used: "Este feedback já foi enviado.",
  already_submitted: "Você já enviou um feedback para este projeto.",
  invalid_author_name: "Informe um nome válido (2 a 120 caracteres).",
  invalid_author_email: "Informe um e-mail válido.",
  invalid_content: "Seu feedback não atende aos requisitos. Verifique o texto e tente novamente.",
  internal: "Não foi possível enviar seu feedback. Tente novamente mais tarde.",
  error: "Não foi possível enviar seu feedback. Tente novamente mais tarde.",
};

type FeedbackPageState =
  | { phase: "validating" }
  | { phase: "token_error"; reason: Exclude<FeedbackTokenValidation, { valid: true }>["reason"] }
  | { phase: "form"; validation: FeedbackTokenValidation & { valid: true } }
  | { phase: "success" };

export function FeedbackPage() {
  const { token = "" } = useParams();
  const [state, setState] = useState<FeedbackPageState>({ phase: "validating" });
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [content, setContent] = useState("");
  const [publishAuthorName, setPublishAuthorName] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<SubmitFeedbackErrorReason | null>(null);

  useEffect(() => {
    let active = true;

    validateFeedbackToken(token).then((validation) => {
      if (!active) return;
      if (!validation.valid) {
        setState({ phase: "token_error", reason: validation.reason });
        return;
      }
      setState({ phase: "form", validation });
    });

    return () => {
      active = false;
    };
  }, [token]);

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      meta.remove();
    };
  }, []);

  function handleSubmit() {
    if (state.phase !== "form" || submitting) return;

    const name = authorName.trim().replace(/\s+/g, " ");
    const email = authorEmail.trim();
    const trimmed = content.trim();

    if (name.length < MIN_NAME_LENGTH || name.length > MAX_NAME_LENGTH) {
      setFieldError(`Informe seu nome (2 a ${MAX_NAME_LENGTH} caracteres).`);
      return;
    }
    if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
      setFieldError("Informe um e-mail válido.");
      return;
    }
    if (!trimmed) {
      setFieldError("Escreva seu feedback antes de enviar.");
      return;
    }
    if (trimmed.length < MIN_CONTENT_LENGTH) {
      setFieldError(`Seu feedback precisa ter pelo menos ${MIN_CONTENT_LENGTH} caracteres.`);
      return;
    }
    if (trimmed.length > MAX_CONTENT_LENGTH) {
      setFieldError("Seu feedback ultrapassou o limite permitido.");
      return;
    }

    setFieldError(null);
    setSubmitError(null);
    setSubmitting(true);

    submitFeedback(token, name, email, trimmed, publishAuthorName).then((result) => {
      setSubmitting(false);
      if (result.success) {
        setState({ phase: "success" });
        return;
      }
      setSubmitError(result.reason);
    });
  }

  if (state.phase === "validating") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white px-5">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-ink-400">Carregando...</p>
      </div>
    );
  }

  if (state.phase === "token_error") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white px-5">
        <div className="max-w-md rounded-2xl border border-ink-100 bg-white p-10 text-center">
          <h1 className="font-display text-xl font-bold text-ink-950">Feedback</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-500">{tokenErrors[state.reason]}</p>
        </div>
      </div>
    );
  }

  if (state.phase === "success") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white px-5">
        <div className="max-w-md rounded-2xl border border-ink-100 bg-white p-10 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckIcon className="h-7 w-7" />
          </span>
          <h1 className="mt-5 font-display text-xl font-bold text-ink-950">Feedback enviado!</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-500">
            Obrigado por compartilhar sua experiência. Seu feedback foi recebido e será revisado
            pela equipe antes de aparecer no site.
          </p>
        </div>
      </div>
    );
  }

  const { validation } = state;

  return (
    <div className="min-h-dvh bg-white px-5 py-16 sm:py-24">
      <div className="mx-auto w-full max-w-xl">
        <div className="rounded-2xl border border-ink-100 bg-white p-6 sm:p-8">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-600">
            Feedback do projeto
          </p>
          <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink-950 sm:text-3xl">
            {validation.project.name}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-500">
            {validation.project.description}
          </p>

          {validation.project.technologies.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {validation.project.technologies.map((tech) => (
                <TechnologyBadge key={tech} name={tech} />
              ))}
            </div>
          )}

          <div className="mt-8">
            <p className="text-sm leading-relaxed text-ink-700">
              Olá! 👋 Queremos saber o que você achou do projeto. Sua opinião nos ajuda a melhorar
              sempre.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label htmlFor="author-name" className="mb-1.5 block text-sm font-medium text-ink-700">
                  Nome
                  <span aria-hidden="true" className="text-brand-600">
                    {" "}
                    *
                  </span>
                </label>
                <input
                  id="author-name"
                  name="author-name"
                  type="text"
                  autoComplete="name"
                  maxLength={MAX_NAME_LENGTH}
                  value={authorName}
                  onChange={(event) => {
                    setAuthorName(event.target.value);
                    setFieldError(null);
                  }}
                  className={inputClass}
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label
                  htmlFor="author-email"
                  className="mb-1.5 block text-sm font-medium text-ink-700"
                >
                  E-mail
                  <span aria-hidden="true" className="text-brand-600">
                    {" "}
                    *
                  </span>
                </label>
                <input
                  id="author-email"
                  name="author-email"
                  type="email"
                  autoComplete="email"
                  maxLength={MAX_EMAIL_LENGTH}
                  value={authorEmail}
                  onChange={(event) => {
                    setAuthorEmail(event.target.value);
                    setFieldError(null);
                  }}
                  className={inputClass}
                  placeholder="voce@email.com"
                />
                <p className="mt-1.5 text-xs text-ink-400">
                  Seu e-mail não será exibido publicamente. Usamos apenas para identificação.
                </p>
              </div>

              <div>
                <label htmlFor="feedback" className="mb-1.5 block text-sm font-medium text-ink-700">
                  Seu feedback
                  <span aria-hidden="true" className="text-brand-600">
                    {" "}
                    *
                  </span>
                </label>
                <textarea
                  id="feedback"
                  name="feedback"
                  rows={6}
                  maxLength={MAX_CONTENT_LENGTH}
                  value={content}
                  onChange={(event) => {
                    setContent(event.target.value);
                    setFieldError(null);
                  }}
                  className={`${inputClass} resize-none`}
                  placeholder="Conte como foi trabalhar com a Beacore neste projeto..."
                />
                <div className="mt-1.5 flex items-center justify-between">
                  <span role="status" className="sr-only">
                    {fieldError}
                  </span>
                  <p className="text-xs text-ink-400">
                    {content.length} / {MAX_CONTENT_LENGTH}
                  </p>
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-ink-200 bg-ink-50/50 p-4">
                <input
                  type="checkbox"
                  checked={publishAuthorName}
                  onChange={(event) => {
                    setPublishAuthorName(event.target.checked);
                    setFieldError(null);
                  }}
                  className="mt-0.5 h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-sm leading-relaxed text-ink-700">
                  Autorizo a publicação do meu nome junto ao depoimento no site da Beacore.
                </span>
              </label>
            </div>

            {fieldError && <p className="mt-2 text-sm font-medium text-red-600">{fieldError}</p>}

            {submitError && (
              <p className="mt-2 text-sm font-medium text-red-600">{submitErrors[submitError]}</p>
            )}

            <div className="mt-7">
              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                onClick={handleSubmit}
                className="w-full sm:w-auto"
              >
                <SendIcon className="h-4 w-4" />
                {submitting ? "Enviando..." : "Enviar feedback"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}