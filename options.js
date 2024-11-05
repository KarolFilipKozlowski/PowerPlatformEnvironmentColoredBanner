// Function to load and display saved environments in the table
function loadEnvironments() {
  chrome.storage.sync.get("environments", (data) => {
    const environments = data.environments || {};
    const listElement = document.getElementById("environment-list");
    listElement.innerHTML = ""; // Clear the table

    let index = 1;
    for (const [id, envData] of Object.entries(environments)) {
      const row = document.createElement("tr");

      row.innerHTML = `
        <th class="align-middle" scope="row">${index}</th>
        <td class="align-middle">${id}</td>
        <td class="align-middle">${envData["environmentType"]}</td>
        <td class="align-middle"><i class="bi bi-paint-bucket" style="color: ${envData["environmentColor"]};"></i> ${envData["environmentColor"]}</td>
        <td class="align-middle">${envData["environmentDesc"] || ""}</td>
        <td class="align-middle"><button class="delete-btn btn btn-outline-danger" data-id="${id}">Remove</button></td>
      `;

      listElement.appendChild(row);
      index++;
    }

    // Attach event listeners to remove buttons
    document.querySelectorAll(".delete-btn").forEach(button => {
      button.addEventListener("click", (event) => {
        const environmentId = event.target.getAttribute("data-id");
        deleteEnvironment(environmentId);
      });
    });
  });
}

// Function to delete an environment from storage
function deleteEnvironment(environmentId) {
  chrome.storage.sync.get("environments", (data) => {
    const environments = data.environments || {};
    delete environments[environmentId];

    chrome.storage.sync.set({ environments }, () => {
      alert(`Environment ${environmentId} has been removed`);
      loadEnvironments();
    });
  });
}

// Function to save a new environment to storage
document.getElementById("environment-form").addEventListener("submit", (event) => {
  event.preventDefault();
  
  const environmentId = document.getElementById("environment-id").value;
  const environmentColor = document.getElementById("environment-color").value;
  const environmentType = document.getElementById("environment-type").value;
  const environmentDesc = document.getElementById("environment-desc").value;

  chrome.storage.sync.get("environments", (data) => {
    const environments = data.environments || {};
    
    // Add or replace the environment with the same ID
    environments[environmentId] = { environmentColor, environmentType, environmentDesc };

    chrome.storage.sync.set({ environments }, () => {
      alert(`Environment ${environmentId} has been saved or updated.`);
      loadEnvironments();
    });
  });

  // Clear form fields after saving
  document.getElementById("environment-id").value = "";
  document.getElementById("environment-color").value = "#ffffff";
  document.getElementById("environment-type").selectedIndex = 0; // Reset environment type to the first option
  document.getElementById("environment-desc").value = "";
});

// Load environments when the page loads
loadEnvironments();
