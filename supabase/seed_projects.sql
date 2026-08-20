insert into public.projects (
  id,
  name,
  category,
  description,
  technologies,
  demo_url,
  github_url,
  image,
  accent,
  featured,
  published,
  sort_order
)
values (
  'microfix',
  'MicroFix Informática (EM CONSTRUÇÃO)',
  'site',
  'Site institucional desenvolvido para fortalecer presença digital e geração de contatos.',
  array['WordPress', 'HTML', 'CSS', 'JavaScript'],
  'https://microfixinformatica.com.br',
  null,
  'https://microfixinformatica.com.br/wp-content/uploads/2026/08/Microfix-Informatica.png',
  '#0a5cff',
  true,
  true,
  0
)
on conflict (id) do nothing;