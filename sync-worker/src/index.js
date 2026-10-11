// Diary sync API (Cloudflare Workers + D1).
//   GET  /               health check (no auth)
//   GET  /api/ping       -> { ok, count }
//   GET  /api/entries?since=<ms>  -> { entries: [{date,mood,text,updatedAt}], cursor, more }
//   PUT  /api/entries    body { entries: [{date,mood,text,updatedAt}] } -> { ok, applied }
// Auth: "Authorization: Bearer <SYNC_TOKEN>" (SYNC_TOKEN is a Worker secret).
// Conflict rule: an incoming row only replaces the stored row when its updatedAt is newer (last-write-wins).

const MOODS = ["最高", "良い", "普通", "微妙", "最悪"];
const MAX_BATCH = 500, MAX_TEXT = 100000, PAGE = 500;

function corsHeaders(env, origin) {
  const allow = (env.ALLOWED_ORIGINS || "*").split(",").map(s => s.trim()).filter(Boolean);
  const ok = allow.includes("*") || allow.includes(origin);
  return {
    "Access-Control-Allow-Origin": allow.includes("*") ? "*" : (ok ? origin : allow[0] || ""),
    "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}
const json = (obj, status, cors) => new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...cors } });

async function sameToken(a, b) {
  const enc = new TextEncoder();
  const [ha, hb] = await Promise.all([crypto.subtle.digest("SHA-256", enc.encode(a)), crypto.subtle.digest("SHA-256", enc.encode(b))]);
  const x = new Uint8Array(ha), y = new Uint8Array(hb);
  let d = 0; for (let i = 0; i < x.length; i++) d |= x[i] ^ y[i];
  return d === 0;
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url), cors = corsHeaders(env, req.headers.get("Origin") || "");
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (url.pathname === "/") return json({ ok: true, service: "diary-sync" }, 200, cors);
    if (!url.pathname.startsWith("/api/")) return json({ error: "not found" }, 404, cors);

    const h = req.headers.get("Authorization") || "";
    const token = h.startsWith("Bearer ") ? h.slice(7) : "";
    if (!env.SYNC_TOKEN || !token || !(await sameToken(token, env.SYNC_TOKEN))) return json({ error: "unauthorized" }, 401, cors);

    try {
      if (url.pathname === "/api/ping" && req.method === "GET") {
        const r = await env.DB.prepare("SELECT COUNT(*) AS n FROM entries").first();
        return json({ ok: true, count: r ? r.n : 0 }, 200, cors);
      }
      if (url.pathname === "/api/entries" && req.method === "GET") {
        const since = Math.max(0, Number(url.searchParams.get("since")) || 0);
        const rs = await env.DB.prepare("SELECT date, mood, text, updated_at AS updatedAt, synced_at AS syncedAt FROM entries WHERE synced_at >= ? ORDER BY synced_at ASC, date ASC LIMIT ?").bind(since, PAGE + 1).all();
        const rows = rs.results || [], more = rows.length > PAGE, page = more ? rows.slice(0, PAGE) : rows;
        const cursor = page.length ? page[page.length - 1].syncedAt : since;
        return json({ entries: page.map(({ syncedAt, ...e }) => e), cursor, more }, 200, cors);
      }
      if (url.pathname === "/api/entries" && req.method === "PUT") {
        const body = await req.json().catch(() => null);
        const list = body && Array.isArray(body.entries) ? body.entries : null;
        if (!list || list.length > MAX_BATCH) return json({ error: "bad request" }, 400, cors);
        const now = Date.now(), stmts = [];
        for (const e of list) {
          if (!e || typeof e.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(e.date) || typeof e.text !== "string" || e.text.length > MAX_TEXT) return json({ error: "invalid entry" }, 400, cors);
          const mood = MOODS.includes(e.mood) ? e.mood : null, u = Math.floor(Number(e.updatedAt));
          if (!Number.isFinite(u) || u < 0) return json({ error: "invalid updatedAt" }, 400, cors);
          stmts.push(env.DB.prepare("INSERT INTO entries (date, mood, text, updated_at, synced_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(date) DO UPDATE SET mood = excluded.mood, text = excluded.text, updated_at = excluded.updated_at, synced_at = excluded.synced_at WHERE excluded.updated_at > entries.updated_at").bind(e.date, mood, e.text, u, now));
        }
        const rs = stmts.length ? await env.DB.batch(stmts) : [];
        const applied = rs.reduce((s, r) => s + ((r.meta && r.meta.changes) || 0), 0);
        return json({ ok: true, applied }, 200, cors);
      }
      return json({ error: "not found" }, 404, cors);
    } catch (err) {
      return json({ error: "server error" }, 500, cors);
    }
  },
};
