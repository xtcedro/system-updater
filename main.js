const { app, BrowserWindow, ipcMain } = require("electron");
const { execSync } = require("child_process");
const path = require("path");

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false, // Security best practice
            contextIsolation: true
        }
    });

    mainWindow.loadFile("index.html");
});

ipcMain.handle("run-update", async () => {
    try {
        let os = process.platform;
        let command = "";

        if (os === "win32") {
            command = "powershell -Command \"winget upgrade --all\"";
        } else if (os === "darwin") {
            command = "brew update && brew upgrade";
        } else if (os === "linux") {
            command = detectLinuxPackageManager();
        } else {
            return "Unsupported OS.";
        }

        if (!command) return "No suitable package manager found.";

        let output = execSync(command, { encoding: "utf-8" });
        return output || "System update completed.";
    } catch (error) {
        return `Error: ${error.message}`;
    }
});

function detectLinuxPackageManager() {
    const managers = ["apt", "dnf", "yum", "pacman"];
    for (let mgr of managers) {
        try {
            execSync(`command -v ${mgr}`, { stdio: "ignore" });
            return `sudo ${mgr} update && sudo ${mgr} upgrade -y`;
        } catch {}
    }
    return null;
}