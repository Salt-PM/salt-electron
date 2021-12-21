const os = require("os");
const ipc = require("electron-ipc-extra");
const { ipcRenderer } = require("electron");
const salt = require("salt-nodejs");
window.salt = salt;
salt.getCachedListOfItems().then(console.log);

window.saltSearch = async function() {
    let searchTerms = document.getElementById("searchTextInput").value;
    console.log(salt.search(searchTerms).then(console.log));
    window.rows = [];
};

window.pickExtensions = function() {
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
};

window.pickOutputDestination = function() {
    let selectedExtension = ipcRenderer.sendSync("open-file", {
        properties: [
            "openDirectory",
            "promptToCreate",
        ],
        defaultPath: os.homedir()
    });
    return selectedExtension;
};

window.saltDownload = async function(id) {
    return await ipc.send("saltDownload", id);
};

window.openDevTools = async function() {
    return ipc.send("openDevTools");
};