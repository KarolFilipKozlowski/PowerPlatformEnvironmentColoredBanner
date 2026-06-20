// Function to calculate a contrasting text color based on the background color
function getContrastColor(hexColor) {
  hexColor = hexColor.replace("#", "");
  const r = parseInt(hexColor.substr(0, 2), 16);
  const g = parseInt(hexColor.substr(2, 2), 16);
  const b = parseInt(hexColor.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

// Function that creates a banner and adds it to the page
function createEnvironmentBanner(environmentType, backgroundColor, environmentDesc, svgIcon) {
  const textColor = getContrastColor(backgroundColor);

  let banner = document.getElementById("environment-banner");
  if (!banner) {
    banner = document.createElement("div");
    banner.id = "environment-banner";
    banner.style.position = "fixed";
    banner.style.top = "0";
    banner.style.left = "0";
    banner.style.width = "100%";
    banner.style.height = "18px";
    banner.style.display = "flex";
    banner.style.alignItems = "center";
    banner.style.justifyContent = "center";
    banner.style.fontSize = "12px";
    banner.style.zIndex = "9999";
    banner.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
    document.body.prepend(banner);
    document.body.style.paddingTop = "18px";
  }

  banner.style.backgroundColor = backgroundColor;
  banner.style.color = textColor;
  banner.innerHTML = "";

  if (svgIcon) {
    const iconWrapper = document.createElement("span");
    iconWrapper.style.cssText = "display:inline-flex;align-items:center;width:12px;height:12px;margin-right:5px;flex-shrink:0;overflow:hidden;";
    iconWrapper.innerHTML = svgIcon;
    const svgEl = iconWrapper.querySelector("svg");
    if (svgEl) {
      svgEl.setAttribute("width", "12");
      svgEl.setAttribute("height", "12");
      svgEl.style.cssText = "width:12px;height:12px;display:block;";
    }
    banner.appendChild(iconWrapper);
  }

  const textSpan = document.createElement("span");
  textSpan.textContent = `Environment type: ${environmentType.toUpperCase()}${environmentDesc ? ` (${environmentDesc})` : ""}`;
  banner.appendChild(textSpan);
}

// Function to retrieve environment data from chrome.storage
function displayEnvironmentBanner(environmentId) {
  chrome.storage.sync.get("environments", (data) => {
    const environments = data.environments || {};
    if (environments[environmentId]) {
      const { environmentColor: color, environmentType: type, environmentDesc: desc } = environments[environmentId];

      chrome.storage.local.get("environmentIcons", (iconData) => {
        const icons = iconData.environmentIcons || {};
        createEnvironmentBanner(type, color, desc, icons[environmentId] || null);
      });
    } else {
      const banner = document.getElementById("environment-banner");
      if (banner) {
        banner.remove();
        document.body.style.paddingTop = "0";
      }
    }
  });
}

// Function to monitor URL changes and update the banner
function monitorEnvironmentChanges() {
  let lastEnvironmentId = null;

  const checkEnvironmentId = () => {
    const url = new URL(window.location.href);
    const pathSegments = url.pathname.split('/');

    const environmentIdIndex = pathSegments.includes("environments")
      ? pathSegments.indexOf("environments") + 1
      : pathSegments.includes("e")
      ? pathSegments.indexOf("e") + 1
      : -1;

    const environmentId = environmentIdIndex > 0 ? pathSegments[environmentIdIndex] : null;

    if (environmentId && environmentId !== lastEnvironmentId) {
      lastEnvironmentId = environmentId;
      displayEnvironmentBanner(environmentId);
    }
  };

  const observer = new MutationObserver(checkEnvironmentId);
  observer.observe(document.body, { childList: true, subtree: true });

  setInterval(checkEnvironmentId, 1000);
}

// Start monitoring environment changes on page load
monitorEnvironmentChanges();
