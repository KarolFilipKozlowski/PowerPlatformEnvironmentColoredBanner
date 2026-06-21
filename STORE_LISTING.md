# Store Listing — Power Platform Environment Colored Banner

Information required to publish the extension in the **Chrome Web Store** (Google) and **Microsoft Edge Add-ons** store.

---

## General (shared by both stores)

### Extension name
```
Power Platform Environment Colored Banner
```

### Short description
*(Chrome: max 132 characters · Edge: max 250 characters)*
```
Displays a color-coded banner on Power Platform pages so you always know which environment (Production, Sandbox, etc.) you're working in.
```

### Detailed description
*(Chrome: max 16,000 characters · Edge: max 10,000 characters)*

```
Power Platform Environment Colored Banner is a productivity extension for Microsoft Power Platform users working across multiple environments — production, sandbox, developer, UAT, testing, and more.

When switching between environments frequently, it's dangerously easy to perform actions in the wrong one. A configuration change, flow run, or data edit done in production instead of sandbox can have serious consequences. This extension eliminates that risk with a permanent, color-coded visual indicator at the top of every Power Platform page.

KEY FEATURES

• Color-coded banner — a slim 18 px strip is pinned to the top of every supported page. Each environment gets its own background color, configured by you.

• Three-section layout — the left side shows the environment type (e.g. PRODUCTION), the center shows your custom description, and the right side displays an optional SVG icon. All text colors are calculated automatically to contrast with the background.

• SVG icon per environment — upload any SVG file as a visual identifier for an environment. The icon color adapts to the banner contrast color automatically.

• Edit environments — use the pencil button in the settings list to update color, type, description, or icon without re-entering the environment ID.

• Custom environment type — beyond the seven presets (Production, Default, Sandbox, Trial, Developer, User Acceptance Testing, Testing) you can define any free-form type name.

• Live filter — a search field above the environment list filters rows by ID, type, or description as you type.

• Case-insensitive matching — environment IDs in URLs and saved settings are compared without regard to letter case, so mixed-case GUIDs always match correctly.

• Settings sync — environment metadata is stored in chrome.storage.sync and synchronized across all your signed-in devices automatically. SVG icons are stored locally in chrome.storage.local.

SUPPORTED PAGES

- Power Apps (make.powerapps.com)
- Power Automate (make.powerautomate.com)
- Power Pages (make.powerpages.microsoft.com)
- Power Platform Admin Center (admin.powerplatform.microsoft.com)
- Power Apps – US Government (make.gov.powerapps.us)
- Power Automate – US Government (make.gov.powerautomate.us)
- Power Apps Preview (make.preview.powerapps.com)
- Power Automate Preview (make.preview.powerautomate.com)

HOW TO USE

1. Click the extension icon to open the settings page.
2. Enter the Environment ID (GUID) from the URL: make.powerapps.com/environments/<ID>/
3. Choose a background color, environment type, and optionally a description and SVG icon.
4. Click Save. The banner will appear immediately on any matching Power Platform page.
5. To edit an entry later, click the pencil icon in the list, make your changes, and click Update.

PRIVACY

This extension does not collect, transmit, or share any personal data. All configuration is stored exclusively in your browser's local and sync storage. No external servers are contacted.
```

### Category
```
Productivity
```

### Language
```
English
```

### Homepage URL
```
https://citdev.pl/
```

### Support / contact URL
```
https://citdev.pl/
```

---

## Permissions justification

Both stores require an explanation for every permission declared in `manifest.json`.

| Permission | Justification |
|---|---|
| `storage` | Used to save and load user-defined environment configurations (background color, environment type, description) via `chrome.storage.sync`, and SVG icon data via `chrome.storage.local`. No data leaves the browser. |

### Host permissions (content scripts)

The extension injects a content script on the following hosts solely to read the current URL path and display the banner:

| Host | Reason |
|---|---|
| `https://make.powerapps.com/*` | Core Power Apps maker portal |
| `https://make.powerautomate.com/*` | Power Automate maker portal |
| `https://make.powerpages.microsoft.com/*` | Power Pages maker portal |
| `https://admin.powerplatform.microsoft.com/*` | Power Platform Admin Center |
| `https://make.gov.powerapps.us/*` | Power Apps — US Government cloud |
| `https://make.gov.powerautomate.us/*` | Power Automate — US Government cloud |
| `https://make.preview.powerapps.com/*` | Power Apps preview environment |
| `https://make.preview.powerautomate.com/*` | Power Automate preview environment |

The content script reads only `window.location.href` (to extract the environment ID from the URL path) and `chrome.storage` (to retrieve the user's saved configuration). It does not read, collect, or transmit any page content, user input, or personal data.

---

## Privacy policy

*(Both stores require a privacy policy URL if the extension accesses user data or injects scripts into pages. A minimal policy text is provided below — host it at your domain.)*

**URL:**
```
https://github.com/KarolFilipKozlowski/PowerPlatformEnvironmentColoredBanner/blob/main/PRIVACY_POLICY.md
```

The privacy policy is maintained as `PRIVACY_POLICY.md` in this repository. Both Chrome Web Store and Microsoft Edge Add-ons accept GitHub repository URLs as valid privacy policy links.

---

## Chrome Web Store — additional fields

| Field | Value |
|---|---|
| Single-purpose description | Displays a color-coded identification banner on Microsoft Power Platform pages based on the current environment ID found in the URL. |
| Manifest version | 3 |
| Does it use remote code? | No |
| Are any permissions required for the core functionality? | Yes — `storage` (to persist user configuration) and host permissions for Power Platform domains (to inject the banner). |

### Required screenshots

Minimum 1, recommended 3–5. Dimensions: **1280 × 800 px** or **640 × 400 px**.

Suggested screenshots to prepare:
1. Banner visible at the top of a Power Apps page (Production environment, red banner)
2. Banner visible on a Power Automate page (Sandbox environment, green banner)
3. Settings page — form for adding an environment
4. Settings page — populated environments list with icons
5. Settings page — edit mode with custom type input visible

### Promotional tile (optional)

Small tile: **440 × 280 px**
Large tile: **920 × 680 px**
Marquee: **1400 × 560 px**

---

## Microsoft Edge Add-ons — additional fields

| Field | Value |
|---|---|
| Publisher display name | Karol Kozłowski \| CitDev |
| Availability | All regions |
| Age rating | Everyone |
| Does the extension collect user data? | No |

### Certification notes for Edge reviewers

- The extension operates exclusively on Microsoft Power Platform domains.
- It reads only the URL path to extract the environment ID and displays a visual overlay.
- All user data stays in `chrome.storage` (compatible with Edge's `browser.storage`).
- No remote code execution, no external network requests, no data collection.

---

## Version history

| Version | Notes |
|---|---|
| 3.0 | Added SVG icon support, environment editing, three-section banner layout, custom environment type, live filter, toast notifications, post-update What's New notification, case-insensitive ID matching, optimized URL monitoring, support for Power Pages and Admin Center |
| 1.1 | Added support for US Government and Preview domains |
| 1.0 | Initial release |

---

## Publish tab — "What's new" texts

These go into the **"What's new in this version"** field when submitting an update in Chrome Web Store Developer Dashboard or Microsoft Edge Add-ons Partner Center.

---

### Version 1.1

```
Added support for additional Microsoft Power Platform domains:

• Power Apps – US Government (make.gov.powerapps.us)
• Power Automate – US Government (make.gov.powerautomate.us)
• Power Apps Preview (make.preview.powerapps.com)
• Power Automate Preview (make.preview.powerautomate.com)

Users working in government or preview environments will now see the color-coded banner on those pages too.
```

---

### Version 3.0

```
This is a major update with several new features and improvements:

• SVG icon per environment — upload an SVG file from disk or paste SVG code directly; the icon is displayed on the right side of the banner and its color adapts automatically to the banner contrast

• Environment editing — click the pencil button next to any saved environment to update its color, type, description or icon without re-entering the ID

• Three-section banner layout — environment type on the left, description centered, SVG icon on the right

• Custom environment type — define any free-form type name beyond the seven presets (Production, Default, Sandbox, Trial, Developer, UAT, Testing)

• Live filter — search field above the environment list instantly filters rows by ID, type or description

• Toast notifications — non-blocking success and warning messages replace native alert() dialogs; delete confirmation now uses a modal dialog instead of confirm()

• What's New banner — shown once after an update so users know what changed

• Case-insensitive ID matching — environment IDs in URLs and saved settings are now compared without regard to letter case

• Optimized URL monitoring — replaced polling interval with MutationObserver (throttled via requestAnimationFrame) and History API events (popstate, hashchange)

• New supported pages: Power Pages (make.powerpages.microsoft.com) and Power Platform Admin Center (admin.powerplatform.microsoft.com)
```
