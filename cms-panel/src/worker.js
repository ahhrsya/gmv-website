// GMV CMS Cloudflare Worker
// - GET  /            → CMS panel UI (index.html)
// - GET  /api/content → return home.md frontmatter parsed
// - POST /api/content → save changes back to home.md (via GitHub API, optional KV cache)
// - Static asset serving for /styles.css, /app.js

const HOMEPAGE_RAW_URL =
  'https://raw.githubusercontent.com/ahhrsya/gmv-website/main/content/home.md';

// ─── Tiny frontmatter parser/serializer ───────────────────────────────────────

function parseFrontmatter(raw) {
  if (!raw.startsWith('---')) return { fm: {}, body: raw };
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return { fm: {}, body: raw };
  const fmBlock = raw.slice(3, end).trim();
  const body = raw.slice(end + 4).replace(/^\n/, '');
  const fm = {};
  let i = 0;
  while (i < fmBlock.length) {
    const nl = fmBlock.indexOf('\n', i);
    const line = fmBlock.slice(i, nl === -1 ? fmBlock.length : nl);
    if (!line.trim()) { i = nl + 1; continue; }
    const colon = line.indexOf(':');
    if (colon === -1) { i = nl + 1; continue; }
    const key = line.slice(0, colon).trim();
    let val = line.slice(colon + 1).trim();
    if (val.startsWith('"') && val.endsWith('"')) {
      val = JSON.parse(val);
    } else if (val.startsWith("'") && val.endsWith("'")) {
      val = val.slice(1, -1);
    }
    fm[key] = val;
    i = nl + 1;
  }
  return { fm, body };
}

function serializeFrontmatter(fm, body) {
  const esc = (s) => String(s ?? '').replace(/"/g, '\\"');
  const lines = ['---'];
  for (const [k, v] of Object.entries(fm)) {
    if (typeof v === 'object' && v !== null) {
      lines.push(`${k}: ${JSON.stringify(v)}`);
    } else {
      lines.push(`${k}: "${esc(v)}"`);
    }
  }
  lines.push('---', '');
  return lines.join('\n') + (body ?? '');
}

// ─── KV helpers ───────────────────────────────────────────────────────────────

async function kvGet(env, key) {
  if (!env.CMS_KV) return null;
  const v = await env.CMS_KV.get(key);
  return v ? JSON.parse(v) : null;
}

async function kvPut(env, key, value) {
  if (!env.CMS_KV) return;
  await env.CMS_KV.put(key, JSON.stringify(value), { expirationTtl: 60 * 60 * 24 * 30 });
}

// ─── GitHub write (optional, requires GITHUB_TOKEN + GITHUB_REPO secrets) ────

async function commitToGithub(env, newContent, sha) {
  if (!env.GITHUB_TOKEN || !env.GITHUB_REPO) return { ok: false, reason: 'not-configured' };
  const url = `https://api.github.com/repos/${env.GITHUB_REPO}/contents/content/home.md`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'gmv-cms-worker',
    },
    body: JSON.stringify({
      message: 'cms: update home.md via panel',
      content: btoa(unescape(encodeURIComponent(newContent))),
      sha,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    return { ok: false, reason: `github-api-${res.status}`, detail: err };
  }
  return { ok: true };
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    // API: read
    if (path === '/api/content' && request.method === 'GET') {
      return handleGet(env);
    }

    // API: write
    if (path === '/api/content' && request.method === 'POST') {
      return handlePost(request, env);
    }

    // Static assets — same origin, no need to bundle
    if (path === '/styles.css' || path === '/app.js' || path === '/' || path === '/index.html') {
      return serveStatic(path);
    }

    return new Response('Not found', { status: 404 });
  },
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

async function handleGet(env) {
  try {
    // Try KV cache first
    let raw = null;
    if (env.CMS_KV) {
      raw = await env.CMS_KV.get('home.md:raw');
    }
    if (!raw) {
      const res = await fetch(HOMEPAGE_RAW_URL, { cf: { cacheTtl: 0 } });
      if (!res.ok) {
        return json({ error: `upstream ${res.status}` }, 502);
      }
      raw = await res.text();
      if (env.CMS_KV) {
        await env.CMS_KV.put('home.md:raw', raw, { expirationTtl: 60 * 5 });
      }
    }
    const { fm } = parseFrontmatter(raw);
    return json({
      file: 'home',
      en:     fm.en     ?? {},
      id:     fm.id     ?? {},
      shared: fm.shared ?? {},
    });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'unknown' }, 500);
  }
}

async function handlePost(request, env) {
  let body;
  try { body = await request.json(); }
  catch { return json({ error: 'Invalid JSON' }, 400); }

  const { en = {}, id = {}, shared = {} } = body;
  if (typeof en !== 'object' || typeof id !== 'object' || typeof shared !== 'object') {
    return json({ error: 'Invalid payload' }, 400);
  }

  try {
    let raw = null;
    let sha = null;
    if (env.CMS_KV) {
      raw = await env.CMS_KV.get('home.md:raw');
      sha = await env.CMS_KV.get('home.md:sha');
    }
    if (!raw) {
      const res = await fetch(HOMEPAGE_RAW_URL, { cf: { cacheTtl: 0 } });
      if (!res.ok) return json({ error: `upstream ${res.status}` }, 502);
      raw = await res.text();
      sha = res.headers.get('ETag')?.replace(/"/g, '') ?? null;
    }

    const { fm, body: contentBody } = parseFrontmatter(raw);
    const newFm = { ...fm, en, id, shared };
    const newRaw = serializeFrontmatter(newFm, contentBody);

    // Try GitHub commit first (permanent)
    const gh = await commitToGithub(env, newRaw, sha);

    // Always cache in KV so reads are fast
    if (env.CMS_KV) {
      await env.CMS_KV.put('home.md:raw', newRaw, { expirationTtl: 60 * 60 * 24 });
    }

    if (gh.ok) {
      return json({ ok: true, source: 'github', deployed: true });
    }
    if (gh.reason === 'not-configured') {
      return json({
        ok: true,
        source: 'kv-only',
        deployed: false,
        note: 'GITHUB_TOKEN not set — change is cached in KV. To deploy permanently, configure GITHUB_TOKEN + GITHUB_REPO secrets.',
      });
    }
    return json({ ok: false, error: gh.reason, detail: gh.detail }, 502);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'unknown' }, 500);
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  });
}

async function serveStatic(path) {
  const map = {
    '/':           'index.html',
    '/index.html': 'index.html',
    '/styles.css': 'styles.css',
    '/app.js':     'app.js',
  };
  const filename = map[path];
  if (!filename) return new Response('Not found', { status: 404 });
  return new Response(null, { status: 302, headers: { Location: `/public/${filename}` } });
}
