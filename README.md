# Tab Labeler

Tab names you can tell apart, even with 20 tabs open.

`(3) Inbox - you@school.edu - Gmail` → **(3) Inbox**
`Lab Notes - Google Docs` → **Lab Notes**
`python - How do I merge two dictionaries…? - Stack Overflow` → **How do I merge two…**

- **Every tab starts differently.** "Project Atlas Budget", "Project Atlas Roadmap" and "PROJ-157 Pricing page redesign" become *Budget*, *Roadmap*, *Pricing* instead of a row of tabs that all read "Proje…". Each label leads with the word only that tab has; the tab's icon already shows the site.
- **Fits your tab bar.** Labels shrink to the key words as you open more tabs, and grow back when you close them. Pinned tabs don't count.
- Removes site names, notification counts, and clutter automatically
- Keeps up with pages that change their own titles (Gmail, YouTube, Slack…)
- Rename any page yourself; turn it off per site
- **Private:** runs entirely in your browser. No account, no servers, no tracking.

## Install (developer mode)
1. Download this repo (Code → Download ZIP) and unzip it.
2. Open `chrome://extensions` and turn on **Developer mode**.
3. Click **Load unpacked** and pick the `extension` folder.

## Tests
```
node tests/titles.test.js
node tests/compact.test.js
node tests/window.test.js
```

## Roadmap
- Optional smarter labels with Chrome's built-in on-device AI (Gemini Nano), with the rules as a fallback
- Label tab groups

MIT licensed. Made by Warren Chong.
