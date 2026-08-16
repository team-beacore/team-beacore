export type ProjectCategory = "site" | "aplicacao" | "produto" | "template";

export const projectCategories: { id: ProjectCategory; label: string }[] = [
  { id: "site", label: "Sites" },
  { id: "aplicacao", label: "Aplicações" },
  { id: "produto", label: "Produtos" },
  { id: "template", label: "Templates" },
];

export type Project = {
  id: string;
  name: string;
  category: ProjectCategory;
  description: string;
  technologies: string[];
  demoUrl: string;
  githubUrl?: string;
  image?: string;
  accent: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    id: "microfix",
    name: "MicroFix Informática",
    category: "site",
    description:
      "Site institucional desenvolvido para fortalecer presença digital e geração de contatos.",
    technologies: ["WordPress", "HTML", "CSS", "JavaScript"],
    demoUrl: "https://microfixinformatica.com.br",
    image: "",
    accent: "#0a5cff",
    featured: true,
  }
];