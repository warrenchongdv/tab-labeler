const DEF = { enabled: true, size: 'auto', off: [], custom: {} };
const $ = id => document.getElementById(id);
let S = { ...DEF }, info = null;

async function load() {
  S = { ...DEF, ...(await chrome.storage.sync.get(DEF)) };
  $('enabled').checked = S.enabled;
  paintSize();
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  try { info = tab && await chrome.tabs.sendMessage(tab.id, { type: 'tabLabeler:info' }); } catch (e) { info = null; }
  paintReports();
  if (!info) { $('tab').classList.add('na'); for (const id of ['label', 'save', 'reset', 'offhere', 'report']) $(id).disabled = true; return; }
  $('orig').textContent = info.original;
  $('orig').title = info.original;
  $('label').value = S.custom[info.key] || '';
  $('label').placeholder = info.label;
  $('host').textContent = info.host;
  $('offhere').checked = S.off.includes(info.host);
}
const save = patch => chrome.storage.sync.set(patch);

$('enabled').addEventListener('change', e => save({ enabled: e.target.checked }));
function paintSize() { document.querySelectorAll('[data-size]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.size === S.size))); }
document.querySelectorAll('[data-size]').forEach(b => b.addEventListener('click', () => { S.size = b.dataset.size; paintSize(); save({ size: S.size }); }));
$('save').addEventListener('click', () => {
  const v = $('label').value.trim(); const custom = { ...S.custom };
  if (v) custom[info.key] = v; else delete custom[info.key];
  S.custom = custom; save({ custom });
});
$('label').addEventListener('keydown', e => { if (e.key === 'Enter') $('save').click(); });
$('reset').addEventListener('click', () => { const custom = { ...S.custom }; delete custom[info.key]; S.custom = custom; $('label').value = ''; save({ custom }); });
$('offhere').addEventListener('change', e => {
  const off = new Set(S.off); e.target.checked ? off.add(info.host) : off.delete(info.host);
  S.off = [...off]; save({ off: S.off });
});
// Mislabel reports: kept in local storage (this computer only), exported as lines for tests/titles.test.js.
const getReports = async () => (await chrome.storage.local.get({ reports: [] })).reports;
async function paintReports() {
  const r = await getReports();
  $('count').textContent = r.length;
  $('reports').hidden = r.length === 0;
}
function flash(id, text) { const b = $(id), old = b.textContent; b.textContent = text; setTimeout(() => { b.textContent = old; }, 1400); }
$('report').addEventListener('click', async () => {
  const r = await getReports();
  if (!r.some(x => x.url === info.url && x.original === info.original)) {
    r.push({ original: info.original, label: info.label, url: info.url, at: new Date().toISOString() });
    await chrome.storage.local.set({ reports: r });
  }
  flash('report', 'Saved. Thanks!');
  paintReports();
});
$('copy').addEventListener('click', async () => {
  const lines = (await getReports()).map(x =>
    `  [${JSON.stringify(x.original)}, ${JSON.stringify(x.url)}, ${JSON.stringify(x.label)}], // got this label: change it to the one you want`);
  await navigator.clipboard.writeText(lines.join('\n'));
  flash('copy', 'Copied');
});
let armed = false; // Clear needs two clicks so one slip doesn't wipe the list.
$('clear').addEventListener('click', async () => {
  if (!armed) { armed = true; flash('clear', 'Click again to delete'); setTimeout(() => { armed = false; }, 1400); return; }
  armed = false;
  await chrome.storage.local.set({ reports: [] });
  paintReports();
});
load();
