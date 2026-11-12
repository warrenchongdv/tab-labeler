// Shows a clean label right away, reports the page's real title to the extension,
// then takes the window-aware label it sends back.
(() => {
  const DEF = { enabled: true, size: 'auto', off: [], custom: {} };
  let S = { ...DEF };
  let original = document.title;
  let lastSet = null;
  const key = () => location.origin + location.pathname;
  const active = () => S.enabled && !S.off.includes(location.hostname);

  function set(t) { if (t && t !== document.title) { lastSet = t; document.title = t; } }

  function report() {
    if (!active()) {
      if (lastSet !== null && document.title === lastSet) { lastSet = null; document.title = original; }
      chrome.runtime.sendMessage({ type: 'tabLabeler:report', off: true }).catch(() => {});
      return;
    }
    const custom = S.custom[key()] || '';
    set(custom || self.TabTidy.cleanTitle(original, location.href, 18)); // instant fallback
    chrome.runtime.sendMessage({ type: 'tabLabeler:report', title: original, url: location.href, custom }).catch(() => {});
  }

  // Pages change their own titles (new mail, single-page apps); re-report when they do.
  new MutationObserver(() => {
    if (document.title === lastSet) return;
    original = document.title;
    report();
  }).observe(document.documentElement, { subtree: true, childList: true, characterData: true });

  chrome.runtime.onMessage.addListener((msg, _s, reply) => {
    if (msg && msg.type === 'tabLabeler:label') { if (active()) set(msg.label); return; }
    if (msg && msg.type === 'tabLabeler:info') reply({ original, label: document.title, host: location.hostname, key: key(), url: location.href });
  });
  chrome.storage.sync.get(DEF, v => { S = { ...DEF, ...v }; report(); });
  chrome.storage.onChanged.addListener((ch, area) => {
    if (area !== 'sync') return;
    for (const k in ch) S[k] = ch[k].newValue ?? DEF[k];
    report();
  });
})();
