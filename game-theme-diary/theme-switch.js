// Theme switcher shared by every diary page.
// - Loaded without data-theme (index.html): only exposes window.DIARY_THEMES.
// - Loaded with data-theme="<id>": adds a floating THEME button + 2-step overlay (game -> numbering).
(function () {
  var GAMES = [
    { id: "persona", name: "PERSONA",          sub: "ペルソナシリーズ",        c1: "#e60012", c2: "#0b0b0b",
      titles: [
        { id: "p3", file: "persona3.html", name: "PERSONA 3", sub: "蒼い影時間", c1: "#5ec8ff", c2: "#0a58c8" },
        { id: "p3r", file: "persona3_reload.html", name: "PERSONA 3 RELOAD", sub: "満月の下の日誌", c1: "#3cc8ff", c2: "#02143f" },
        { id: "p4g", file: "persona4g.html", name: "PERSONA 4 GOLDEN", sub: "霧の中の真実", c1: "#ffd21a", c2: "#c85a00" },
        { id: "p5", file: "persona5.html", name: "PERSONA 5", sub: "赤と黒", c1: "#e60012", c2: "#0b0b0b" },
        { id: "p5s", file: "persona5s.html", name: "PERSONA 5 SCRAMBLE", sub: "ショップの日記帳", c1: "#22cde3", c2: "#f2391b" }
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
        { id: "re4", file: "resident4.html", name: "RESIDENT EVIL 4", sub: "辺境の村" }
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
    { id: "splatoon", name: "SPLATOON",      sub: "スプラトゥーン",           c1: "#ff6a00", c2: "#3b2bff",
      titles: [ { id: "splatoon3", file: "splatoon3.html", name: "SPLATOON 3", sub: "バンカラ地方" } ] },
    { id: "mario",  name: "SUPER MARIO",       sub: "スーパーマリオ",           c1: "#e83800", c2: "#5c94fc",
      titles: [ { id: "mario", file: "mario.html", name: "SUPER MARIO BROS.", sub: "キノコ王国 1-1" } ] },
    { id: "zelda",  name: "THE LEGEND OF ZELDA", sub: "ゼルダの伝説",         c1: "#f5d76e", c2: "#08170d",
      titles: [ { id: "zelda_oot", file: "zelda_oot.html", name: "OCARINA OF TIME", sub: "時のオカリナ" } ] },
    { id: "danganronpa", name: "DANGANRONPA", sub: "ダンガンロンパ",           c1: "#ff2d7a", c2: "#0a0a0a",
      titles: [ { id: "danganronpa", file: "danganronpa.html", name: "TRIGGER HAPPY HAVOC", sub: "希望ヶ峰学園" } ] },
    { id: "armoredcore", name: "ARMORED CORE", sub: "アーマード・コア",        c1: "#ff6a00", c2: "#0b0d10",
      titles: [ { id: "ac6", file: "ac6.html", name: "ARMORED CORE VI", sub: "ルビコン3" } ] },
    { id: "papers",  name: "PAPERS, PLEASE",    sub: "ペーパーズ・プリーズ",     c1: "#8b1e1e", c2: "#d9d2a8",
      titles: [ { id: "papers", file: "papers.html", name: "PAPERS, PLEASE", sub: "グレスティン国境" } ] },
    { id: "aceattorney", name: "ACE ATTORNEY", sub: "逆転裁判",                 c1: "#ff9a00", c2: "#0b1d4d",
      titles: [ { id: "ace", file: "ace_attorney.html", name: "ACE ATTORNEY", sub: "逆転裁判" } ] },
    { id: "metalslug", name: "METAL SLUG",     sub: "メタルスラッグ",           c1: "#ffd400", c2: "#434c22",
      titles: [ { id: "metalslug", file: "metalslug.html", name: "METAL SLUG", sub: "出撃!" } ] },
    { id: "dq",     name: "DRAGON QUEST",      sub: "ドラゴンクエスト",         c1: "#7ec8ff", c2: "#04042c",
      titles: [ { id: "dq11", file: "dq11.html", name: "DRAGON QUEST XI", sub: "過ぎ去りし時を求めて" } ] },
    { id: "xenoblade", name: "XENOBLADE", sub: "ゼノブレイド",           c1: "#4a63ff", c2: "#0c1470",
      titles: [
        { id: "xb2", file: "xenoblade2.html", name: "XENOBLADE 2", sub: "アルストの空", c1: "#4a63ff", c2: "#0c1470" },
        { id: "xb3", file: "xenoblade3.html", name: "XENOBLADE 3", sub: "アイオニオンの記憶", c1: "#ff8240", c2: "#2b1163" }
      ] },
    { id: "nier", name: "NIER:AUTOMATA", sub: "ニーア オートマタ",        c1: "#d2cdb8", c2: "#4b473b",
      titles: [ { id: "nier", file: "nier.html", name: "NIER:AUTOMATA", sub: "人類に栄光あれ" } ] },
    { id: "gravity", name: "GRAVITY DAZE", sub: "グラビティデイズ",       c1: "#f2c14e", c2: "#0b1030",
      titles: [ { id: "gd2", file: "gravitydaze2.html", name: "GRAVITY DAZE 2", sub: "重力的眩暈完結編" } ] },
    { id: "jump", name: "JUMP ULTIMATE STARS", sub: "ジャンプアルティメットスターズ", c1: "#e9532b", c2: "#2a1a5e",
      titles: [ { id: "jus", file: "jump_stars.html", name: "JUMP ULTIMATE STARS", sub: "コマ割りの大乱闘" } ] },
    { id: "atelier", name: "ATELIER", sub: "アトリエシリーズ",             c1: "#ffd21a", c2: "#6b3b22",
      titles: [ { id: "sophie", file: "atelier_sophie.html", name: "ATELIER SOPHIE", sub: "不思議な本の錬金術士" } ] },
    { id: "paranoma", name: "PARANORMASIGHT", sub: "パラノマサイト",          c1: "#3f8068", c2: "#0d241d",
      titles: [ { id: "paranoma", file: "paranormasight.html", name: "PARANORMASIGHT", sub: "本所七不思議" } ] },
    { id: "bloodborne", name: "BLOODBORNE", sub: "ブラッドボーン",           c1: "#c9a96a", c2: "#0a0c0f",
      titles: [ { id: "bb", file: "bloodborne.html", name: "BLOODBORNE", sub: "狩人の夢" } ] },
    { id: "efootball", name: "EFOOTBALL", sub: "eFootball",               c1: "#fff200", c2: "#0a14ee",
      titles: [ { id: "efb", file: "efootball.html", name: "EFOOTBALL", sub: "ホーム画面" } ] },
    { id: "valkyrie", name: "VALKYRIE PROFILE", sub: "ヴァルキリープロファイル", c1: "#c9d6ff", c2: "#0a0820",
      titles: [ { id: "valkyrie", file: "valkyrie.html", name: "VALKYRIE PROFILE", sub: "レナス" } ] },
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
    zzz: ["アクション", "RPG"], ff: ["RPG"], cyberpunk: ["RPG", "シューター"], mh: ["アクション"],
    splatoon: ["シューター", "アクション"], mario: ["アクション"], zelda: ["アクション", "RPG"], danganronpa: ["アドベンチャー"], armoredcore: ["アクション", "シューター"],
    papers: ["シミュレーション", "アドベンチャー"], aceattorney: ["アドベンチャー"], metalslug: ["シューター", "アクション"], dq: ["RPG"], valkyrie: ["RPG"], xenoblade: ["RPG"], nier: ["RPG", "アクション"], gravity: ["アクション", "アドベンチャー"], jump: ["アクション"], atelier: ["RPG", "シミュレーション"], paranoma: ["ホラー", "アドベンチャー"], bloodborne: ["RPG", "アクション", "ホラー"], efootball: ["シミュレーション"]
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

  // Floating button that returns to the first screen (index.html) to pick another theme.
  var css = document.createElement("style");
  css.textContent =
    "#ts-btn{position:fixed;top:12px;right:12px;z-index:50;font:900 13px/1 sans-serif;letter-spacing:.2em;cursor:pointer;text-decoration:none;" +
    "color:#fff;background:#111;border:2px solid #fff;padding:9px 16px;clip-path:polygon(0 0,100% 0,calc(100% - 10px) 100%,0 100%);transition:.15s}" +
    "#ts-btn:hover{background:#fff;color:#111}";
  document.head.appendChild(css);

  var btn = document.createElement("a");
  btn.id = "ts-btn"; btn.href = "index.html"; btn.textContent = "\u2302 THEME";
  btn.setAttribute("aria-label", "テーマ選択に戻る");
  document.body.appendChild(btn);
})();
