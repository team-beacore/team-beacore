import { useEffect, useState } from "react";
import { Button } from "../Button";
import {
  adminClientErrorMessages,
  createAdminClient,
  listAdminClients,
  setClientProjects,
  updateAdminClient,
  type AdminClient,
  type AdminClientInput,
} from "../../lib/adminClients";
import { listAdminProjects, type AdminProject } from "../../lib/adminProjects";
import { CloseIcon, EditIcon, PlusIcon } from "../../lib/icons";
import { cn } from "../../lib/utils";
import { InvitePanel } from "./InvitePanel";

const inputClass =
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-base text-ink-900 placeholder:text-ink-400 transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10";

const emptyForm: AdminClientInput = {
  name: "",
  company: "",
  email: "",
  phone: "",
  avatar: "",
  notes: "",
  status: "active",
};

function formFromClient(client: AdminClient): AdminClientInput {
  return {
    name: client.name,
    company: client.company ?? "",
    email: client.email,
    phone: client.phone ?? "",
    avatar: client.avatar ?? "",
    notes: client.notes ?? "",
    status: client.status,
  };
}

export function AdminClients() {
  const [clients, setClients] = useState<AdminClient[] | null>(null);
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminClient | null>(null);
  const [form, setForm] = useState<AdminClientInput>(emptyForm);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linksFor, setLinksFor] = useState<AdminClient | null>(null);
  const [linkSelection, setLinkSelection] = useState<string[]>([]);
  const [savingLinks, setSavingLinks] = useState(false);

  function reload() {
    listAdminClients().then(setClients);
  }

  useEffect(() => {
    reload();
    listAdminProjects().then(setProjects);
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFieldError(null);
    setError(null);
    setFormOpen(true);
  }

  function openEdit(client: AdminClient) {
    setEditing(client);
    setForm(formFromClient(client));
    setFieldError(null);
    setError(null);
    setFormOpen(true);
  }

  function openLinks(client: AdminClient) {
    setLinksFor(client);
    setLinkSelection(client.projectIds);
    setError(null);
  }

  function handleSave() {
    if (saving) return;

    if (!form.name.trim()) {
      setFieldError("Informe o nome do cliente.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) {
      setFieldError("Informe um e-mail válido.");
      return;
    }

    setFieldError(null);
    setError(null);
    setSaving(true);

    const payload: AdminClientInput = {
      ...form,
      name: form.name.trim(),
      company: form.company.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      avatar: form.avatar.trim(),
      notes: form.notes.trim(),
    };

    const run = editing ? updateAdminClient(editing.id, payload) : createAdminClient(payload);

    run.then((result) => {
      setSaving(false);
      if (result.ok) {
        setFormOpen(false);
        setEditing(null);
        reload();
        return;
      }
      setError(adminClientErrorMessages[result.reason]);
    });
  }

  function handleSaveLinks() {
    if (!linksFor || savingLinks) return;

    setSavingLinks(true);
    setError(null);

    setClientProjects(linksFor.id, linkSelection).then((result) => {
      setSavingLinks(false);
      if (result.ok) {
        setLinksFor(null);
        reload();
        return;
      }
      setError("Não foi possível salvar os vínculos. Tente novamente.");
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold text-ink-950">Clientes</h2>
          <p className="mt-0.5 text-sm text-ink-500">
            O cliente recebe apenas o link de feedback — sem acesso ao painel.
          </p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <PlusIcon className="h-4 w-4" />
          Novo cliente
        </Button>
      </div>

      {error && (
        <p
          role="status"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {error}
        </p>
      )}

      {formOpen && (
        <div className="mt-6 rounded-2xl border border-ink-100 bg-white p-6 sm:p-7">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-ink-950">
              {editing ? "Editar cliente" : "Novo cliente"}
            </h3>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              aria-label="Fechar formulário"
              className="rounded-full p-2 text-ink-400 transition hover:bg-ink-50 hover:text-ink-900"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="client-name" className="mb-1.5 block text-sm font-medium text-ink-700">
                Nome
              </label>
              <input
                id="client-name"
                type="text"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className={inputClass}
                placeholder="João da Silva"
              />
            </div>

            <div>
              <label
                htmlFor="client-company"
                className="mb-1.5 block text-sm font-medium text-ink-700"
              >
                Empresa <span className="font-normal text-ink-400">(opcional)</span>
              </label>
              <input
                id="client-company"
                type="text"
                value={form.company}
                onChange={(event) => setForm({ ...form, company: event.target.value })}
                className={inputClass}
                placeholder="MicroFix Informática"
              />
            </div>

            <div>
              <label
                htmlFor="client-email"
                className="mb-1.5 block text-sm font-medium text-ink-700"
              >
                E-mail
              </label>
              <input
                id="client-email"
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className={inputClass}
                placeholder="joao@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="client-phone"
                className="mb-1.5 block text-sm font-medium text-ink-700"
              >
                Telefone <span className="font-normal text-ink-400">(opcional)</span>
              </label>
              <input
                id="client-phone"
                type="tel"
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                className={inputClass}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <label
                htmlFor="client-avatar"
                className="mb-1.5 block text-sm font-medium text-ink-700"
              >
                Avatar <span className="font-normal text-ink-400">(URL, opcional)</span>
              </label>
              <input
                id="client-avatar"
                type="url"
                value={form.avatar}
                onChange={(event) => setForm({ ...form, avatar: event.target.value })}
                className={inputClass}
                placeholder="https://..."
              />
            </div>

            <div>
              <label
                htmlFor="client-status"
                className="mb-1.5 block text-sm font-medium text-ink-700"
              >
                Status
              </label>
              <select
                id="client-status"
                value={form.status}
                onChange={(event) =>
                  setForm({ ...form, status: event.target.value as AdminClient["status"] })
                }
                className={inputClass}
              >
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="client-notes"
                className="mb-1.5 block text-sm font-medium text-ink-700"
              >
                Observações <span className="font-normal text-ink-400">(opcional)</span>
              </label>
              <textarea
                id="client-notes"
                rows={3}
                value={form.notes}
                onChange={(event) => setForm({ ...form, notes: event.target.value })}
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

          {fieldError && <p className="mt-3 text-sm font-medium text-red-600">{fieldError}</p>}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="sm" disabled={saving} onClick={handleSave}>
              {saving ? "Salvando..." : editing ? "Salvar alterações" : "Criar cliente"}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setFormOpen(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {(clients ?? []).length === 0 && (
          <p className="rounded-2xl border border-ink-100 bg-white p-8 text-center text-sm text-ink-500">
            Nenhum cliente cadastrado.
          </p>
        )}

        {clients?.map((client) => (
          <article
            key={client.id}
            className="rounded-2xl border border-ink-100 bg-white p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h3 className="font-display text-base font-bold text-ink-950">{client.name}</h3>
              {client.company && (
                <span className="text-sm text-ink-500">{client.company}</span>
              )}
              <span
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                  client.status === "active"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-ink-200 bg-ink-50 text-ink-500",
                )}
              >
                {client.status}
              </span>
              <span className="ml-auto font-mono text-xs text-ink-400">{client.email}</span>
            </div>

            {client.phone && <p className="mt-1 text-xs text-ink-400">{client.phone}</p>}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => openEdit(client)}
                ariaLabel={`Editar cliente ${client.name}`}
              >
                <EditIcon className="h-4 w-4" />
                Editar
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => openLinks(client)}
                ariaLabel={`Vincular projetos do cliente ${client.name}`}
              >
                Vincular projetos
              </Button>
            </div>

            {client.projectIds.length > 0 && (
              <div className="mt-4 space-y-3 border-t border-ink-100 pt-4">
                {client.projectIds.map((projectId) => {
                  const project = projects.find((item) => item.id === projectId);
                  return (
                    <InvitePanel
                      key={projectId}
                      clientId={client.id}
                      clientName={client.name}
                      projectId={projectId}
                      projectName={project?.name ?? projectId}
                      projectPublished={project?.published ?? false}
                    />
                  );
                })}
              </div>
            )}
          </article>
        ))}
      </div>

      {linksFor && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Vincular projetos de ${linksFor.name}`}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink-950/40 px-4 py-10 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) setLinksFor(null);
          }}
        >
          <div className="w-full max-w-xl rounded-2xl border border-ink-100 bg-white p-6 shadow-xl sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-lg font-bold text-ink-950">{linksFor.name}</h3>
                <p className="mt-0.5 text-sm text-ink-500">
                  Selecione os projetos vinculados a este cliente
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLinksFor(null)}
                aria-label="Fechar"
                className="rounded-full p-2 text-ink-400 transition hover:bg-ink-50 hover:text-ink-900"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-2">
              {projects.length === 0 && (
                <p className="rounded-xl border border-dashed border-ink-200 p-6 text-center text-sm text-ink-500">
                  Nenhum projeto cadastrado ainda.
                </p>
              )}
              {projects.map((project) => {
                const checked = linkSelection.includes(project.id);
                return (
                  <label
                    key={project.id}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-ink-200 bg-white px-4 py-3 transition hover:border-brand-300"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) => {
                        setLinkSelection((current) =>
                          event.target.checked
                            ? [...current, project.id]
                            : current.filter((id) => id !== project.id),
                        );
                      }}
                      className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="flex-1 text-sm font-medium text-ink-900">{project.name}</span>
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                        project.published
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-amber-200 bg-amber-50 text-amber-700",
                      )}
                    >
                      {project.published ? "Publicado" : "Não publicado"}
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="sm" disabled={savingLinks} onClick={handleSaveLinks}>
                {savingLinks ? "Salvando..." : "Salvar vínculos"}
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setLinksFor(null)}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}