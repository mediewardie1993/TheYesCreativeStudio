const { app, BrowserWindow, shell, Menu } = require("electron");
const path = require("path"), fs = require("fs");
// Optional: put admin-config.json ({"url":"https://script.google.com/.../exec","pin":"..."}) next to the exe to skip sign-in.
function presetConfig() {
  for (const dir of [process.env.PORTABLE_EXECUTABLE_DIR, path.dirname(process.execPath), __dirname]) {
    try { const c = JSON.parse(fs.readFileSync(path.join(dir || ".", "admin-config.json"), "utf8")); if (c.url && c.pin) return { u: c.url, p: c.pin }; } catch (e) {}
  }
  return {};
}
function create() {
  const win = new BrowserWindow({ width: 1100, height: 820, minWidth: 380, backgroundColor: "#f6f2ee", title: "Invitation Admin", icon: path.join(__dirname, "www", "icon-512.png") });
  Menu.setApplicationMenu(null);
  win.loadFile(path.join(__dirname, "www", "index.html"), { query: presetConfig() });
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: "deny" }; });
}
app.whenReady().then(create);
app.on("window-all-closed", () => app.quit());
