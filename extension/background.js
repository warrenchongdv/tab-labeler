// Collects every tab's real title (reported by the tab itself), then labels the whole window
// so each tab starts differently. Nothing leaves the browser.
importScripts('clean.js');

const DEF = { enabled: true, size: 'auto', off: [], custom: {} };
const SIZES = { short: 14, medium: 22, long: 36 };
// Chrome shows ~8 characters per tab once ~12 tabs are open, so labels get short fast.
const lenFor = n => (n <= 5 ? 32 : n <= 8 ? 18 : n <= 12 ? 12 : 9);

let M = null; // tabId -> {id, title, url, custom, windowId}
let queue = Promise.resolve();
const run = fn => (queue = queue.then(fn).catch(e => console.warn(e)));

async function tabsMap() {
  if (!M) M = (await chrome.storage.session.get('tabs')).tabs || {};
  return M;
}
const persist = () => chrome.storage.session.set({ tabs: M });

async function relabel(windowId) {
  if (windowId == null || windowId < 0) return;
  const [m, S, tabs] = await Promise.all([tabsMap(), chrome.storage.sync.get(DEF), chrome.tabs.query({ windowId })]);
  if (!S.enabled) return;
  // Pinned tabs show only an icon: they take no title space, so they don't shrink other labels
  // and don't take part in "start differently". They keep their instant label from content.js.
  const shown = tabs.filter(t => !t.pinned);
  const len = S.size === 'auto' ? lenFor(shown.length) : SIZES[S.size] || 22;
  const entries = shown.map(t => m[t.id]).filter(Boolean);
  const labels = self.TabTidy.labelWindow(entries, len);
  for (const e of entries) chrome.tabs.sendMessage(e.id, { type: 'tabLabeler:label', label: labels[e.id] }).catch(() => {});
}
async function relabelAll() {
  const tabs = await chrome.tabs.query({});
  for (const w of new Set(tabs.map(t => t.windowId))) await relabel(w);
}

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (!msg || msg.type !== 'tabLabeler:report' || !sender.tab) return;
  const t = sender.tab;
  run(async () => {
    const m = await tabsMap();
    if (msg.off) delete m[t.id];
    else m[t.id] = { id: t.id, title: msg.title, url: msg.url, custom: msg.custom || '', windowId: t.windowId };
    await persist();
    await relabel(t.windowId);
  });
});
chrome.tabs.onRemoved.addListener((id, info) => run(async () => {
  const m = await tabsMap(); delete m[id]; await persist();
  if (!info.isWindowClosing) await relabel(info.windowId);
}));
chrome.tabs.onCreated.addListener(t => run(() => relabel(t.windowId)));
chrome.tabs.onAttached.addListener((id, info) => run(async () => {
  const m = await tabsMap(); if (m[id]) m[id].windowId = info.newWindowId; await persist(); await relabel(info.newWindowId);
}));
chrome.tabs.onUpdated.addListener((_id, change, t) => { if ('pinned' in change) run(() => relabel(t.windowId)); });
chrome.tabs.onDetached.addListener((_id, info) => run(() => relabel(info.oldWindowId)));
chrome.storage.onChanged.addListener((_ch, area) => { if (area === 'sync') run(relabelAll); });
