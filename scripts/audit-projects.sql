-- Auditoria SOMENTE LEITURA da tabela public.projects.
--
-- Cole no SQL Editor do Supabase e rode. Nenhum comando aqui altera dados:
-- são apenas SELECTs que apontam o que precisa ser corrigido pelo /admin.
--
-- Motivo: a correção da Fase 0 foi aplicada apenas ao fallback local
-- (src/data/projects.ts). A fonte de verdade do portfólio é esta tabela, e ela
-- não foi inspecionada — não há credenciais no ambiente de desenvolvimento.

-- =====================================================================
-- 0. Panorama
-- =====================================================================
select
  count(*)                                              as total,
  count(*) filter (where published)                     as publicados,
  count(*) filter (where featured and published)        as destaques_publicados,
  count(*) filter (where image is null)                 as sem_imagem
from public.projects;


-- =====================================================================
-- 1. Nomes com marcação de rascunho
--    Esperado: 0 linhas. Corrija o campo `name` no /admin > Projetos.
-- =====================================================================
select id, name, published
from public.projects
where name ilike '%constru%'
   or name ilike '%em breve%'
   or name ilike '%coming soon%'
   or name ilike '%teste%'
order by id;


-- =====================================================================
-- 2. Projetos duplicados (mesmo nome, ou mesma URL de demo)
--    Esperado: 0 linhas. Despublique ou apague a cópia no /admin.
-- =====================================================================
select 'nome' as tipo, lower(trim(name)) as chave, count(*) as qtd,
       array_agg(id order by id) as ids
from public.projects
group by 1, 2 having count(*) > 1
union all
select 'demo_url', lower(trim(demo_url)), count(*), array_agg(id order by id)
from public.projects
group by 1, 2 having count(*) > 1;


-- =====================================================================
-- 3. IDs malformados (espaço no início/fim, maiúsculas, espaço interno)
--    Esperado: 0 linhas.
--    ATENÇÃO: `id` é referenciado por feedback_tokens, feedbacks e
--    client_projects. NÃO edite o id direto: crie o projeto com o id correto,
--    migre os vínculos e só então remova o antigo. Se houver feedback
--    associado, fale comigo antes.
-- =====================================================================
select id, '[' || id || ']' as id_visivel, length(id) as tamanho, name
from public.projects
where id <> trim(id)
   or id <> lower(id)
   or id ~ '\s';


-- =====================================================================
-- 4. Imagens hospedadas fora do projeto
--    Esperado: 0 linhas. O repositório já tem as versões locais otimizadas:
--      /projects/microfixinformatica.png   (251 KB)
--      /projects/agenciatiasam.png         (207 KB)
--    Troque o campo `image` no /admin pelo caminho local correspondente.
-- =====================================================================
select id, name, image
from public.projects
where image is not null
  and image not like '/%'
order by id;


-- =====================================================================
-- 5. Destaques simultâneos
--    Mais de um `featured` publicado faz os dois cards ocuparem a largura
--    inteira (lg:col-span-2) e anula o grid de 2 colunas da seção Portfólio.
--    Recomendado: no máximo 1.
-- =====================================================================
select id, name, sort_order
from public.projects
where featured and published
order by sort_order, id;


-- =====================================================================
-- 6. Campos vazios ou suspeitos
-- =====================================================================
select id, name,
       (description is null or length(trim(description)) < 20) as descricao_curta,
       (technologies is null or cardinality(technologies) = 0) as sem_tecnologias,
       (demo_url is null or demo_url = '')                     as sem_demo_url,
       (accent !~* '^#[0-9a-f]{6}$')                           as accent_invalido
from public.projects
where (description is null or length(trim(description)) < 20)
   or (technologies is null or cardinality(technologies) = 0)
   or (demo_url is null or demo_url = '')
   or (accent !~* '^#[0-9a-f]{6}$')
order by id;


-- =====================================================================
-- 7. Quadro completo, para conferência visual
-- =====================================================================
select id, name, category, featured, published, sort_order, image
from public.projects
order by sort_order, id;


-- =====================================================================
-- 8. Vínculos existentes — consulte ANTES de cogitar apagar qualquer projeto
--    Projeto com feedback aprovado ou token emitido não deve ser removido.
-- =====================================================================
select p.id, p.name,
       count(distinct cp.client_id) as clientes_vinculados,
       count(distinct ft.id)        as tokens_emitidos,
       count(distinct f.id)         as feedbacks,
       count(distinct f.id) filter (where f.status = 'approved') as feedbacks_aprovados
from public.projects p
left join public.client_projects  cp on cp.project_id = p.id
left join public.feedback_tokens  ft on ft.project_id = p.id
left join public.feedbacks        f  on f.project_id  = p.id
group by p.id, p.name
order by p.id;
