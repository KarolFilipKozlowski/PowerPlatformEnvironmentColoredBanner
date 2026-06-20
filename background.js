chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "update") {
    const version = chrome.runtime.getManifest().version;
    chrome.action.setBadgeText({ text: "NEW" });
    chrome.action.setBadgeBackgroundColor({ color: "#0d6efd" });
    chrome.storage.local.set({ showWhatsNew: true, whatsNewVersion: version });
  }
});
