// Theme switcher shared by every diary page.
// - Loaded without data-theme (index.html): only exposes window.DIARY_THEMES.
// - Loaded with data-theme="<id>": adds a floating THEME button + 2-step overlay (game -> numbering).
(function () {
  var GAMES = [
    { id: "persona", name: "PERSONA",          sub: "ペルソナシリーズ",        c1: "#e60012", c2: "#0b0b0b",
      titles: [
        { id: "p3", file: "persona3.html", name: "PERSONA 3", sub: "蒼い影時間" },
        { id: "p5", file: "persona5.html", name: "PERSONA 5", sub: "赤と黒" }
      ] },
    { id: "destiny", name: "DESTINY",          sub: "デスティニーシリーズ",     c1: "#7fd4ff", c2: "#0a1018",
      titles: [
        { id: "destiny1", file: "destiny1.html", name: "DESTINY",   sub: "旅人の光" },
        { id: "destiny2", file: "destiny2.html", name: "DESTINY 2", sub: "ディレクター" }
      ] },
    { id: "apex",    name: "APEX LEGENDS",     sub: "エーペックスレジェンズ",   c1: "#e03b3b", c2: "#0d0f12",
      titles: [ { id: "apex", file: "apex.html", name: "APEX LEGENDS", sub: "チャンピオンになれ" } ] },
    { id: "darksouls", name: "DARK SOULS",      sub: "ダークソウルシリーズ",     c1: "#d9822b", c2: "#0b0a08",
      titles: [
        { id: "darksouls1", file: "darksouls1.html", name: "DARK SOULS",   sub: "ロードラン" },
        { id: "darksouls2", file: "darksouls2.html", name: "DARK SOULS II", sub: "ドラングレイグ" },
        { id: "darksouls3", file: "darksouls3.html", name: "DARK SOULS III", sub: "ロスリック" }
      ] },
    { id: "eldenring", name: "ELDEN RING",     sub: "エルデンリング",           c1: "#e8c46a", c2: "#0b0905",
      titles: [ { id: "eldenring", file: "eldenring.html", name: "ELDEN RING", sub: "狭間の地" } ] },
    { id: "resident", name: "RESIDENT EVIL",  sub: "バイオハザード",           c1: "#c9a15a", c2: "#0d0907",
      titles: [
        { id: "re1", file: "resident1.html", name: "RESIDENT EVIL",   sub: "洋館事件" },
        { id: "re2", file: "resident2.html", name: "RESIDENT EVIL 2", sub: "ラクーンシティ" }
      ] },
    { id: "backrooms", name: "BACKROOMS",      sub: "バックルーム",             c1: "#cdbb55", c2: "#3a3414",
      titles: [
        { id: "level0",    file: "backrooms0.html", name: "LEVEL 0",   sub: "終わらない黄色い部屋" },
        { id: "level1",    file: "backrooms1.html", name: "LEVEL 1",   sub: "居住可能地帯" },
        { id: "poolrooms", file: "poolrooms.html",  name: "POOLROOMS", sub: "水の部屋" }
      ] },
    { id: "chrono",  name: "CHRONO TRIGGER",   sub: "クロノ・トリガー",         c1: "#ffe27a", c2: "#1b2a8a",
      titles: [ { id: "chrono", file: "chrono.html", name: "CHRONO TRIGGER", sub: "時の旅人" } ] },
    { id: "edf",     name: "EARTH DEFENSE FORCE", sub: "地球防衛軍",           c1: "#ffb000", c2: "#0b100b",
      titles: [ { id: "edf6", file: "edf6.html", name: "EDF 6", sub: "地球防衛軍6" } ] },
    { id: "fallout", name: "FALLOUT",           sub: "フォールアウト",           c1: "#3dff7a", c2: "#010502",
      titles: [
        { id: "fallout3", file: "fallout3.html", name: "FALLOUT 3", sub: "キャピタル・ウェイストランド" },
        { id: "fallout4", file: "fallout4.html", name: "FALLOUT 4", sub: "コモンウェルス" }
      ] },
    { id: "zzz",    name: "ZENLESS ZONE ZERO", sub: "ゼンレスゾーンゼロ",       c1: "#e1ff00", c2: "#09090a",
      titles: [ { id: "zzz", file: "zzz.html", name: "ZENLESS ZONE ZERO", sub: "ニューエリー都" } ] },
    { id: "ff",     name: "FINAL FANTASY",     sub: "ファイナルファンタジー",   c1: "#6dffc4", c2: "#0c1d82",
      titles: [ { id: "ff7", file: "ff7.html", name: "FINAL FANTASY VII", sub: "ミッドガル" } ] },
    { id: "cyberpunk", name: "CYBERPUNK 2077", sub: "サイバーパンク2077",       c1: "#fcee0a", c2: "#08070b",
      titles: [ { id: "cyberpunk", file: "cyberpunk.html", name: "CYBERPUNK 2077", sub: "ナイトシティ" } ] },
    { id: "mh",     name: "MONSTER HUNTER",    sub: "モンスターハンター",       c1: "#f08a24", c2: "#241709",
      titles: [ { id: "mh2g", file: "mh2g.html", name: "MONSTER HUNTER 2G", sub: "ドンドルマ" } ] },
    { id: "mgs",     name: "METAL GEAR SOLID", sub: "メタルギアソリッドシリーズ", c1: "#e8a23a", c2: "#14110a",
      titles: [
        { id: "mgs1", file: "mgs1.html", name: "METAL GEAR SOLID",   sub: "シャドー・モセス" },
        { id: "mgs2", file: "mgs2.html", name: "METAL GEAR SOLID 2", sub: "サンズ・オブ・リバティ" },
        { id: "mgs3", file: "mgs3.html", name: "METAL GEAR SOLID 3", sub: "スネークイーター" },
        { id: "mgs4", file: "mgs4.html", name: "METAL GEAR SOLID 4", sub: "ガンズ・オブ・ザ・パトリオット" }
      ] }
  ];
  var GENRES = {
    persona: ["RPG"], mgs: ["ステルス", "アクション"], destiny: ["シューター"], apex: ["シューター"],
    darksouls: ["アクション", "RPG"], eldenring: ["アクション", "RPG"], resident: ["ホラー", "アクション"],
    backrooms: ["ホラー"], chrono: ["RPG"], edf: ["シューター", "アクション"], fallout: ["RPG", "シューター"],
    zzz: ["アクション", "RPG"], ff: ["RPG"], cyberpunk: ["RPG", "シューター"], mh: ["アクション"]
  };
  GAMES.forEach(function (g) { g.genres = GENRES[g.id] || []; });
  window.DIARY_THEMES = GAMES;

  var me = document.currentScript, current = me && me.dataset.theme;
  if (!current) return;
  try {
    localStorage.setItem("diary-theme", current);
    var rec = JSON.parse(localStorage.getItem("diary-recent") || "[]").filter(function (x) { return x !== current; });
    rec.unshift(current); localStorage.setItem("diary-recent", JSON.stringify(rec.slice(0, 30)));
  } catch (e) {}

  var css = document.createElement("style");
  css.textContent =
    "#ts-btn{position:fixed;top:12px;right:12px;z-index:50;font:900 13px/1 sans-serif;letter-spacing:.2em;cursor:pointer;" +
    "color:#fff;background:#111;border:2px solid #fff;padding:9px 16px;clip-path:polygon(0 0,100% 0,calc(100% - 10px) 100%,0 100%);transition:.15s}" +
    "#ts-btn:hover{background:#fff;color:#111}" +
    "#ts-ov{position:fixed;inset:0;z-index:60;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.85);font-family:sans-serif}" +
    "#ts-ov.on{display:flex;animation:tsfade .2s}" +
    "@keyframes tsfade{from{opacity:0}}@keyframes tsin{from{opacity:0;transform:translateX(-60px) skewX(8deg)}}" +
    "#ts-box{width:min(520px,92vw);max-height:92vh;overflow-y:auto;padding:4px 6px 4px 0}" +
    "#ts-q{width:100%;margin:0 0 12px;padding:10px 12px;font:700 14px sans-serif;color:#fff;background:#0c0c0c;border:2px solid #fff;outline:none}#ts-q:focus{border-color:#7fd4ff}" +
    ".ts-home{display:inline-block;margin-left:14px;color:#fff;font:900 12px sans-serif;letter-spacing:.2em;opacity:.8}.ts-home:hover{opacity:1}" +
    "#ts-box h3{color:#fff;letter-spacing:.3em;font-size:14px;margin:0 0 12px;font-weight:900}" +
    ".ts-it{display:flex;align-items:center;gap:14px;width:100%;margin:0 0 10px;padding:14px 18px;text-decoration:none;color:#fff;font:inherit;text-align:left;cursor:pointer;border:0;" +
    "background:#161616;border-left:10px solid var(--a);clip-path:polygon(0 0,100% 0,calc(100% - 16px) 100%,0 100%);" +
    "animation:tsin .35s calc(var(--i)*70ms) cubic-bezier(.2,.9,.3,1) backwards;transition:.15s}" +
    ".ts-it:hover{background:var(--a);color:var(--b);padding-left:30px}" +
    ".ts-it.cur{outline:2px solid #fff;outline-offset:-4px}" +
    ".ts-it i{width:34px;height:34px;flex:none;background:linear-gradient(135deg,var(--a) 50%,var(--b) 50%);border:2px solid #fff;transform:skew(-10deg)}" +
    ".ts-it b{display:block;font-size:20px;letter-spacing:.12em;font-weight:900}" +
    ".ts-it span{font-size:12px;opacity:.8}" +
    ".ts-back{background:none;border:0;color:#fff;font:900 12px sans-serif;letter-spacing:.2em;cursor:pointer;margin-bottom:10px;padding:4px 0;opacity:.8}" +
    ".ts-back:hover{opacity:1;text-decoration:underline}" +
    "@media (prefers-reduced-motion:reduce){#ts-ov,.ts-it{animation:none!important}}";
  document.head.appendChild(css);

  var btn = document.createElement("button");
  btn.id = "ts-btn"; btn.type = "button"; btn.textContent = "⚙ THEME";
  var ov = document.createElement("div"); ov.id = "ts-ov";
  document.body.appendChild(btn); document.body.appendChild(ov);

  var curGame = GAMES.filter(function (g) { return g.titles.some(function (t) { return t.id === current; }); })[0];

  function norm(s) { return String(s).toLowerCase().replace(/\s+/g, ""); }
  function gameItems(q) {
    var n = norm(q);
    return GAMES.filter(function (g) {
      return !n || norm(g.name + g.sub + g.genres.join("") + g.titles.map(function (t) { return t.name + t.sub; }).join("")).indexOf(n) >= 0;
    }).map(function (g, i) {
      return '<button type="button" class="ts-it' + (g === curGame ? " cur" : "") + '" data-g="' + g.id + '" style="--a:' + g.c1 + ';--b:' + g.c2 + ';--i:' + Math.min(i, 8) + '">' +
        '<i></i><div><b>' + g.name + '</b><span>' + g.sub + ' ／ ' + g.genres.join("・") + (g === curGame ? " ／ 使用中" : "") + '</span></div></button>';
    }).join("") || '<p style="color:#fff;opacity:.7;font-size:13px">該当するゲームがありません。</p>';
  }
  function showGames() {
    ov.innerHTML = '<div id="ts-box"><h3>SELECT GAME ─ ゲーム選択<a class="ts-home" href="index.html">HOME ▸</a></h3>' +
      '<input id="ts-q" type="search" placeholder="ゲーム名・ジャンルで検索" autocomplete="off"><div id="ts-list">' + gameItems("") + "</div></div>";
  }
  function showTitles(g) {
    ov.innerHTML = '<div id="ts-box"><button type="button" class="ts-back" data-back="1">◀ BACK ─ ゲーム選択へ</button><h3>' + g.name + ' ─ ナンバリング選択</h3>' +
      g.titles.map(function (t, i) {
        return '<a class="ts-it' + (t.id === current ? " cur" : "") + '" href="' + t.file + '" style="--a:' + g.c1 + ';--b:' + g.c2 + ';--i:' + i + '">' +
          '<i></i><div><b>' + t.name + '</b><span>' + t.sub + (t.id === current ? " ／ 使用中" : "") + '</span></div></a>';
      }).join("") + "</div>";
  }
  ov.addEventListener("click", function (e) {
    if (e.target === ov) { ov.classList.remove("on"); return; }
    if (e.target.closest("[data-back]")) { showGames(); return; }
    var b = e.target.closest("[data-g]");
    if (b) showTitles(GAMES.filter(function (g) { return g.id === b.dataset.g; })[0]);
  });
  ov.addEventListener("input", function (e) { if (e.target.id === "ts-q") document.getElementById("ts-list").innerHTML = gameItems(e.target.value); });
  btn.onclick = function () { curGame ? showTitles(curGame) : showGames(); ov.classList.add("on"); };
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") ov.classList.remove("on"); });
})();
