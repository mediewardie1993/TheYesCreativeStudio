// Copies the shared admin web files (repo root) into app/www for the Electron and Android builds.
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
fs.rmSync(path.join(__dirname, "www"), { recursive: true, force: true });
fs.mkdirSync(path.join(__dirname, "www"));
for (const f of ["index.html", "manifest.webmanifest", "sw.js", "icon-192.png", "icon-512.png"]) fs.copyFileSync(path.join(root, f), path.join(__dirname, "www", f));
console.log("web files synced");
