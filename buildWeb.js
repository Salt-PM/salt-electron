const fs = require("fs-extra");
const {
    execSync
} = require("child_process");
execSync("npm run build", {
    cwd: "./web",
    stdio: "inherit",
});
try {
    fs.rmSync("./ui", {
        recursive: true
    });
} catch (e) {
    console.log(e);
}
fs.moveSync("./web/build", "./ui");