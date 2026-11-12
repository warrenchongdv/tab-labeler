// Window-aware labels: every tab should start differently.
const { labelWindow } = require('../extension/clean.js');
const E = [
  ['Telomere - Wikipedia', 'https://en.wikipedia.org/wiki/Telomere'],
  ['telomerase ALT pathway cancer - Google Search', 'https://www.google.com/search?q=x'],
  ['GitHub - furybee/chrome-tab-modifier: Tabee', 'https://github.com/furybee/chrome-tab-modifier'],
  ['python - How do I merge two dictionaries in a single expression? - Stack Overflow', 'https://stackoverflow.com/q/1'],
  ['Amazon.com : airpods pro', 'https://www.amazon.com/s?k=x'],
  ['Smith Lab at State University', 'https://smithlab.example.edu/'],
  ['telomeres explained - YouTube', 'https://www.youtube.com/results?x'],
  ['Data Science Minor Requirements | Data Science Institute', 'https://datascience.example.edu/minor-requirements/'],
  ['How to get rid of telomere shortening - Google Search', 'https://www.google.com/search?q=y'],
].map(([title, url], id) => ({ id, title, url }));
const { expect, todo, done } = require('./check.js');
const L = labelWindow(E, 9);

// Exact labels we expect. "todo" = known weak label: shows the goal, doesn't fail yet.
// At 9 chars Chrome shows ~8, so one strong word is right: "Merge", "Shortening"
// ("Telomere shortening" would start like the other telomere tabs, which defeats the point).
// "Airpods": the title itself is lowercase; fixing it needs a brand list, not worth it yet.
const want = ['Wiki Telomere', 'ALT pathway', 'chrome-tab-modifier', 'Merge', 'Airpods', 'Smith Lab', 'YT Telomeres', 'Data Science', 'Shortening'];
const goals = {};
E.forEach(e => (e.id in goals ? todo : expect)(L[e.id], goals[e.id] || want[e.id], e.title));

// Rule: every label starts differently (by its first 5 letters, which is what Chrome shows).
const starts = E.map(e => L[e.id].toLowerCase().slice(0, 5));
const dup = starts.filter((s, i) => starts.indexOf(s) !== i);
expect(dup.length ? 'duplicates: ' + dup.join(', ') : 'all different', 'all different', 'label starts');
done('window');
