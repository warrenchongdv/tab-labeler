// Cleanup rules on real-world titles, at the default length (30).
const { cleanTitle } = require('../extension/clean.js');
const { expect, done } = require('./check.js');
const LEN = 30;

// [page title, url, label we expect]
const cases = [
  ['(3) Inbox - student@example.edu - Example University Mail','https://mail.google.com/mail/u/0/#inbox', '(3) Inbox'],
  ['Lab Outreach Targets - Google Docs', 'https://docs.google.com/document/d/abc/edit', 'Lab Outreach Targets'],
  ['(12) How Telomeres Shorten With Age | Explained - YouTube', 'https://www.youtube.com/watch?v=x', 'How Telomeres Shorten With Age'],
  ['telomerase ALT pathway cancer - Google Search', 'https://www.google.com/search?q=telomerase', '🔍 telomerase ALT pathway…'],
  ['GitHub - furybee/chrome-tab-modifier: Tabee: rename, re-icon, pin', 'https://github.com/furybee/chrome-tab-modifier', 'furybee/chrome-tab-modifier'],
  ['Fix tab overlap · Issue #42 · octo/notes', 'https://github.com/octo/notes/issues/42','#42 Fix tab overlap'],
  ['Telomere - Wikipedia', 'https://en.wikipedia.org/wiki/Telomere', 'Telomere'],
  ['STAT 101 Homework 5: Hypothesis Testing and Total Variation Distance | Intro to Statistics', 'https://stat101.example.edu/hw5', 'STAT 101 Homework 5…'],
  ['Amazon.com: Apple AirPods Pro (2nd Generation) Wireless Ear Buds with USB-C Charging', 'https://www.amazon.com/dp/x', 'Apple AirPods Pro (2nd…'],
  ['Home | Smith Lab', 'https://smithlab.example.edu/', 'Smith Lab'],
  ['Dashboard', 'https://canvas.instructure.com/', 'Dashboard'],
  ['r/college - Enrollment megathread: ask your questions here', 'https://www.reddit.com/r/college/comments/x','Enrollment megathread: ask…'],
  ['Pricing | Notion', 'https://www.notion.so/pricing', 'Pricing'],
  ['Stack Overflow - Where Developers Learn', 'https://stackoverflow.com/', 'Where Developers Learn'],
  ['python - How do I merge two dictionaries in a single expression? - Stack Overflow', 'https://stackoverflow.com/questions/38987', 'How do I merge two…'],
  ['City Library - Account Settings', 'https://citylibrary.example.org/account', 'Account Settings'],
  ['', 'https://example.com', ''], // no title: leave it alone so Chrome shows its own
];

for (const [title, url, want] of cases) {
  const got = cleanTitle(title, url, LEN);
  expect(got, want, title || '(empty title)');
  // Rule: at normal length, a label never goes over the limit.
  if (got && got.length > LEN) expect(got, '(at most ' + LEN + ' chars)', title, 'too long: ' + got.length);
}
done('titles');
