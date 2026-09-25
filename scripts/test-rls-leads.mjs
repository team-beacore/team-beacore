/**
 * Roteiro automatizado de teste das políticas RLS da tabela `leads`.
 *
 * Não usa dependência nenhuma: fala direto com o PostgREST via fetch.
 * Não altera schema. O único efeito colateral é inserir 1 lead de teste
 * (identificável pelo e-mail rls-test+<timestamp>@beacore.test).
 *
 * USO
 *   node scripts/test-rls-leads.mjs
 *
 * Variáveis de ambiente obrigatórias:
 *   SUPABASE_URL        https://<ref>.supabase.co
 *   SUPABASE_ANON_KEY   chave anon (publishable) do projeto
 *
 * Opcionais — habilitam os testes 6, 7 e 8:
 *   ADMIN_EMAIL / ADMIN_PASSWORD    conta que ESTÁ em admin_emails
 *   USER_EMAIL  / USER_PASSWORD     conta autenticada que NÃO é admin
 *
 * Exemplo (bash):
 *   SUPABASE_URL=https://xxx.supabase.co SUPABASE_ANON_KEY=eyJ... \
 *   ADMIN_EMAIL=voce@exemplo.com ADMIN_PASSWORD=... \
 *   node scripts/test-rls-leads.mjs
 */

const URL_BASE = process.env.SUPABASE_URL?.replace(/\/$/, "");
const ANON = process.env.SUPABASE_ANON_KEY;

if (!URL_BASE || !ANON) {
  console.error("Defina SUPABASE_URL e SUPABASE_ANON_KEY. Veja o cabeçalho deste arquivo.");
  process.exit(1);
}

const results = [];
function record(n, description, passed, detail) {
  results.push({ n, description, passed, detail });
  const tag = passed === null ? "PULADO " : passed ? "PASSOU " : "FALHOU ";
  console.log(`${tag} ${String(n).padStart(2)}. ${description}`);
  if (detail) console.log(`          ${detail}`);
}

function headers(token) {
  return {
    apikey: ANON,
    Authorization: `Bearer ${token ?? ANON}`,
    "Content-Type": "application/json",
  };
}

async function signIn(email, password) {
  const res = await fetch(`${URL_BASE}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: ANON, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(`login falhou (${res.status}): ${await res.text()}`);
  return (await res.json()).access_token;
}

const stamp = Date.now();
const testEmail = `rls-test+${stamp}@beacore.test`;

// ---------------------------------------------------------------- 0. tabela existe
{
  const res = await fetch(`${URL_BASE}/rest/v1/leads?select=id&limit=1`, { headers: headers() });
  const body = await res.text();
  const missing = res.status === 404 || body.includes("does not exist") || body.includes("PGRST205");
  record(
    0,
    "Tabela `leads` existe (migration 0011 aplicada)",
    !missing,
    missing ? `HTTP ${res.status} — ${body.slice(0, 160)}` : `HTTP ${res.status}`,
  );
  if (missing) {
    console.log("\nA migration 0011 não está aplicada. Os testes seguintes não fazem sentido.");
    process.exit(1);
  }
}

// ---------------------------------------------------------------- 1. anon INSERT permitido
let insertedOk = false;
{
  const res = await fetch(`${URL_BASE}/rest/v1/leads`, {
    method: "POST",
    headers: { ...headers(), Prefer: "return=minimal" },
    body: JSON.stringify({
      name: "Teste RLS",
      email: testEmail,
      whatsapp: "24998546942",
      need: "site",
      goal: "mais-clientes",
      message: "Lead de teste automatizado das políticas RLS.",
      source: "home",
    }),
  });
  insertedOk = res.status === 201 || res.status === 204;
  record(
    1,
    "Visitante anônimo CONSEGUE inserir lead",
    insertedOk,
    insertedOk ? `HTTP ${res.status}` : `HTTP ${res.status} — ${(await res.text()).slice(0, 200)}`,
  );
}

// ---------------------------------------------------------------- 2. anon SELECT bloqueado
{
  const res = await fetch(`${URL_BASE}/rest/v1/leads?select=*`, { headers: headers() });
  const body = await res.text();
  // Sem policy de SELECT, o PostgREST devolve 200 com lista vazia (RLS filtra tudo)
  // ou 401/403. Qualquer linha retornada é falha.
  const leaked = res.ok && body.trim() !== "[]" && body.trim().startsWith("[");
  record(
    2,
    "Visitante anônimo NÃO consegue listar leads",
    !leaked,
    `HTTP ${res.status} — ${body.slice(0, 120)}`,
  );
}

// ---------------------------------------------------------------- 3. anon UPDATE bloqueado
{
  const res = await fetch(`${URL_BASE}/rest/v1/leads?email=eq.${encodeURIComponent(testEmail)}`, {
    method: "PATCH",
    headers: { ...headers(), Prefer: "return=representation" },
    body: JSON.stringify({ name: "ALTERADO" }),
  });
  const body = await res.text();
  const changed = res.ok && body.trim() !== "[]" && body.includes("ALTERADO");
  record(3, "Visitante anônimo NÃO consegue alterar leads", !changed, `HTTP ${res.status} — ${body.slice(0, 120)}`);
}

// ---------------------------------------------------------------- 4. anon DELETE bloqueado
{
  const res = await fetch(`${URL_BASE}/rest/v1/leads?email=eq.${encodeURIComponent(testEmail)}`, {
    method: "DELETE",
    headers: { ...headers(), Prefer: "return=representation" },
  });
  const body = await res.text();
  const deleted = res.ok && body.trim() !== "[]" && body.trim().startsWith("[{");
  record(4, "Visitante anônimo NÃO consegue apagar leads", !deleted, `HTTP ${res.status} — ${body.slice(0, 120)}`);
}

// ---------------------------------------------------------------- 5. anon RPC bloqueada
{
  const res = await fetch(`${URL_BASE}/rest/v1/rpc/admin_list_leads`, {
    method: "POST",
    headers: headers(),
    body: "{}",
  });
  const body = await res.text();
  const allowed = res.ok && body.trim().startsWith("[{");
  record(
    5,
    "Visitante anônimo NÃO consegue chamar admin_list_leads()",
    !allowed,
    `HTTP ${res.status} — ${body.slice(0, 120)}`,
  );
}

// ---------------------------------------------------------------- 6. não-admin autenticado
if (process.env.USER_EMAIL && process.env.USER_PASSWORD) {
  try {
    const token = await signIn(process.env.USER_EMAIL, process.env.USER_PASSWORD);
    const res = await fetch(`${URL_BASE}/rest/v1/rpc/admin_list_leads`, {
      method: "POST",
      headers: headers(token),
      body: "{}",
    });
    const body = await res.text();
    const allowed = res.ok && body.trim().startsWith("[{");
    record(
      6,
      "Usuário autenticado NÃO-admin NÃO consegue listar leads",
      !allowed,
      `HTTP ${res.status} — ${body.slice(0, 160)}`,
    );
  } catch (err) {
    record(6, "Usuário autenticado NÃO-admin NÃO consegue listar leads", null, String(err.message));
  }
} else {
  record(6, "Usuário autenticado NÃO-admin NÃO consegue listar leads", null, "defina USER_EMAIL/USER_PASSWORD");
}

// ---------------------------------------------------------------- 7 e 8. admin
if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
  try {
    const token = await signIn(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);

    const res = await fetch(`${URL_BASE}/rest/v1/rpc/admin_list_leads`, {
      method: "POST",
      headers: headers(token),
      body: "{}",
    });
    const body = await res.text();
    let rows = [];
    try {
      rows = JSON.parse(body);
    } catch {
      /* body não é JSON */
    }
    const ok = res.ok && Array.isArray(rows);
    record(7, "Admin CONSEGUE listar leads", ok, `HTTP ${res.status} — ${rows.length ?? 0} registro(s)`);

    if (ok && insertedOk) {
      const found = rows.find((r) => r.email === testEmail);
      record(
        8,
        "O lead inserido no teste 1 aparece para o admin (ponta a ponta)",
        Boolean(found),
        found ? `id ${found.id}` : "lead de teste não encontrado na listagem",
      );
      const ordered = rows.every(
        (r, i) => i === 0 || new Date(rows[i - 1].created_at) >= new Date(r.created_at),
      );
      record(9, "Listagem ordenada por created_at DESC", ordered);
    }
  } catch (err) {
    record(7, "Admin CONSEGUE listar leads", null, String(err.message));
  }
} else {
  record(7, "Admin CONSEGUE listar leads", null, "defina ADMIN_EMAIL/ADMIN_PASSWORD");
}

// ---------------------------------------------------------------- resumo
const failed = results.filter((r) => r.passed === false);
const skipped = results.filter((r) => r.passed === null);

console.log("\n" + "-".repeat(64));
console.log(
  `${results.filter((r) => r.passed === true).length} passaram · ${failed.length} falharam · ${skipped.length} pulados`,
);

if (insertedOk) {
  console.log(`\nLimpeza: remova o lead de teste no SQL Editor com`);
  console.log(`  delete from public.leads where email = '${testEmail}';`);
}

if (failed.length > 0) {
  console.log("\nFALHAS — não faça deploy do formulário até resolver:");
  for (const f of failed) console.log(`  ${f.n}. ${f.description}\n     ${f.detail ?? ""}`);
  process.exit(1);
}
