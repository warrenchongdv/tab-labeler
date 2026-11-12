# Chrome Web Store listing: copy-paste sheet

Upload file: `dist/tab-labeler-0.6.0.zip`

## Store listing tab

**Name** (comes from manifest.json): Tab Labeler

**Summary** (from manifest, max 132 chars):
Tab names you can tell apart. Each tab leads with the word that makes it different from your other tabs, and labels shrink as your tab bar fills up. Free, private, no account.

**Description:**
```
With 15 tabs open, Chrome shows about five letters per tab. Research one topic and every tab reads the same: "Telom", "Telom", "Telom".

Tab Labeler gives every tab a short label you can tell apart.

• Every tab starts differently. Each label leads with the word only that tab has: "Shortening", "Hayflick", "Explained", instead of a row of identical stubs.
• Fits your tab bar. Labels shrink to the key words as you open more tabs and grow back when you close them. Pinned tabs don't count.
• Cleans up clutter. Removes site names, notification counts and "Amazon.com:" style prefixes. The tab's icon already shows the site.
• Keeps up with pages that change their own titles (Gmail, YouTube, single-page apps).
• Rename any page yourself, or turn it off for a site.
• Label looks wrong? Report it from the popup to help improve the rules.

Private by design: everything runs in your browser. No account, no servers, no tracking, no data collected.

Note: the extension changes the page title, so bookmarks you save while it is on use the short label.

Free and open source: https://github.com/warrenchongdv/tab-labeler
```

**Category:** Productivity → Tools (or "Workflow & Planning" if offered)
**Language:** English

**Images:**
- Store icon 128×128: `extension/icons/128.png`
- Screenshot 1280×800: `store/screenshot-1.png`
- Small promo tile 440×280: `store/promo-small.png`

**Website / support URL:** https://github.com/warrenchongdv/tab-labeler

## Privacy tab

**Single purpose:**
```
Shortens each browser tab's title into a clean label that is easy to tell apart from the user's other tabs.
```

**Permission justifications:**
- `storage`: `Saves the user's settings (on/off, label length, sites turned off, custom labels) and any labels the user reports.`
- `activeTab`: `Lets the popup read the current tab's original title so the user can rename it or report a bad label.`
- Host permission (content script on http/https pages): `The extension must run on every page the user opens to read that page's title and replace it with a short label. It only reads and changes document.title; it does not read page content or send anything off the device.`

**Remote code:** No, I am not using remote code.

**Data usage:** tick nothing (the extension does not collect any of the listed data; nothing leaves the browser).
Tick all three certifications (no selling, no unrelated use, no creditworthiness use).

**Privacy policy URL:** https://github.com/warrenchongdv/tab-labeler/blob/main/PRIVACY.md

## Distribution tab
- Visibility: Public
- Regions: All regions
- Price: Free
