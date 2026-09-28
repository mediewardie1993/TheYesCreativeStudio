const { app, BrowserWindow, shell, Menu } = require("electron");
const path = require("path");
function create() {
  const win = new BrowserWindow({ width: 1100, height: 820, minWidth: 380, backgroundColor: "#f6f2ee", title: "Invitation Admin", icon: path.join(__dirname, "www", "icon-512.png") });
  Menu.setApplicationMenu(null);
  win.loadFile(path.join(__dirname, "www", "index.html"));
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: "deny" }; });
}
app.whenReady().then(create);
app.on("window-all-closed", () => app.quit());
