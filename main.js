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
        icon: "./assets/512x512.png",
        title: "Salt Manager",
    });

    //win.removeMenu();
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

ipcMain.on("electronDialog", (event, dialogOptions) => {
    let dialogOut = dialog.showOpenDialogSync(dialogOptions);
    if (Array.isArray(dialogOut)) {
        event.returnValue = dialogOut[0];
    } else {
        event.returnValue = dialogOut;
    }
});

ipc.on("saltRunnerAsync", async (verb, arg1 = null, arg2 = null, arg3 = null) => {
    return await salt[verb](arg1, arg2, arg3);
});

ipc.on("openDevTools", async (event) => {
    return win.webContents.openDevTools();
});