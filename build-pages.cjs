// Builds the guest page (i/) and the couple's page (c/) for GitHub Pages.
// Input: the guest page source (guest-source.html, with the invitation content stripped) and couple-source.html.
// Both talk to the Apps Script backend over fetch, so there is no Google banner.
const fs = require("fs"), path = require("path");
const API = "https://script.google.com/macros/s/AKfycbzFcqfGDi2hsJ09sK_4WslxrgyA3h2S94j9AMx1hldGgGP13j_UpWp1XMlTkkFtgvQA/exec";

const shim = `<script>
/* Lets the page use google.script.run / google.script.url exactly as it does inside Apps Script, but over plain fetch. */
(function () {
  var API = ${JSON.stringify(API)};
  if (window.google && google.script && google.script.run) return;
  function mk(ok, bad) {
    return new Proxy({}, { get: function (_, fn) {
      if (fn === "withSuccessHandler") return function (f) { return mk(f, bad); };
      if (fn === "withFailureHandler") return function (f) { return mk(ok, f); };
      return function () {
        var args = [].slice.call(arguments);
        if (fn === "getAppUrl") { if (ok) ok(location.href.split(/[?#]/)[0]); return; }
        // Google's Apps Script redirect occasionally bounces a fresh cross-origin call (not a real network problem) — a couple of quiet retries clears it.
        var attempt = 0;
        function go() {
          attempt++;
          fetch(API, { method: "POST", body: JSON.stringify({ fn: fn, args: args }) })
            .then(function (r) { if (!r.ok && attempt < 3) throw 0; return r.json(); })
            .then(function (j) {
              if (j && j.ok) { if (ok) ok(j.data); return; }
              if (attempt < 3) return retry();
              if (bad) bad(new Error((j && j.error) || "Something went wrong."));
            })
            .catch(function () {
              if (attempt < 3) return retry();
              if (bad) bad(new Error("Google's server had a hiccup. Please try again."));
            });
        }
        function retry() { setTimeout(go, 700 * attempt); }
        go();
      };
    } });
  }
  window.google = { script: { run: mk(null, null), url: { getLocation: function (cb) {
    var p = {}; new URLSearchParams(location.search).forEach(function (v, k) { p[k] = v; }); cb({ parameter: p });
  } } } };
})();
</script>`;

const out = (dir, html) => { fs.mkdirSync(path.join(__dirname, dir), { recursive: true }); fs.writeFileSync(path.join(__dirname, dir, "index.html"), html); };

// guest page: strip the embedded invitation content, inject the shim before the page's own script
let g = fs.readFileSync(path.join(__dirname, "guest-source.html"), "utf8");
g = g.replace(/<script id="config" type="application\/json">[\s\S]*?<\/script>/, () => '<script id="config" type="application/json">{}</script>');
if (g.includes("Kristian")) throw new Error("couple names still in guest page");
g = g.replace('<script src="https://cdnjs', () => shim + '\n<script src="https://cdnjs');
if (!g.includes("google.script.run") || !g.includes(shim.slice(0, 40))) throw new Error("shim missing");
out("i", g);
fs.copyFileSync(path.join(__dirname, "assets", "curtain-open.mp4"), path.join(__dirname, "i", "curtain-open.mp4"));
fs.copyFileSync(path.join(__dirname, "assets", "ring-on.mp4"), path.join(__dirname, "i", "ring-on.mp4"));
fs.copyFileSync(path.join(__dirname, "assets", "door-open.mp4"), path.join(__dirname, "i", "door-open.mp4"));
fs.copyFileSync(path.join(__dirname, "assets", "knot-open.mp4"), path.join(__dirname, "i", "knot-open.mp4"));

// couple page
let c = fs.readFileSync(path.join(__dirname, "couple-source.html"), "utf8");
c = c.replace("<script>\nvar ACC", () => shim + "\n<script>\nvar ACC");
if (!c.includes(shim.slice(0, 40))) throw new Error("shim missing in couple page");
out("c", c);
console.log("built i/ and c/");
