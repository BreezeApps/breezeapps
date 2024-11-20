const repoName = window.location.hash.replace("#", "");
const ORG_NAME = "BreezeApps";

async function load() {
  const main = document.querySelector("main");
  main.innerHTML = `<p class="text-center text-gray-600">Loading...</p>`;

  try {
    const response = await fetch(
      `https://api.github.com/repos/${ORG_NAME}/${repoName}/readme`,
      {
        headers: { Accept: "application/vnd.github.v3.raw" },
      }
    );
    if (JSON.parse(await response.text()).status === "404") {
      window.location.replace("/")
      return
    }
    const readme = await response.text();

    main.innerHTML = `
            <section class="bg-white rounded-lg shadow p-6">
                <h2 class="text-2xl font-bold text-blue-600 mb-4">${repoName}</h2>
                <div class="markdown-body bg-white text-black">${marked.parse(
                  readme
                )}</div>
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

load()