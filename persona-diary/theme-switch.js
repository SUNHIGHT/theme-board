// Theme switcher: floating button + overlay, shared by every diary page.
// Usage: <script src="theme-switch.js" data-theme="p5"></script>
(function () {
  var THEMES = [
    { id: "p5",  file: "persona5.html",  name: "PERSONA 5",   sub: "ペルソナ5風 ─ 赤と黒",           c1: "#e60012", c2: "#0b0b0b" },
    { id: "p3",  file: "persona3.html",  name: "PERSONA 3",   sub: "ペルソナ3風 ─ 蒼い影時間",       c1: "#5ec8ff", c2: "#0a58c8" },
    { id: "mgs3", file: "mgs3.html", name: "METAL GEAR SOLID 3", sub: "MGS3風 ─ スネークイーター", c1: "#e8a23a", c2: "#14110a" }
  ];
  var me = document.currentScript, current = me && me.dataset.theme;
  try { if (current) localStorage.setItem("diary-theme", current); } catch (e) {}

  var css = document.createElement("style");
  css.textContent =
    "#ts-btn{position:fixed;top:12px;right:12px;z-index:50;font:900 13px/1 sans-serif;letter-spacing:.2em;cursor:pointer;" +
    "color:#fff;background:#111;border:2px solid #fff;padding:9px 16px;clip-path:polygon(0 0,100% 0,calc(100% - 10px) 100%,0 100%);transition:.15s}" +
    "#ts-btn:hover{background:#fff;color:#111}" +
    "#ts-ov{position:fixed;inset:0;z-index:60;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.85);font-family:sans-serif}" +
    "#ts-ov.on{display:flex;animation:tsfade .2s}" +
    "@keyframes tsfade{from{opacity:0}}@keyframes tsin{from{opacity:0;transform:translateX(-60px) skewX(8deg)}}" +
    "#ts-box{width:min(520px,92vw)}" +
    "#ts-box h3{color:#fff;letter-spacing:.35em;font-size:14px;margin:0 0 12px;font-weight:900}" +
    ".ts-it{display:flex;align-items:center;gap:14px;width:100%;margin:0 0 10px;padding:14px 18px;text-decoration:none;color:#fff;" +
    "background:#161616;border-left:10px solid var(--a);clip-path:polygon(0 0,100% 0,calc(100% - 16px) 100%,0 100%);" +
    "animation:tsin .35s calc(var(--i)*70ms) cubic-bezier(.2,.9,.3,1) backwards;transition:.15s}" +
    ".ts-it:hover{background:var(--a);color:var(--b);padding-left:30px}" +
    ".ts-it.cur{outline:2px solid #fff;outline-offset:-4px}" +
    ".ts-it i{width:34px;height:34px;flex:none;background:linear-gradient(135deg,var(--a) 50%,var(--b) 50%);border:2px solid #fff;transform:skew(-10deg)}" +
    ".ts-it b{display:block;font-size:20px;letter-spacing:.12em;font-weight:900}" +
    ".ts-it span{font-size:12px;opacity:.8}" +
    "@media (prefers-reduced-motion:reduce){#ts-ov,.ts-it{animation:none!important}}";
  document.head.appendChild(css);

  var btn = document.createElement("button");
  btn.id = "ts-btn"; btn.type = "button"; btn.textContent = "⚙ THEME";
  var ov = document.createElement("div");
  ov.id = "ts-ov";
  ov.innerHTML = '<div id="ts-box"><h3>SELECT THEME ─ テーマ選択</h3>' + THEMES.map(function (t, i) {
    return '<a class="ts-it' + (t.id === current ? " cur" : "") + '" href="' + t.file + '" style="--a:' + t.c1 + ';--b:' + t.c2 + ';--i:' + i + '">' +
      '<i></i><div><b>' + t.name + '</b><span>' + t.sub + (t.id === current ? " ／ 使用中" : "") + '</span></div></a>';
  }).join("") + "</div>";
  document.body.appendChild(btn); document.body.appendChild(ov);

  var toggle = function (on) { ov.classList.toggle("on", on); };
  btn.onclick = function () { toggle(true); };
  ov.onclick = function (e) { if (e.target === ov) toggle(false); };
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") toggle(false); });
})();
