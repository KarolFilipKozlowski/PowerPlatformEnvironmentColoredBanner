// ---- State ----

let editMode = false;
let editingId = null;
let pendingSvgContent = null;
let pendingDeleteId = null;
let cachedEnvironments = {};
let cachedIcons = {};

const PRESET_TYPES = [
  "Production", "Default", "Sandbox", "Trial",
  "Developer", "User Acceptance Testing", "Testing"
];

// ---- Utilities ----

function sanitizeSvg(svgString) {
  svgString = svgString.replace(/<script[\s\S]*?<\/script>/gi, "");
  svgString = svgString.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, "");
  svgString = svgString.replace(/javascript:/gi, "");
  return svgString;
}

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `alert alert-${type} mb-1 py-2 px-3`;
  toast.style.minWidth = "200px";
  toast.style.fontSize = "0.875rem";
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = "opacity 0.4s";
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 400);
  }, 2600);
}

function showDeleteModal(id) {
  pendingDeleteId = id;
  document.getElementById("delete-modal-id").textContent = id;
  document.getElementById("delete-modal").style.display = "flex";
}

function hideDeleteModal() {
  pendingDeleteId = null;
  document.getElementById("delete-modal").style.display = "none";
}

function applyFilter() {
  const query = document.getElementById("env-search").value.toLowerCase();
  document.querySelectorAll("#environment-list tr").forEach(row => {
    // cells: 0=#, 1=icon, 2=id, 3=type, 4=color, 5=desc, 6=actions
    const id   = (row.cells[2]?.textContent || "").toLowerCase();
    const type = (row.cells[3]?.textContent || "").toLowerCase();
    const desc = (row.cells[5]?.textContent || "").toLowerCase();
    row.style.display = (!query || id.includes(query) || type.includes(query) || desc.includes(query)) ? "" : "none";
  });
}

// ---- Environment list ----

function loadEnvironments() {
  chrome.storage.sync.get("environments", (syncData) => {
    chrome.storage.local.get("environmentIcons", (localData) => {
      cachedEnvironments = syncData.environments || {};
      cachedIcons = localData.environmentIcons || {};

      const listElement = document.getElementById("environment-list");
      listElement.innerHTML = "";

      let index = 1;
      for (const [id, envData] of Object.entries(cachedEnvironments)) {
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
        if (cachedIcons[id]) {
          iconCell.innerHTML = cachedIcons[id];
        } else {
          iconCell.innerHTML = '<span class="text-muted">—</span>';
        }

        listElement.appendChild(row);
        index++;
      }

      applyFilter();
    });
  });
}

// ---- Edit mode ----

function startEditMode(id, envData, svgIcon) {
  editMode = true;
  editingId = id;
  pendingSvgContent = svgIcon;

  document.getElementById("environment-id").value = id;
  document.getElementById("environment-id").readOnly = true;
  document.getElementById("environment-color").value = envData.environmentColor;
  document.getElementById("environment-desc").value = envData.environmentDesc || "";

  if (PRESET_TYPES.includes(envData.environmentType)) {
    document.getElementById("environment-type").value = envData.environmentType;
    document.getElementById("environment-type-custom").value = "";
    document.getElementById("custom-type-row").style.display = "none";
  } else {
    document.getElementById("environment-type").value = "Custom";
    document.getElementById("environment-type-custom").value = envData.environmentType;
    document.getElementById("custom-type-row").style.display = "block";
  }

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
  document.getElementById("environment-type-custom").value = "";
  document.getElementById("custom-type-row").style.display = "none";
  document.getElementById("environment-desc").value = "";
  document.getElementById("environment-icon").value = "";
  document.getElementById("icon-preview").innerHTML = "";
  document.getElementById("remove-icon-btn").style.display = "none";

  document.getElementById("form-title-text").textContent = "Add environment:";
  document.getElementById("submit-btn").textContent = "Save";
  document.getElementById("cancel-btn").style.display = "none";
}

// ---- Event listeners ----

// C1 — Event delegation on table (single listener, prevents memory leak on repeated loadEnvironments())
document.getElementById("environment-list").addEventListener("click", (event) => {
  const editBtn = event.target.closest(".edit-btn");
  const deleteBtn = event.target.closest(".delete-btn");

  if (editBtn) {
    const id = editBtn.getAttribute("data-id");
    startEditMode(id, cachedEnvironments[id], cachedIcons[id] || null);
  } else if (deleteBtn) {
    const id = deleteBtn.getAttribute("data-id");
    showDeleteModal(id);
  }
});

// Delete modal — cancel
document.getElementById("delete-modal-cancel").addEventListener("click", hideDeleteModal);

// Delete modal — confirm
document.getElementById("delete-modal-confirm").addEventListener("click", () => {
  const id = pendingDeleteId;
  if (!id) return;
  hideDeleteModal();

  chrome.storage.sync.get("environments", (data) => {
    const environments = data.environments || {};
    delete environments[id];
    chrome.storage.sync.set({ environments }, () => {
      chrome.storage.local.get("environmentIcons", (iconData) => {
        const icons = iconData.environmentIcons || {};
        delete icons[id];
        chrome.storage.local.set({ environmentIcons: icons }, () => {
          if (editMode && editingId === id) resetForm();
          showToast("Environment removed.", "success");
          loadEnvironments();
        });
      });
    });
  });
});

// B2 — Show/hide custom type input based on select value
document.getElementById("environment-type").addEventListener("change", (event) => {
  const customRow = document.getElementById("custom-type-row");
  const customInput = document.getElementById("environment-type-custom");
  if (event.target.value === "Custom") {
    customRow.style.display = "block";
    customInput.focus();
  } else {
    customRow.style.display = "none";
    customInput.value = "";
  }
});

// SVG file picker
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

// Remove icon
document.getElementById("remove-icon-btn").addEventListener("click", () => {
  pendingSvgContent = null;
  document.getElementById("environment-icon").value = "";
  document.getElementById("icon-preview").innerHTML = "";
  document.getElementById("remove-icon-btn").style.display = "none";
});

// Cancel edit
document.getElementById("cancel-btn").addEventListener("click", resetForm);

// B3 — Filter table
document.getElementById("env-search").addEventListener("input", applyFilter);

// Form submit (add / update)
document.getElementById("environment-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const environmentId = document.getElementById("environment-id").value.trim();
  const environmentColor = document.getElementById("environment-color").value;
  const environmentDesc = document.getElementById("environment-desc").value.trim();

  let environmentType = document.getElementById("environment-type").value;
  if (environmentType === "Custom") {
    environmentType = document.getElementById("environment-type-custom").value.trim();
    if (!environmentType) {
      showToast("Please enter a custom environment type.", "warning");
      document.getElementById("environment-type-custom").focus();
      return;
    }
  }

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
          const wasEdit = editMode;
          resetForm();
          showToast(wasEdit ? "Environment updated." : "Environment saved.", "success");
          loadEnvironments();
        });
      });
    });
  });
});

// What's New banner — show once after update, clear badge on dismiss
chrome.storage.local.get(["showWhatsNew", "whatsNewVersion"], (data) => {
  if (data.showWhatsNew) {
    document.getElementById("whats-new-version").textContent = data.whatsNewVersion || "";
    document.getElementById("whats-new").style.display = "block";
  }
});

document.getElementById("whats-new-close").addEventListener("click", () => {
  document.getElementById("whats-new").style.display = "none";
  chrome.action.setBadgeText({ text: "" });
  chrome.storage.local.remove(["showWhatsNew", "whatsNewVersion"]);
});

// Initial load
loadEnvironments();
