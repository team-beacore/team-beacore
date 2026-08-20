import { useEffect, useState } from "react";
import { Button } from "../Button";
import {
  createAdminProject,
  listAdminProjects,
  projectCategoryOptions,
  updateAdminProject,
  adminProjectErrorMessages,
  type AdminProject,
  type AdminProjectInput,
} from "../../lib/adminProjects";
import { listAdminClients, type AdminClient } from "../../lib/adminClients";
import { CloseIcon, EditIcon, PlusIcon, UsersIcon } from "../../lib/icons";
import { cn } from "../../lib/utils";
import { InvitePanel } from "./InvitePanel";

const inputClass =
  "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-base text-ink-900 placeholder:text-ink-400 transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10";

const categoryLabels: Record<AdminProject["category"], string> = {
  site: "Site",
  aplicacao: "Aplicação",
  produto: "Produto",
  template: "Template",
};

const emptyForm: AdminProjectInput = {
  id: "",
  name: "",
  category: "site",
  description: "",
  technologies: [],
  demoUrl: "",
  githubUrl: "",
  image: "",
  accent: "#0a5cff",
  featured: false,
  published: true,
  sortOrder: 0,
};

function formFromProject(project: AdminProject): AdminProjectInput {
  return {
    id: project.id,
    name: project.name,
    category: project.category,
    description: project.description,
    technologies: project.technologies,
    demoUrl: project.demoUrl,
    githubUrl: project.githubUrl ?? "",
    image: project.image ?? "",
    accent: project.accent,
    featured: project.featured,
    published: project.published,
    sortOrder: project.sortOrder,
  };
}

export function AdminProjects() {
  const [projects, setProjects] = useState<AdminProject[] | null>(null);
  const [clients, setClients] = useState<AdminClient[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminProject | null>(null);
  const [form, setForm] = useState<AdminProjectInput>(emptyForm);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientsForProject, setClientsForProject] = useState<AdminProject | null>(null);

  function reload() {
    listAdminProjects().then(setProjects);
  }

  function loadClients() {
    listAdminClients().then(setClients);
  }

  useEffect(() => {
    reload();
    loadClients();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFieldError(null);
    setError(null);
    setFormOpen(true);
  }

  function openEdit(project: AdminProject) {
    setEditing(project);
    setForm(formFromProject(project));
    setFieldError(null);
    setError(null);
    setFormOpen(true);
  }

  function validateForm(): string | null {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(form.id.trim()) || form.id.trim().length > 80) {
      return "O id deve conter apenas letras minúsculas, números e hífens.";
    }
    if (!form.name.trim()) return "Informe o nome do projeto.";
    if (!form.description.trim()) return "Informe a descrição do projeto.";
    if (!form.demoUrl.trim()) return "Informe a URL de demonstração.";
    if (!/^#[0-9a-fA-F]{6}$/.test(form.accent.trim())) {
      return "A cor deve estar no formato #RRGGBB (ex.: #0a5cff).";
    }
    return null;
  }

  function handleSave() {
    if (saving) return;

    const invalid = validateForm();
    if (invalid) {
      setFieldError(invalid);
      return;
    }

    setFieldError(null);
    setError(null);
    setSaving(true);

    const payload: AdminProjectInput = {
      ...form,
      id: form.id.trim(),
      name: form.name.trim(),
      description: form.description.trim(),
      demoUrl: form.demoUrl.trim(),
      githubUrl: form.githubUrl.trim(),
      image: form.image.trim(),
      accent: form.accent.trim(),
      sortOrder: Number.isFinite(form.sortOrder) ? form.sortOrder : 0,
    };

    const run = editing
      ? updateAdminProject(editing.id, payload)
      : createAdminProject(payload);

    run.then((result) => {
      setSaving(false);
      if (result.ok) {
        setFormOpen(false);
        setEditing(null);
        reload();
        loadClients();
        return;
      }
      setError(adminProjectErrorMessages[result.reason]);
    });
  }

  function handleTogglePublished(project: AdminProject) {
    const payload = formFromProject(project);
    updateAdminProject(project.id, { ...payload, published: !project.published }).then((result) => {
      if (!result.ok) {
        setError(adminProjectErrorMessages[result.reason]);
        return;
      }
      reload();
    });
  }

  const linkedClients =
    clientsForProject === null
      ? []
      : clients.filter((client) => client.projectIds.includes(clientsForProject.id));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold text-ink-950">Projetos</h2>
          <p className="mt-0.5 text-sm text-ink-500">
            O Supabase é a fonte administrativa. O site público exibe apenas projetos publicados.
          </p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <PlusIcon className="h-4 w-4" />
          Novo projeto
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
              {editing ? "Editar projeto" : "Novo projeto"}
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
              <label htmlFor="project-id" className="mb-1.5 block text-sm font-medium text-ink-700">
                id (slug)
                {editing && (
                  <span className="ml-1 text-xs font-normal text-ink-400">
                    — não alterável na edição
                  </span>
                )}
              </label>
              <input
                id="project-id"
                type="text"
                disabled={editing !== null}
                value={form.id}
                onChange={(event) => setForm({ ...form, id: event.target.value.toLowerCase() })}
                className={cn(inputClass, "disabled:bg-ink-50 disabled:text-ink-400")}
                placeholder="microfix"
              />
            </div>

            <div>
              <label htmlFor="project-name" className="mb-1.5 block text-sm font-medium text-ink-700">
                Nome
              </label>
              <input
                id="project-name"
                type="text"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className={inputClass}
                placeholder="MicroFix Informática"
              />
            </div>

            <div>
              <label
                htmlFor="project-category"
                className="mb-1.5 block text-sm font-medium text-ink-700"
              >
                Categoria
              </label>
              <select
                id="project-category"
                value={form.category}
                onChange={(event) =>
                  setForm({
                    ...form,
                    category: event.target.value as AdminProject["category"],
                  })
                }
                className={inputClass}
              >
                {projectCategoryOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="project-demo"
                className="mb-1.5 block text-sm font-medium text-ink-700"
              >
                demo_url
              </label>
              <input
                id="project-demo"
                type="url"
                value={form.demoUrl}
                onChange={(event) => setForm({ ...form, demoUrl: event.target.value })}
                className={inputClass}
                placeholder="https://..."
              />
            </div>

            <div>
              <label
                htmlFor="project-github"
                className="mb-1.5 block text-sm font-medium text-ink-700"
              >
                github_url <span className="font-normal text-ink-400">(opcional)</span>
              </label>
              <input
                id="project-github"
                type="url"
                value={form.githubUrl}
                onChange={(event) => setForm({ ...form, githubUrl: event.target.value })}
                className={inputClass}
                placeholder="https://github.com/..."
              />
            </div>

            <div>
              <label
                htmlFor="project-image"
                className="mb-1.5 block text-sm font-medium text-ink-700"
              >
                image <span className="font-normal text-ink-400">(URL da imagem)</span>
              </label>
              <input
                id="project-image"
                type="url"
                value={form.image}
                onChange={(event) => setForm({ ...form, image: event.target.value })}
                className={inputClass}
                placeholder="https://..."
              />
            </div>

            <div>
              <label
                htmlFor="project-accent"
                className="mb-1.5 block text-sm font-medium text-ink-700"
              >
                accent <span className="font-normal text-ink-400">(cor #RRGGBB)</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="project-accent"
                  type="text"
                  value={form.accent}
                  onChange={(event) => setForm({ ...form, accent: event.target.value })}
                  className={inputClass}
                  placeholder="#0a5cff"
                />
                <span
                  aria-hidden="true"
                  className="h-10 w-10 shrink-0 rounded-xl border border-ink-200"
                  style={{ backgroundColor: /^#[0-9a-fA-F]{6}$/.test(form.accent) ? form.accent : "#ffffff" }}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="project-sort"
                className="mb-1.5 block text-sm font-medium text-ink-700"
              >
                sort_order
              </label>
              <input
                id="project-sort"
                type="number"
                value={form.sortOrder}
                onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) })}
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="project-description"
                className="mb-1.5 block text-sm font-medium text-ink-700"
              >
                Descrição
              </label>
              <textarea
                id="project-description"
                rows={3}
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="project-technologies"
                className="mb-1.5 block text-sm font-medium text-ink-700"
              >
                Technologies <span className="font-normal text-ink-400">(uma por linha)</span>
              </label>
              <textarea
                id="project-technologies"
                rows={4}
                value={form.technologies.join("\n")}
                onChange={(event) =>
                  setForm({
                    ...form,
                    technologies: event.target.value
                      .split("\n")
                      .map((item) => item.trim())
                      .filter(Boolean),
                  })
                }
                className={`${inputClass} resize-none font-mono text-sm`}
                placeholder={"WordPress\nHTML\nCSS"}
              />
            </div>

            <label className="flex items-center gap-3 text-sm font-medium text-ink-700">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) => setForm({ ...form, featured: event.target.checked })}
                className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
              />
              featured (destaque)
            </label>

            <label className="flex items-center gap-3 text-sm font-medium text-ink-700">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(event) => setForm({ ...form, published: event.target.checked })}
                className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
              />
              published (publicado no site)
            </label>
          </div>

          {fieldError && <p className="mt-3 text-sm font-medium text-red-600">{fieldError}</p>}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="sm" disabled={saving} onClick={handleSave}>
              {saving ? "Salvando..." : editing ? "Salvar alterações" : "Criar projeto"}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setFormOpen(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {(projects ?? []).length === 0 && (
          <p className="rounded-2xl border border-ink-100 bg-white p-8 text-center text-sm text-ink-500">
            Nenhum projeto cadastrado.
          </p>
        )}

        {projects?.map((project) => (
          <article
            key={project.id}
            className="rounded-2xl border border-ink-100 bg-white p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h3 className="font-display text-base font-bold text-ink-950">{project.name}</h3>
              <span className="rounded-full border border-ink-200 bg-ink-50 px-2.5 py-0.5 text-[11px] font-semibold text-ink-600">
                {categoryLabels[project.category]}
              </span>
              <span
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                  project.published
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-amber-200 bg-amber-50 text-amber-700",
                )}
              >
                {project.published ? "Publicado" : "Não publicado"}
              </span>
              {project.featured && (
                <span className="rounded-full border border-brand-200 bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700">
                  Destaque
                </span>
              )}
              <span className="ml-auto font-mono text-xs text-ink-400">{project.id}</span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => openEdit(project)}
                ariaLabel={`Editar projeto ${project.name}`}
              >
                <EditIcon className="h-4 w-4" />
                Editar
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setClientsForProject(project)}
                ariaLabel={`Gerenciar clientes do projeto ${project.name}`}
              >
                <UsersIcon className="h-4 w-4" />
                Gerenciar clientes
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleTogglePublished(project)}
                ariaLabel={
                  project.published
                    ? `Despublicar projeto ${project.name}`
                    : `Publicar projeto ${project.name}`
                }
              >
                {project.published ? "Despublicar" : "Publicar"}
              </Button>
            </div>
          </article>
        ))}
      </div>

      {clientsForProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Clientes do projeto ${clientsForProject.name}`}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink-950/40 px-4 py-10 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) setClientsForProject(null);
          }}
        >
          <div className="w-full max-w-2xl rounded-2xl border border-ink-100 bg-white p-6 shadow-xl sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-lg font-bold text-ink-950">
                  {clientsForProject.name}
                </h3>
                <p className="mt-0.5 text-sm text-ink-500">
                  Clientes vinculados e convites de avaliação
                </p>
              </div>
              <button
                type="button"
                onClick={() => setClientsForProject(null)}
                aria-label="Fechar"
                className="rounded-full p-2 text-ink-400 transition hover:bg-ink-50 hover:text-ink-900"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {linkedClients.length === 0 && (
                <p className="rounded-xl border border-dashed border-ink-200 p-6 text-center text-sm text-ink-500">
                  Nenhum cliente vinculado a este projeto. Vincule clientes na seção Clientes.
                </p>
              )}

              {linkedClients.map((client) => (
                <div key={client.id} className="rounded-xl border border-ink-100 bg-white p-4">
                  <p className="text-sm font-semibold text-ink-900">
                    {client.name}
                    {client.company && <span className="font-medium text-ink-500"> · {client.company}</span>}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-400">{client.email}</p>
                  <div className="mt-3">
                    <InvitePanel
                      clientId={client.id}
                      clientName={client.name}
                      projectId={clientsForProject.id}
                      projectName={clientsForProject.name}
                      projectPublished={clientsForProject.published}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}