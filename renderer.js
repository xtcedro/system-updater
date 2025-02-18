document.getElementById("update-btn").addEventListener("click", async () => {
    const outputElement = document.getElementById("output");
    outputElement.textContent = "Updating system...";
    
    const result = await window.api.runUpdate();
    outputElement.textContent = result;
});