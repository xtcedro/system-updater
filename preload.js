const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    runUpdate: () => ipcRenderer.invoke("run-update")
});