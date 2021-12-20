const fs = require("fs-extra");
const os = require("os");
const ipc = require("electron-ipc-extra");
const { ipcRenderer } = require("electron");
const salt = require("salt-nodejs");
window.salt = salt;
salt.getCachedListOfItems().then(console.log);

async function saltSearch() {
    let searchTerms = document.getElementById("searchTextInput").value;
    console.log(salt.search(searchTerms).then(console.log));
    window.rows = [];
}

function pickExtensions() {
    let selectedExtension = ipcRenderer.sendSync("open-file", {
        "title": "Select Extensions",
        properties: [
            "openFile",
        ],
        defaultPath: os.homedir(),
        filters: [
            { name: "Salt Extension", extensions: ["saltextension"] },
            { name: "All Files", extensions: ["*"] },
        ],
    });
    return selectedExtension;
}

function pickOutputDestination() {
    let selectedExtension = ipcRenderer.sendSync("open-file", {
        properties: [
            "openDirectory",
            "promptToCreate",
        ],
        defaultPath: os.homedir()
    });
    return selectedExtension;
}

async function saltDownload(id) {
    return await ipc.send("saltDownload", id);
}

async function openDevTools() {
    return ipc.send("openDevTools");
}
