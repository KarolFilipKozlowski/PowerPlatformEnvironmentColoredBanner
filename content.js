// Function to calculate a contrasting text color based on the background color
function getContrastColor(hexColor) {
  // Remove hash if present
  hexColor = hexColor.replace("#", "");

  // Convert hex to RGB
  const r = parseInt(hexColor.substr(0, 2), 16);
  const g = parseInt(hexColor.substr(2, 2), 16);
  const b = parseInt(hexColor.substr(4, 2), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black for light backgrounds and white for dark backgrounds
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

// Function that creates a banner and adds it to the page
function createEnvironmentBanner(environmentId, environmentType, backgroundColor, environmentDesc) {
  // Determine the contrasting text color
  const textColor = getContrastColor(backgroundColor);

  // Check if the banner already exists to avoid duplication
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
  
  // Prepare the banner text with description in parentheses if it's not empty
  const bannerText = `Environment Type: ${environmentType.toUpperCase()}${environmentDesc ? ` (${environmentDesc})` : ""}`;

  // Apply background and text colors
  banner.style.backgroundColor = backgroundColor;
  banner.style.color = textColor;

  // Set text on the banner
  banner.innerText = bannerText;
}

// Function to retrieve environment data from `chrome.storage`
function displayEnvironmentBanner(environmentId) {
  chrome.storage.sync.get("environments", (data) => {
      const environments = data.environments || {};
      if (environments[environmentId]) {
          const { "environmentColor": color, "environmentType": type, "environmentDesc": desc } = environments[environmentId];
          createEnvironmentBanner(environmentId, type, color, desc);
      } else {
          // If the environment is not saved, remove the banner if it exists
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

  // Check if the URL contains an environment ID
  const checkEnvironmentId = () => {
      const url = new URL(window.location.href);
      const pathSegments = url.pathname.split('/');
      const environmentIdIndex = pathSegments.indexOf("environments") + 1;
      const environmentId = pathSegments[environmentIdIndex];

      // Update the banner if the environment ID has changed
      if (environmentId && environmentId !== lastEnvironmentId) {
          lastEnvironmentId = environmentId;
          displayEnvironmentBanner(environmentId);
      }
  };

  // Use `MutationObserver` to detect changes in the document structure
  const observer = new MutationObserver(checkEnvironmentId);
  observer.observe(document.body, { childList: true, subtree: true });

  // Also check the environment ID every few seconds in case `MutationObserver` misses changes
  setInterval(checkEnvironmentId, 1000);
}

// Start monitoring environment changes on page load
monitorEnvironmentChanges();
