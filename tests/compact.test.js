// Compact labels (used when space is tight): keep the 1–3 most telling words.
const { cleanTitle } = require('../extension/clean.js');
const { expect, done } = require('./check.js');

// [page title, url, label at 14 chars, label at 18 chars]
const cases = [
  ['python - How do I merge two dictionaries in a single expression? - Stack Overflow', 'https://stackoverflow.com/q/1', 'Merge dictionaries', 'Merge dictionaries'],
  ['telomerase ALT pathway cancer - Google Search', 'https://www.google.com/search?q=x', 'Telomerase ALT', 'Telomerase ALT'],
  ['Lab Outreach Targets - Google Docs', 'https://docs.google.com/document/d/x', 'Lab Outreach', 'Lab Outreach'],
  ['STAT 101 Homework 5: Hypothesis Testing and Total Variation Distance | Intro to Statistics', 'https://stat101.example.edu/hw5', 'STAT 101', 'STAT 101 Homework'],
  ['(12) How Telomeres Shorten With Age | Explained - YouTube', 'https://www.youtube.com/watch?v=x', 'Telomeres Shorten', 'Telomeres Shorten'],
  ['Amazon.com: Apple AirPods Pro (2nd Generation) Wireless Ear Buds with USB-C Charging', 'https://www.amazon.com/dp/x', 'Apple AirPods', 'Apple AirPods Pro'],
  ['What is the difference between mitosis and meiosis? - Biology Stack Exchange', 'https://biology.stackexchange.com/q/1', 'Mitosis meiosis', 'Mitosis meiosis'],
  ['Telomere - Wikipedia', 'https://en.wikipedia.org/wiki/Telomere', 'Telomere', 'Telomere'],
  ['(3) Inbox - student@example.edu - Example University Mail', 'https://mail.google.com/mail/u/0/#inbox', '(3) Inbox', '(3) Inbox'],
];

for (const [title, url, at14, at18] of cases) {
  for (const [len, want] of [[14, at14], [18, at18]]) {
    const got = cleanTitle(title, url, len);
    expect(got, want, `[${len}] ` + title.slice(0, 50));
    // Rule: compact may run up to 8 chars past the limit (Chrome fades the end), never more.
    if (got.length > len + 8) expect(got, `(at most ${len + 8} chars)`, title, 'too long: ' + got.length);
  }
}
done('compact');
