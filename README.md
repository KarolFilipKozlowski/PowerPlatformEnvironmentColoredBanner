# Power Platform Environment Colored Banner

> Browser extension for Microsoft Power Platform — instantly know which environment you're working in.

---

## English

**Power Platform Environment Colored Banner** is a browser extension for users working with Microsoft Power Platform (Power Apps, Power Automate, Power Pages, Admin Center). It displays a slim, color-coded banner at the top of every Power Platform page so you always know which environment you're in — production, sandbox, testing, or any custom type you define.

### Why use it?

Working across multiple environments (production, sandbox, UAT, developer…) makes it dangerously easy to perform actions in the wrong one. This extension eliminates that risk with a permanent, color-coded visual indicator at the top of the page, showing the environment type, a custom description, and an optional SVG icon.

### Features

- **Colored banner** — fixed 18 px strip at the top of every supported page; background color fully customizable per environment
- **Three-section layout** — environment type on the left, description centered, SVG icon on the right
- **Automatic text contrast** — banner text color (black or white) is calculated automatically based on the background luminance
- **SVG icon per environment** — upload any SVG file as a visual identifier; icon color adapts to the banner contrast color
- **Edit environments** — click the pencil icon in the list to pre-fill the form and update color, type, description or icon without re-entering the ID
- **Custom environment type** — besides the seven presets (Production, Default, Sandbox, Trial, Developer, UAT, Testing) you can define any free-form type name
- **Filter table** — live search above the environment list filters by ID, type or description
- **Toast notifications** — non-blocking success/warning messages replace native `alert()` dialogs; delete confirmation uses a modal instead of `confirm()`
- **Case-insensitive matching** — environment IDs in URLs and in saved settings are compared case-insensitively, so mixed-case GUIDs always match
- **Settings sync** — environment metadata is stored in `chrome.storage.sync` (synchronized across devices); SVG icons are stored in `chrome.storage.local`
- **Optimized URL monitoring** — uses `MutationObserver` (throttled via `requestAnimationFrame`) plus `popstate` / `hashchange` events; no polling interval

### Supported pages

| Service | URL |
|---|---|
| Power Apps | `make.powerapps.com` |
| Power Automate | `make.powerautomate.com` |
| Power Pages | `make.powerpages.microsoft.com` |
| Power Platform Admin Center | `admin.powerplatform.microsoft.com` |
| Power Apps (US Gov) | `make.gov.powerapps.us` |
| Power Automate (US Gov) | `make.gov.powerautomate.us` |
| Power Apps Preview | `make.preview.powerapps.com` |
| Power Automate Preview | `make.preview.powerautomate.com` |

### How to use

1. Install the extension and click its icon to open the settings page.
2. Enter the **Environment ID** (GUID) — copy it from the URL: `make.powerapps.com/environments/`**`<ID>`**`/`
3. Pick a **background color** using the color picker.
4. Select an **environment type** (or choose *Custom…* and type your own).
5. Optionally add a **description** and upload an **SVG icon**.
6. Click **Save** — the environment appears in the list below.
7. To edit an existing entry, click the **pencil** button in the row and update the form. Click **Update** to apply.
8. To remove an entry, click the **trash** button and confirm in the modal.

### Settings page

![Settings page](https://citdev.pl/blog/wp-content/uploads/2024/11/image.png)

### Banner

![Banner](https://citdev.pl/blog/wp-content/uploads/2024/11/image-5.png)

---

## Polski

**Power Platform Environment Colored Banner** to rozszerzenie do przeglądarki dla użytkowników Microsoft Power Platform (Power Apps, Power Automate, Power Pages, Admin Center). Na każdej stronie Power Platform wyświetla wąski, kolorowy pasek u góry ekranu — dzięki niemu zawsze wiesz, w jakim środowisku pracujesz.

### Po co to rozszerzenie?

Praca w wielu środowiskach (produkcja, sandbox, testy, deweloper…) łatwo prowadzi do pomyłek — przypadkowe działanie w złym środowisku może mieć poważne konsekwencje. Rozszerzenie eliminuje to ryzyko, wyświetlając stały, kolorowy wskaźnik u góry strony z typem środowiska, opcjonalnym opisem i ikoną.

### Funkcje

- **Kolorowy pasek** — stały pasek o wysokości 18 px u góry każdej obsługiwanej strony; kolor tła konfigurowalny osobno dla każdego środowiska
- **Układ trójkolumnowy** — typ środowiska po lewej, opis na środku, ikona SVG po prawej
- **Automatyczny kontrast tekstu** — kolor tekstu (czarny lub biały) dobierany automatycznie na podstawie luminancji tła
- **Ikona SVG dla środowiska** — wgraj dowolny plik SVG jako wizualny identyfikator; kolor ikony dostosowuje się do koloru kontrastu paska
- **Edycja środowisk** — kliknij ikonę ołówka w tabeli, aby wypełnić formularz danymi wybranego środowiska i zaktualizować kolor, typ, opis lub ikonę bez ponownego wpisywania ID
- **Własny typ środowiska** — oprócz siedmiu predefiniowanych typów (Production, Default, Sandbox, Trial, Developer, UAT, Testing) możesz wpisać dowolną własną nazwę
- **Filtrowanie tabeli** — pole wyszukiwania nad listą środowisk filtruje na żywo po ID, typie i opisie
- **Powiadomienia toast** — nienachalne komunikaty sukcesu/ostrzeżenia zastępują natywne `alert()`; potwierdzenie usunięcia wyświetlane jest w modalu zamiast `confirm()`
- **Dopasowanie bez względu na wielkość liter** — ID środowisk w adresach URL i w zapisanych ustawieniach porównywane są bez rozróżniania wielkości liter
- **Synchronizacja ustawień** — dane środowisk przechowywane w `chrome.storage.sync` (synchronizowane między urządzeniami); ikony SVG w `chrome.storage.local`
- **Optymalne monitorowanie URL** — `MutationObserver` z throttlingiem przez `requestAnimationFrame` oraz zdarzenia `popstate` / `hashchange`; brak odpytywania co sekundę

### Obsługiwane strony

| Usługa | Adres |
|---|---|
| Power Apps | `make.powerapps.com` |
| Power Automate | `make.powerautomate.com` |
| Power Pages | `make.powerpages.microsoft.com` |
| Power Platform Admin Center | `admin.powerplatform.microsoft.com` |
| Power Apps (US Gov) | `make.gov.powerapps.us` |
| Power Automate (US Gov) | `make.gov.powerautomate.us` |
| Power Apps Preview | `make.preview.powerapps.com` |
| Power Automate Preview | `make.preview.powerautomate.com` |

### Jak używać

1. Zainstaluj rozszerzenie i kliknij jego ikonę, aby otworzyć stronę ustawień.
2. Wpisz **Environment ID** (GUID) — skopiuj go z adresu URL: `make.powerapps.com/environments/`**`<ID>`**`/`
3. Wybierz **kolor tła** za pomocą selektora kolorów.
4. Wybierz **typ środowiska** (lub „Custom…" i wpisz własną nazwę).
5. Opcjonalnie dodaj **opis** i wgraj **ikonę SVG**.
6. Kliknij **Save** — środowisko pojawi się na liście poniżej.
7. Aby edytować istniejący wpis, kliknij przycisk **ołówka** w wierszu i zaktualizuj formularz. Kliknij **Update**, aby zatwierdzić.
8. Aby usunąć wpis, kliknij przycisk **kosza** i potwierdź w modalu.

---

*Author: Karol Kozłowski | [CitDev](https://citdev.pl/)*
