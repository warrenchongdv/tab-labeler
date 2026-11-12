// Shared title-cleaning rules. Pure function: (title, url, maxLen) -> short label.
(function (root) {
  const SEP = /\s+(?:\||-|–|—|·|•|::|»|\/\/)\s+/;
  const COUNT = /^\s*(?:\(\d+\+?\)|\[\d+\+?\]|•)\s*/;
  const GENERIC = /^(home|home ?page|dashboard|welcome|index|untitled|log ?in|sign ?in|main page)$/i;
  const STOP = new Set(['www', 'com', 'org', 'net', 'edu', 'io', 'co', 'app', 'the']);

  function siteWords(url) {
    try {
      const h = new URL(url).hostname.toLowerCase().split('.');
      return h.filter(p => p && !STOP.has(p) && p.length > 1);
    } catch (e) { return []; }
  }
  const norm = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '');

  // A segment "is the site" if it is short and matches the hostname or a known suffix.
  const SITE_SUFFIX = /^(google (docs|sheets|slides|drive|search|calendar|maps|scholar)|gmail|youtube|wikipedia|github|reddit|linkedin|amazon(\.com)?|canvas|stack overflow|medium|x|twitter|instagram|notion|chatgpt|claude|figma|spotify|netflix|outlook|microsoft (word|excel|powerpoint)|uc san diego|ucsd)$/i;
  function isSite(seg, words) {
    const n = norm(seg);
    if (!n) return true;
    if (SITE_SUFFIX.test(seg.trim())) return true;
    if (seg.length <= 30 && words.some(w => w.length > 2 && (n === w || n === w + 'com' || (n.length >= 4 && w.startsWith(n))))) return true;
    if (/@/.test(seg) && !/\s/.test(seg.trim())) return true; // bare email address segment
    if (/^r\/\w+$/i.test(seg.trim())) return true; // subreddit tag
    return false;
  }

  function special(title, url) {
    let host = '';
    try { host = new URL(url).hostname; } catch (e) {}
    // Google Search: "query - Google Search"
    if (/(^|\.)google\./.test(host) && /\/search/.test(url)) {
      const q = title.replace(/\s+-\s+Google Search$/i, '');
      return '🔍 ' + q;
    }
    // GitHub: "owner/repo: description" -> "owner/repo"; "Title · Issue #12 · owner/repo" -> "#12 Title"
    if (/github\.com$/.test(host)) {
      const pr = title.match(/^(.*?) · (?:Pull Request|Issue) #(\d+) · /);
      if (pr) return '#' + pr[2] + ' ' + pr[1];
      const repo = title.match(/^(?:GitHub - )?([\w.-]+\/[\w.-]+)(?::|$)/);
      if (repo) return repo[1];
    }
    // Gmail: "Inbox (3) - you@x - Gmail" -> "Inbox (3)"
    if (/mail\.google\.com$/.test(host)) return title.split(SEP)[0];
    return null;
  }

  const FILLER = /^(?:how (?:do|can|to|does|did|would|should) (?:i|you|we|one)?\s*|how to |what (?:is|are|does|do) (?:the |a |an )?|why (?:is|are|does|do) |is there (?:a |an )?(?:way to )?|can (?:i|you) |how |the |a |an )/i;
  const STOPW = new Set(['a','an','the','of','in','on','for','to','and','or','with','at','by','from','into','your','my','our','is','are','was','be','it','this','that','as','single','expression','using','via','vs','two','one','some','any','new','best','top','guide','complete','ultimate','official','page','site','difference','between','about','versus','introduction','overview','get','rid','make','use','do','does','did']);
  // Keep the 1–3 most telling words so the label survives a crowded tab bar.
  function compact(s, maxLen) {
    if (s.startsWith('🔍 ')) return compact(s.slice(3), maxLen); // the Google icon already says "search"
    const repo = s.match(/^[\w.-]+\/([\w.-]+)$/); if (repo) return repo[1]; // GitHub: repo name only
    let t = s.replace(FILLER, '').replace(FILLER, '');
    const words = t.split(/\s+/).filter(Boolean);
    const keep = [];
    for (const w of words) {
      const bare = w.toLowerCase().replace(/[^a-z0-9#+]/g, '');
      if (!bare || STOPW.has(bare)) continue;
      const next = keep.concat(w.replace(/[,:;.?!]+$/, '')).join(' ');
      // Always try to keep two words; Chrome fades the end anyway, so the start matters most.
      // Keep a second word when the first is short or generic ("Lab", "Data"); Chrome fades the end anyway.
      const roomy = keep.length === 1 && (keep[0].length <= 5 || maxLen > 10);
      if (next.length > maxLen + (roomy ? 8 : 0) && keep.length) break;
      keep.push(w.replace(/[,:;.?!]+$/, ''));
      if (keep.length >= 3) break;
    }
    let out = keep.join(' ') || s;
    if (out.length > maxLen + 8) out = out.slice(0, maxLen + 8);
    return /^[a-z][a-z]+(\s|$)/.test(out) ? out.charAt(0).toUpperCase() + out.slice(1) : out;
  }

  function shorten(s, maxLen) {
    if (maxLen < 20) return compact(s, maxLen);
    s = s.replace(/\s+/g, ' ').trim();
    if (s.length <= maxLen) return s;
    const cut = s.slice(0, maxLen - 1);
    if (s[maxLen - 1] === ' ') return cut.replace(/[\s,:;.\-–—|]+$/, '') + '…';
    const sp = cut.lastIndexOf(' ');
    return (sp > maxLen * 0.55 ? cut.slice(0, sp) : cut).replace(/[\s,:;.\-–—|]+$/, '') + '…';
  }


  // ---- Window-aware labels: every tab should START differently from its neighbours ----
  const key = w => w.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]/g, '').slice(0, 5);
  function contentWords(s) {
    return s.replace(FILLER, '').replace(FILLER, '').split(/\s+/)
      .map(w => w.replace(/^[("'\[]+|[)"'\],:;.?!…]+$/g, ''))
      .filter(w => { const b = w.toLowerCase().replace(/[^a-z0-9#+/-]/g, ''); return b && !STOPW.has(b); });
  }
  const DESCR = new Set(['explained','tutorial','video','videos','review','reviews','lecture','course','guide','tips','basics','results','search']);
  const firstKey = label => key(label.replace(/^\(\d+\+?\)\s*/, '').split(/\s+/)[0] || '');

  // entries: [{id, title, url, custom?}] for one window -> {id: label}
  function labelWindow(entries, maxLen) {
    const out = {};
    const live = entries.filter(e => !e.custom && e.title);
    entries.filter(e => e.custom).forEach(e => { out[e.id] = e.custom; });
    if (live.length <= 1 || entries.length <= 5) { live.forEach(e => { out[e.id] = cleanTitle(e.title, e.url, maxLen); }); return out; }
    const rows = live.map(e => {
      const full = cleanTitle(e.title, e.url, 200);
      return { e, full, words: contentWords(full.replace(/^🔍\s*/, '')), label: cleanTitle(e.title, e.url, maxLen) };
    });
    // How many tabs use each word (by its first 5 letters, which is all Chrome shows).
    const df = {};
    rows.forEach(r => new Set(r.words.map(key)).forEach(k => { df[k] = (df[k] || 0) + 1; }));
    // Tabs whose labels start the same lead with a word only they have instead.
    function lead(ok) {
      const starts = {};
      rows.forEach(r => { const k = firstKey(r.label); starts[k] = (starts[k] || 0) + 1; });
      rows.forEach(r => {
        if (starts[firstKey(r.label)] < 2 || /^\(\d/.test(r.label)) return;
        const uniq = r.words.filter(w => df[key(w)] === 1 && ok(w));
        if (uniq.length) {
          const rest = r.words.filter(w => df[key(w)] !== 1);
          r.label = compact(uniq.concat(rest).join(' '), maxLen);
        }
      });
    }
    // Pass 1: strong words only; skip short words and vague descriptors ("explained").
    lead(w => (w.length >= 4 || /^[A-Z0-9]{2,}$/.test(w)) && !DESCR.has(w.toLowerCase()));
    // Pass 2: still clashing? Any unique word beats a clash ("Explained" next to the YouTube icon).
    lead(w => w.length >= 3);
    // No site tags ("YT", "Wiki"): the tab's icon already shows the site, and a tag would eat
    // most of the ~5 letters Chrome shows. A tab with no unique word keeps its plain label.
    rows.forEach(r => { out[r.e.id] = r.label; });
    return out;
  }

  function cleanTitle(title, url, maxLen = 30) {
    if (!title) return title;
    const raw = title.trim();
    const sp = special(raw, url);
    if (sp) return shorten(sp, maxLen);
    let t = raw.replace(COUNT, '');
    const words = siteWords(url);
    // "Amazon.com: Product" -> "Product"
    const pre = t.match(/^([^:]{2,24}):\s+(.+)$/);
    if (pre && isSite(pre[1], words)) t = pre[2];
    let segs = t.split(SEP).map(x => x.trim()).filter(Boolean);
    if (segs.length > 1) {
      const kept = segs.filter(x => !isSite(x, words));
      const siteSeg = segs.find(x => isSite(x, words) && !/@/.test(x));
      segs = kept.length ? kept : [segs[0]];
      t = segs[0];
      if (GENERIC.test(t) && siteSeg) t = siteSeg;
      // A lone tag like "python" before the real title: use the title instead.
      else if (!/\s/.test(t) && t.length <= 12 && segs[1] && segs[1].length > t.length + 8) t = segs[1];
      // If the first piece is tiny (e.g. "Home"), add the next piece for context.
      if (t.length < 6 && segs[1]) t = t + ' · ' + segs[1];
    }
    t = t.replace(/^(?:watch|home|welcome to)\s*[:\-]\s*/i, '');
    return shorten(t || raw, maxLen);
  }

  root.TabTidy = { cleanTitle, labelWindow };
  if (typeof module !== 'undefined') module.exports = { cleanTitle, labelWindow };
})(typeof self !== 'undefined' ? self : this);
