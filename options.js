let editMode = false;
let editingId = null;
let pendingSvgContent = null;

function sanitizeSvg(svgString) {
  svgString = svgString.replace(/<script[\s\S]*?<\/script>/gi, "");
  svgString = svgString.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, "");
  svgString = svgString.replace(/javascript:/gi, "");
  return svgString;
}

function loadEnvironments() {
  chrome.storage.sync.get("environments", (syncData) => {
    chrome.storage.local.get("environmentIcons", (localData) => {
      const environments = syncData.environments || {};
      const icons = localData.environmentIcons || {};
      const listElement = document.getElementById("environment-list");
      listElement.innerHTML = "";

      let index = 1;
      for (const [id, envData] of Object.entries(environments)) {
        const row = document.createElement("tr");

        row.innerHTML = `
          <th class="align-middle" scope="row">${index}</th>
          <td class="align-middle icon-cell"></td>
          <td class="align-middle" style="word-break: break-all;">${id}</td>
          <td class="align-middle">${envData.environmentType}</td>
          <td class="align-middle"><i class="bi bi-paint-bucket" style="color: ${envData.environmentColor};"></i> ${envData.environmentColor}</td>
          <td class="align-middle">${envData.environmentDesc || ""}</td>
          <td class="align-middle">
            <div class="d-flex gap-1">
              <button class="edit-btn btn btn-outline-primary btn-sm" data-id="${id}" title="Edit">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="delete-btn btn btn-outline-danger btn-sm" data-id="${id}" title="Remove">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        `;

        // Inject SVG icon safely outside the template literal
        const iconCell = row.querySelector(".icon-cell");
        if (icons[id]) {
          iconCell.innerHTML = icons[id];
        } else {
          iconCell.innerHTML = '<span class="text-muted">—</span>';
        }

        listElement.appendChild(row);
        index++;
      }

      document.querySelectorAll(".edit-btn").forEach(button => {
        button.addEventListener("click", (event) => {
          const id = event.currentTarget.getAttribute("data-id");
          startEditMode(id, environments[id], icons[id] || null);
        });
      });

      document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", (event) => {
          const id = event.currentTarget.getAttribute("data-id");
          deleteEnvironment(id);
        });
      });
    });
  });
}

function startEditMode(id, envData, svgIcon) {
  editMode = true;
  editingId = id;
  pendingSvgContent = svgIcon;

  document.getElementById("environment-id").value = id;
  document.getElementById("environment-id").readOnly = true;
  document.getElementById("environment-color").value = envData.environmentColor;
  document.getElementById("environment-type").value = envData.environmentType;
  document.getElementById("environment-desc").value = envData.environmentDesc || "";

  const iconPreview = document.getElementById("icon-preview");
  iconPreview.innerHTML = svgIcon || "";
  document.getElementById("remove-icon-btn").style.display = svgIcon ? "inline-flex" : "none";

  document.getElementById("form-title-text").textContent = "Edit environment:";
  document.getElementById("submit-btn").textContent = "Update";
  document.getElementById("cancel-btn").style.display = "inline-block";

  document.getElementById("environment-form").scrollIntoView({ behavior: "smooth" });
}

function resetForm() {
  editMode = false;
  editingId = null;
  pendingSvgContent = null;

  document.getElementById("environment-id").value = "";
  document.getElementById("environment-id").readOnly = false;
  document.getElementById("environment-color").value = "#ffffff";
  document.getElementById("environment-type").value = "Sandbox";
  document.getElementById("environment-desc").value = "";
  document.getElementById("environment-icon").value = "";
  document.getElementById("icon-preview").innerHTML = "";
  document.getElementById("remove-icon-btn").style.display = "none";

  document.getElementById("form-title-text").textContent = "Add environment:";
  document.getElementById("submit-btn").textContent = "Save";
  document.getElementById("cancel-btn").style.display = "none";
}

function deleteEnvironment(environmentId) {
  if (!confirm(`Remove environment "${environmentId}"?`)) return;

  chrome.storage.sync.get("environments", (data) => {
    const environments = data.environments || {};
    delete environments[environmentId];

    chrome.storage.sync.set({ environments }, () => {
      chrome.storage.local.get("environmentIcons", (iconData) => {
        const icons = iconData.environmentIcons || {};
        delete icons[environmentId];
        chrome.storage.local.set({ environmentIcons: icons }, () => {
          if (editMode && editingId === environmentId) resetForm();
          loadEnvironments();
        });
      });
    });
  });
}

document.getElementById("environment-icon").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const svg = sanitizeSvg(e.target.result);
    pendingSvgContent = svg;
    document.getElementById("icon-preview").innerHTML = svg;
    document.getElementById("remove-icon-btn").style.display = "inline-flex";
  };
  reader.readAsText(file);
});

document.getElementById("remove-icon-btn").addEventListener("click", () => {
  pendingSvgContent = null;
  document.getElementById("environment-icon").value = "";
  document.getElementById("icon-preview").innerHTML = "";
  document.getElementById("remove-icon-btn").style.display = "none";
});

document.getElementById("cancel-btn").addEventListener("click", resetForm);

document.getElementById("environment-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const environmentId = document.getElementById("environment-id").value.trim();
  const environmentColor = document.getElementById("environment-color").value;
  const environmentType = document.getElementById("environment-type").value;
  const environmentDesc = document.getElementById("environment-desc").value.trim();

  chrome.storage.sync.get("environments", (data) => {
    const environments = data.environments || {};
    environments[environmentId] = { environmentColor, environmentType, environmentDesc };

    chrome.storage.sync.set({ environments }, () => {
      chrome.storage.local.get("environmentIcons", (iconData) => {
        const icons = iconData.environmentIcons || {};

        if (pendingSvgContent) {
          icons[environmentId] = pendingSvgContent;
        } else {
          delete icons[environmentId];
        }

        chrome.storage.local.set({ environmentIcons: icons }, () => {
          resetForm();
          loadEnvironments();
        });
      });
    });
  });
});

loadEnvironments();
