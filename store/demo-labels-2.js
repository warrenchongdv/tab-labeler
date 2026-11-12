// Real output for store screenshots 2-5. Run: node store/demo-labels-2.js
const { cleanTitle, labelWindow } = require('../extension/clean.js');

console.log('== Screenshot: cleanup (length 30)');
const clean = [
  ['Inbox (12) - you@company.com - Company Mail', 'https://mail.google.com/mail/u/0/#inbox'],
  ['Q3 Board Report - Google Docs', 'https://docs.google.com/document/d/x'],
  ['Amazon.com: Ergonomic Office Chair with Lumbar Support, Adjustable Armrests', 'https://www.amazon.com/dp/x'],
  ['Fix checkout timeout · Issue #212 · acme/storefront', 'https://github.com/acme/storefront/issues/212'],
  ['Home | Northwind Consulting', 'https://northwindconsulting.com/'],
  ['quarterly revenue forecast template - Google Search', 'https://www.google.com/search?q=x'],
];
clean.forEach(([t, u]) => console.log(JSON.stringify(cleanTitle(t, u, 30)).padEnd(34), t));

console.log('\n== Screenshot: auto length');
const tabs = [
  ['Project Atlas Budget - Google Sheets', 'https://docs.google.com/spreadsheets/d/a'],
  ['Project Atlas Roadmap - Google Docs', 'https://docs.google.com/document/d/b'],
  ['PROJ-157 Pricing page redesign - Jira', 'https://company.atlassian.net/browse/PROJ-157'],
  ['Customer Feedback Summary - Google Docs', 'https://docs.google.com/document/d/e'],
].map(([title, url], id) => ({ id, title, url }));
// 4 tabs open -> Auto gives 32 chars; 14 tabs open -> 9 chars (background.js lenFor).
for (const len of [32, 9]) {
  const L = labelWindow(tabs, len);
  console.log('len', len, tabs.map(t => JSON.stringify(L[t.id])).join('  '));
}
