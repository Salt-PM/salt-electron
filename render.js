const os = require("os");
const ipc = require("electron-ipc-extra");
const { ipcRenderer } = require("electron");
const salt = require("salt-nodejs");
window.salt = salt;

window.pickExtensions = function() {
    let selectedExtension = ipcRenderer.sendSync("electronDialog", {
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
    let selectedExtension = ipcRenderer.sendSync("electronDialog", {
        properties: [
            "openDirectory",
            "promptToCreate",
        ],
        defaultPath: os.homedir()
    });
    return selectedExtension;
};

window.saltRunnerAsync = async function(verb, arg1 = null, arg2 = null, arg3 = null) {
    return await ipc.send("saltRunnerAsync", verb, arg1, arg2, arg3);
};

window.openDevTools = async function() {
    return ipc.send("openDevTools");
};