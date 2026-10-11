#!/usr/bin/env node
// Keeps the SEO/GEO parts of the site in sync with the theme list in game-theme-diary/theme-switch.js.
//   node scripts/build-seo.mjs          write the changes
//   node scripts/build-seo.mjs --check  exit 1 when something is out of date (use this before opening a PR)
//
// It updates:
//   - every listed theme page: <title>, meta description, canonical, OGP, and a <noscript> link back to the hub
//   - index.html (the hub): the crawlable theme list, the counts, and the JSON-LD
//   - sitemap.xml (with lastmod from git)
// Pages that are not in the theme list (resident1/2.html, ...) are left alone.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { execSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const BASE = "https://sunhight.github.io/theme-board/";
const DIR = "game-theme-diary/";
const OG = BASE + DIR + "og-image.png";
const CHECK = process.argv.includes("--check");
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const read = f => fs.readFileSync(path.join(ROOT, f), "utf8");
const changed = [];
function put(f, next) {
  const cur = fs.existsSync(path.join(ROOT, f)) ? read(f) : null;
  if (cur === next) return;
  changed.push(f);
  if (!CHECK) fs.writeFileSync(path.join(ROOT, f), next);
}

// ---- theme data (single source of truth) ----
const win = { addEventListener() {} };
vm.runInNewContext(read(DIR + "theme-switch.js"), { window: win, document: { currentScript: null, addEventListener() {} }, Storage: function () {}, localStorage: { getItem() { return null; }, setItem() {} }, setInterval() {} });
const GAMES = win.DIARY_THEMES;
const themes = GAMES.flatMap(g => g.titles.map(t => ({ g, t })));

// ---- theme pages ----
const metaBlock = (url, title, desc) => `<!-- seo:start -->
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Game Theme Diary">
<meta property="og:locale" content="ja_JP">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${OG}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${OG}">
<!-- seo:end -->`;
const NOSCRIPT = `<!-- seo-noscript:start -->
<noscript><p style="font:14px/1.7 sans-serif;padding:16px;color:#fff;background:#111">このテーマは JavaScript を使います。<a href="../" style="color:#9fd8ff">Game Theme Diary(テーマ一覧)</a>から、ほかのテーマも選べます。</p></noscript>
<!-- seo-noscript:end -->`;
for (const { g, t } of themes) {
  const f = DIR + t.file;
  if (!fs.existsSync(path.join(ROOT, f))) { console.error("missing theme file:", f); process.exitCode = 1; continue; }
  const title = `${t.name} ─ 日記`;
  const genres = (g.genres || []).join("・");
  const desc = `${t.name}のメニュー画面の雰囲気で書ける日記テーマ${genres ? `(${genres}系ゲーム風)` : ""}。サブタイトルは「${t.sub}」。無料・登録不要で、日記は端末のブラウザに保存されます。非公式ファンメイド。`;
  let s = read(f);
  s = s.replace(/<title>.*?<\/title>/s, `<title>${esc(title)}</title>`);
  s = s.replace(/<!-- seo:start -->.*?<!-- seo:end -->\n?/s, "");                    // current block
  s = s.replace(/<!-- seo -->\n(?:<meta[^\n]*>\n|<link rel="canonical"[^\n]*>\n)+/, "");                  // legacy block (no end marker)
  s = s.replace(/(<\/title>)/, `$1\n${metaBlock(BASE + f, title, desc)}`);
  s = s.replace(/<!-- seo-noscript:start -->.*?<!-- seo-noscript:end -->\n?/s, "");
  s = s.replace(/(<body[^>]*>)/, `$1\n${NOSCRIPT}`);
  put(f, s);
}

// ---- hub (index.html) ----
const nGames = GAMES.length, nThemes = themes.length;
const list = GAMES.map(g => `      <li><b>${esc(g.name)}</b>${g.genres && g.genres.length ? `(${esc(g.genres.join("・"))})` : ""}: ${g.titles.map(t => `<a href="${DIR}${t.file}">${esc(t.name)}</a>`).join(" / ")}</li>`).join("\n");
const features = [
  `ゲームのメニュー画面風のテーマを選んで日記を書ける(${nGames}作品・${nThemes}テーマ)`,
  "日付ごとの調子と本文の記録",
  "連続日数・ランクなどの表示",
  "カレンダーや履歴の表示(画面はテーマによって異なる)",
  "登録不要・無料。記録はブラウザに保存"
];
const jsonld = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", "@id": BASE + "#website", url: BASE, name: "Game Theme Diary", inLanguage: "ja" },
    { "@type": "WebApplication", "@id": BASE + "#app", name: "Game Theme Diary", url: BASE, isPartOf: { "@id": BASE + "#website" },
      description: "好きなゲームのメニュー画面風の見た目で日記が書ける、無料のWebアプリ(非公式ファンメイド)",
      applicationCategory: "LifestyleApplication", operatingSystem: "Web browser", inLanguage: "ja", isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" }, featureList: features,
      author: { "@type": "Person", name: "SUNHIGHT", url: "https://github.com/SUNHIGHT" }, sameAs: ["https://github.com/SUNHIGHT/theme-board"] }
  ]
});
let hub = read("index.html");
const swap = (re, to) => { if (!re.test(hub)) { console.error("marker not found in index.html:", re); process.exitCode = 1; return; } hub = hub.replace(re, () => to); };
swap(/<!-- seo:list:start -->.*?<!-- seo:list:end -->/s, `<!-- seo:list:start -->\n    <ul>\n${list}\n    </ul>\n    <!-- seo:list:end -->`);
swap(/<!-- seo:counts:start -->.*?<!-- seo:counts:end -->/s, `<!-- seo:counts:start -->${nGames}作品・${nThemes}種類<!-- seo:counts:end -->`);
swap(/<!-- seo:jsonld:start -->.*?<!-- seo:jsonld:end -->/s, `<!-- seo:jsonld:start -->\n<script type="application/ld+json">${jsonld}</script>\n<!-- seo:jsonld:end -->`);
put("index.html", hub);

// ---- sitemap ----
const lastmod = f => { try { return execSync(`git log -1 --format=%cs -- "${f}"`, { cwd: ROOT }).toString().trim() || null; } catch { return null; } };
const today = new Date().toISOString().slice(0, 10);
const urls = [{ loc: BASE, f: "index.html" }, ...themes.map(({ t }) => ({ loc: BASE + DIR + t.file, f: DIR + t.file }))];
put("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(u => `  <url><loc>${u.loc}</loc><lastmod>${lastmod(u.f) || today}</lastmod></url>`).join("\n") + `\n</urlset>\n`);

if (CHECK) {
  if (changed.length) { console.error("Out of date (run `node scripts/build-seo.mjs`):\n  " + changed.join("\n  ")); process.exit(1); }
  console.log(`OK: ${nGames} games / ${nThemes} themes are up to date.`);
} else {
  console.log(changed.length ? `Updated ${changed.length} file(s):\n  ` + changed.join("\n  ") : "Nothing to update.");
}
