// Window-aware labels: every tab should start differently.
const { labelWindow } = require('../extension/clean.js');
const { expect, todo, done } = require('./check.js');

const host = url => new URL(url).hostname;
// Rule: labels start differently (first 5 letters, what Chrome shows). A clash is only allowed
// between different sites, where the tab icons already tell them apart.
function checkStarts(E, L, name, known = []) {
  const seen = {};
  const bad = [];
  E.forEach(e => {
    const k = L[e.id].toLowerCase().slice(0, 5);
    (seen[k] = seen[k] || []).push(e);
  });
  Object.entries(seen).forEach(([k, g]) => {
    const hosts = g.map(e => host(e.url));
    if (g.length > 1 && new Set(hosts).size < hosts.length) (known.includes(k) ? todo(k, 'no clash', name + ': known same-site clash') : bad.push(k));
  });
  expect(bad.length ? 'same-site clash: ' + bad.join(', ') : 'ok', 'ok', name + ': label starts');
}
function run(name, rows, len, want, goals = {}, known = []) {
  console.log('\n== ' + name);
  const E = rows.map(([title, url], id) => ({ id, title, url }));
  const L = labelWindow(E, len);
  // "todo" = known weak label: shows the goal, doesn't fail yet.
  E.forEach(e => (e.id in goals ? todo : expect)(L[e.id], goals[e.id] || want[e.id], e.title));
  checkStarts(E, L, name, known);
}

run('mixed window', [
  ['Telomere - Wikipedia', 'https://en.wikipedia.org/wiki/Telomere'],
  ['telomerase ALT pathway cancer - Google Search', 'https://www.google.com/search?q=x'],
  ['GitHub - furybee/chrome-tab-modifier: Tabee', 'https://github.com/furybee/chrome-tab-modifier'],
  ['python - How do I merge two dictionaries in a single expression? - Stack Overflow', 'https://stackoverflow.com/q/1'],
  ['Amazon.com : airpods pro', 'https://www.amazon.com/s?k=x'],
  ['Smith Lab at State University', 'https://smithlab.example.edu/'],
  ['telomeres explained - YouTube', 'https://www.youtube.com/results?x'],
  ['Data Science Minor Requirements | Data Science Institute', 'https://datascience.example.edu/minor-requirements/'],
  ['How to get rid of telomere shortening - Google Search', 'https://www.google.com/search?q=y'],
], 9,
// At 9 chars Chrome shows ~8, so one strong word is right. "Airpods": the title is lowercase.
['Telomere', 'ALT pathway', 'chrome-tab-modifier', 'Merge', 'Airpods', 'Smith Lab', 'Explained', 'Data Science', 'Shortening']);

// A real window from 2026-11-11 (Chrome showed ~5 letters per tab). Before v0.6 it gave
// "Wiki Telomere", "Wiki Telomerase", "YT Telomeres": the icon already shows the site.
run('telomere research window', [
  ['Telomere - Wikipedia', 'https://en.wikipedia.org/wiki/Telomere'],
  ['Telomerase - Wikipedia', 'https://en.wikipedia.org/wiki/Telomerase'],
  ['telomere shortening aging - Google Search', 'https://www.google.com/search?q=telomere+shortening+aging'],
  ['telomeres explained - YouTube', 'https://www.youtube.com/results?search_query=telomeres+explained'],
  ['telomere length aging - Search Results - PubMed', 'https://pubmed.ncbi.nlm.nih.gov/?term=telomere+length+aging'],
  ['Hayflick limit - Wikipedia', 'https://en.wikipedia.org/wiki/Hayflick_limit'],
  ['python - How do I merge two dictionaries in a single expression? - Stack Overflow', 'https://stackoverflow.com/questions/38987'],
  ['GitHub - octo/tab-labeler', 'https://github.com/octo/tab-labeler'],
  ['Alternative lengthening of telomeres - Wikipedia', 'https://en.wikipedia.org/wiki/Alternative_lengthening_of_telomeres'],
], 9, ['Telomere', 'Telomerase', 'Shortening', 'Explained', 'Telomere', 'Hayflick', 'Merge', 'tab-labeler', 'Alternative'],
{}, ['telom']); // Telomere vs Telomerase on Wikipedia: no other word to lead with; known limit.
// PubMed stays "Telomere": "length" shares its first 5 letters with "lengthening" (ALT tab).

done('window');
