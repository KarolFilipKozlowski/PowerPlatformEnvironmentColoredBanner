# Privacy Policy — Power Platform Environment Colored Banner

*Last updated: 2026-06-20*
*Author: Karol Kozłowski | [CitDev](https://citdev.pl/)*

---

## What data does this extension collect?

**None.** Power Platform Environment Colored Banner does not collect, record, transmit, or share any personal data or usage information of any kind.

## What data does this extension store?

The extension stores only the configuration data that **you explicitly enter** in the settings page:

| Data | Where it is stored |
|---|---|
| Environment ID, background color, environment type, description | `chrome.storage.sync` — your browser's built-in sync storage |
| SVG icon files uploaded by you | `chrome.storage.local` — your browser's local storage |

All data remains in your browser. `chrome.storage.sync` may be synchronized between your own signed-in devices by your browser's built-in sync mechanism (e.g. Chrome Sync or Edge Sync) — this is a standard browser feature entirely outside the control of this extension.

## Does this extension access page content?

No. The content script injected into Power Platform pages reads only `window.location.href` (the current URL) in order to extract the environment ID from the URL path. It does not read, copy, or interact with any page content, user input, form data, or other information on the page.

## Does this extension communicate with external servers?

No. The extension makes no network requests of any kind. There are no analytics, telemetry, crash reports, advertisements, or third-party services involved.

## Does this extension use remote code?

No. All code is bundled within the extension itself. No scripts are loaded from external sources at runtime.

## Third-party services

The settings page loads **Bootstrap CSS** and **Bootstrap Icons** stylesheets from the [jsDelivr](https://www.jsdelivr.com/) CDN for visual styling only. These are standard, widely-used open-source libraries. No JavaScript is loaded from external sources. Please refer to jsDelivr's own privacy policy if you have concerns about CDN requests.

## Changes to this policy

If this policy is updated, the *Last updated* date at the top of this file will change. The history of changes is available in this repository's commit log.

## Contact

For questions or concerns, contact the author at [citdev.pl](https://citdev.pl/).
