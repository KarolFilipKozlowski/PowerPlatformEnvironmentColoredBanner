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
    banner.style.display = "grid";
    banner.style.gridTemplateColumns = "minmax(0, 1fr) auto minmax(0, 1fr)";
    banner.style.alignItems = "center";
    banner.style.fontSize = "12px";
    banner.style.zIndex = "9999";
    banner.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
    document.body.prepend(banner);
    document.body.style.paddingTop = "18px";
  }

  banner.style.backgroundColor = backgroundColor;
  banner.style.color = textColor;
  banner.innerHTML = "";

  // Left: environment type
  const leftSection = document.createElement("span");
  leftSection.style.cssText = "padding-left:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;";
  leftSection.textContent = `Environment type: ${environmentType.toUpperCase()}`;
  banner.appendChild(leftSection);

  // Center: description (truly centered via grid 1fr auto 1fr)
  const centerSection = document.createElement("span");
  centerSection.style.cssText = "text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 4px;";
  centerSection.textContent = environmentDesc || "";
  banner.appendChild(centerSection);

  // Right: SVG icon pushed to the right edge
  const rightSection = document.createElement("span");
  rightSection.style.cssText = "display:flex;justify-content:flex-end;align-items:center;padding-right:8px;";

  if (svgIcon) {
    const iconWrapper = document.createElement("span");
    iconWrapper.style.cssText = "display:inline-flex;align-items:center;width:12px;height:12px;overflow:hidden;flex-shrink:0;";
    iconWrapper.style.color = textColor;
    iconWrapper.innerHTML = svgIcon;
    const svgEl = iconWrapper.querySelector("svg");
    if (svgEl) {
      svgEl.setAttribute("width", "12");
      svgEl.setAttribute("height", "12");
      svgEl.style.cssText = "width:12px;height:12px;display:block;fill:currentColor;";
      // Override hardcoded fill attributes on the root and all descendants
      [svgEl, ...svgEl.querySelectorAll("*")].forEach(el => {
        if (el.getAttribute("fill") !== "none") {
          el.setAttribute("fill", "currentColor");
        }
      });
    }
    rightSection.appendChild(iconWrapper);
  }

  banner.appendChild(rightSection);
}

// Function to retrieve environment data from chrome.storage
function displayEnvironmentBanner(environmentId) {
  chrome.storage.sync.get("environments", (data) => {
    const environments = data.environments || {};

    // Case-insensitive lookup: URL and stored keys may differ in letter case
    const normalizedId = environmentId.toLowerCase();
    const matchedKey = Object.keys(environments).find(k => k.toLowerCase() === normalizedId);

    if (matchedKey) {
      const { environmentColor: color, environmentType: type, environmentDesc: desc } = environments[matchedKey];

      chrome.storage.local.get("environmentIcons", (iconData) => {
        const icons = iconData.environmentIcons || {};
        createEnvironmentBanner(type, color, desc, icons[matchedKey] || null);
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
  let isChecking = false;

  const checkEnvironmentId = () => {
    const url = new URL(window.location.href);
    const pathSegments = url.pathname.split('/');

    // Normalize to lowercase for case-insensitive segment matching
    const lowerSegments = pathSegments.map(s => s.toLowerCase());

    const environmentIdIndex = lowerSegments.includes("environments")
      ? lowerSegments.indexOf("environments") + 1
      : lowerSegments.includes("e")
      ? lowerSegments.indexOf("e") + 1
      : -1;

    const environmentId = environmentIdIndex > 0 ? pathSegments[environmentIdIndex] : null;

    if (environmentId && environmentId.toLowerCase() !== lastEnvironmentId) {
      lastEnvironmentId = environmentId.toLowerCase();
      displayEnvironmentBanner(environmentId);
    }
  };

  // Throttle MutationObserver callbacks via requestAnimationFrame
  const throttledCheck = () => {
    if (isChecking) return;
    isChecking = true;
    requestAnimationFrame(() => {
      checkEnvironmentId();
      isChecking = false;
    });
  };

  const observer = new MutationObserver(throttledCheck);
  observer.observe(document.body, { childList: true, subtree: true });

  // History API events as additional triggers (cover back/forward navigation)
  window.addEventListener("popstate", checkEnvironmentId);
  window.addEventListener("hashchange", checkEnvironmentId);

  // Initial check on page load
  checkEnvironmentId();
}

// Start monitoring environment changes on page load
monitorEnvironmentChanges();
