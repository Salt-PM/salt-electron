const {
    dialog
} = require("electron");
const {
    app,
    BrowserWindow,
    ipcMain
} = require("electron");
const ipc = require("electron-ipc-extra");
const salt = require("salt-nodejs");

let win = null;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        //resizable: false,

        width: 916,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
        },
        icon: "./assets/Salt.png",
        title: "Salt",
    });

    win.removeMenu();
    win.loadFile("./ui/index.html");
}

app.whenReady().then(() => {
    createWindow();
});

app.on("window-all-closed", () => {
    app.quit();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
        require("@electron/remote/main").initialize();

    }
});



if (require("electron-squirrel-startup")) return app.quit();

ipcMain.on("open-file", (event, dialogOptions) => {
    let dialogOut = dialog.showOpenDialogSync(dialogOptions);
    if (Array.isArray(dialogOut)) {
        event.returnValue = dialogOut[0];
    } else {
        event.returnValue = dialogOut;
    }
});

ipc.on("saltDownload", async (id) => {
    global.process.stdout.clearLine = function () {};
    global.process.stdout.cursorTo = function () {};
    return await salt.download(id);
});

ipc.on("openDevTools", async (event) => {
    return win.webContents.openDevTools();
});