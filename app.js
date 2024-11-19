// Configuration
const ORG_NAME = "BreezeApps"; // Remplacez par votre nom d'organisation GitHub
const ORG_API_URL = `https://api.github.com/orgs/${ORG_NAME}`;
const REPOS_API_URL = `https://api.github.com/orgs/${ORG_NAME}/repos`;
const projectList = document.getElementById("project-list");
const EXCLUDED_REPOS = ["site"]; // Liste des dépôts à exclure

async function fetchYear() {    
    try {
        document.getElementById("year").innerText = new Date().getFullYear()
    } catch (error) {
        document.getElementById("year").innerText =  new Date().getFullYear()
    }
}

fetchYear()

// Fonction pour récupérer le logo de l'organisation
async function fetchOrganizationLogo() {
    try {
        const response = await fetch(ORG_API_URL);
        const data = await response.json();
        const logoElement = document.getElementById("org-logo");
        logoElement.src = data.avatar_url; // URL du logo de l'organisation
        logoElement.alt = `${ORG_NAME} Logo`;
    } catch (error) {
        console.error("Error fetching organization logo:", error);
    }
}

// Fonction pour récupérer les projets
async function fetchProjects() {
    try {
        const response = await fetch(REPOS_API_URL);
        const repos = await response.json();

        repos.forEach(repo => {
            // Exclure les dépôts indésirables
            if (EXCLUDED_REPOS.includes(repo.name)) return;

            const listItem = document.createElement("li");
            listItem.classList.add("bg-white", "rounded-lg", "shadow", "p-4");

            listItem.innerHTML = `
                <a href="#" onclick="loadProject('${repo.homepage ? repo.homepage : repo.name}')" class="text-blue-600 font-bold hover:underline">
                    ${repo.name}
                </a>
                <p class="text-gray-600 text-sm mt-1">${repo.description || "No description available."}</p>
            `;
            projectList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error fetching repositories:", error);
    }
}

// Fonction pour charger un projet et afficher son README.md
async function loadProject(repoName) {
    if (repoName.startsWith("https://")) {
        window.location.href = repoName
        return
    }
    const main = document.querySelector("main");
    main.innerHTML = `<p class="text-center text-gray-600">Loading...</p>`;

    try {
        const response = await fetch(`https://api.github.com/repos/${ORG_NAME}/${repoName}/readme`, {
            headers: { Accept: "application/vnd.github.v3.raw" },
        });
        const readme = await response.text();

        main.innerHTML = `
            <section class="bg-white rounded-lg shadow p-6">
                <h2 class="text-2xl font-bold text-blue-600 mb-4">${repoName}</h2>
                <div class="markdown-body bg-white text-black">${marked.parse(readme)}</div>
                <button onclick="goBack()" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Back to Projects
                </button>
            </section>
        `;
    } catch (error) {
        console.error("Error fetching README.md:", error);
        main.innerHTML = `<p class="text-center text-red-600">Could not load README.md.</p>`;
    }
}

// Fonction pour revenir à la liste des projets
function goBack() {
    window.location.reload()
    // const main = document.querySelector("main");
    // main.innerHTML = `
    //     <section id="projects">
    //         <h2 class="text-2xl font-bold text-blue-600 mb-4">Our Projects</h2>
    //         <ul id="project-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></ul>
    //     </section>
    // `;
    // fetchProjects();
}

// Charger les données au démarrage
fetchOrganizationLogo();
fetchProjects();
