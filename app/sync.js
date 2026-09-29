// Copies the private admin web files (repo root /admin-src, never published to GitHub Pages) into app/www for the Electron and Android builds.
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
fs.rmSync(path.join(__dirname, "www"), { recursive: true, force: true });
fs.mkdirSync(path.join(__dirname, "www"));
for (const f of ["index.html", "manifest.webmanifest", "sw.js", "icon-192.png", "icon-512.png"]) fs.copyFileSync(path.join(root, "admin-src", f), path.join(__dirname, "www", f));
// A copy of the real guest page, bundled so "Preview" can render instantly offline — no network, no Google flakiness.
fs.copyFileSync(path.join(root, "guest-source.html"), path.join(__dirname, "www", "preview-guest.html"));
fs.copyFileSync(path.join(root, "assets", "curtain-open.mp4"), path.join(__dirname, "www", "curtain-open.mp4"));
console.log("web files synced");
// Android/desktop builds: if app/local-config.json exists ({"url":"...","pin":"..."}) it is baked into this build only (git-ignored).
try { const c = JSON.parse(fs.readFileSync(path.join(__dirname, "local-config.json"), "utf8")); fs.writeFileSync(path.join(__dirname, "www", "config.js"), "window.ADMIN_CONFIG = " + JSON.stringify({ url: c.url, pin: c.pin }) + ";"); console.log("baked local-config.json"); } catch (e) {}
