async function fetchYear() {
    const apiURL = "https://api.github.com/repos/BreezeApps/Yapuka/releases/latest";
    
    try {
        const response = await fetch(apiURL);
        const data = await response.json();

        const commit = data.commit;
        const date = commit.author.date
        document.getElementById("year").innerText = new Date(date).getFullYear()
    } catch (error) {
        document.getElementById("year").innerText =  new Date().getFullYear()
    }
}

async function fetchLatestRelease() {
    const apiURL = "https://api.github.com/repos/BreezeApps/Yapuka/releases/latest";
    
    try {
        const response = await fetch(apiURL);
        const data = await response.json();

        // Mise à jour des liens de téléchargement

        const assets = data.assets;
        assets.forEach(asset => {
            if (asset.name.includes("win.exe") && !asset.name.includes(".blockmap")) {
                document.getElementById("downloadWindows").href = asset.browser_download_url;
            } else if (asset.name.includes("linux.AppImage")) {
                document.getElementById("downloadLinuxAppImage").href = asset.browser_download_url;
            } else if (asset.name.includes("linux.deb")) {
                document.getElementById("downloadLinuxDeb").href = asset.browser_download_url;
            }
        });
    } catch (error) {
        console.error("Erreur lors de la récupération de la dernière version:", error);
    }
}

// Appel de la fonction lors du chargement de la page
fetchLatestRelease();

fetchYear()
