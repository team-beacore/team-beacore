export type TeamMember = {
  id: string;
  name: string;
  role: string;
  description: string;
  photo?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  whatsapp?: string;
};

export const team: TeamMember[] = [
  {
    id: "membro-1",
    name: "Endrick Brito",
    role: "Full Stack Developer",
    description: "Desenvolvimento de aplicações web, arquitetura e integração de sistemas.",
    github: "https://github.com/endbit",
    linkedin: "https://www.linkedin.com/in/endrick-brito-32a299426/?enhance=null",
    portfolio: "https://endrick-brito.vercel.app/",
  },
  {
    id: "membro-2",
    photo: "/team/Henrique.jpg",  
    name: "Henrique Carvalho",
    role: "Business Developer",
    description: "Prospecção de clientes, desenvolvimento de oportunidades, reuniões comerciais e negociação de projetos digitais.",
    whatsapp: "5511973390373",
  }
];