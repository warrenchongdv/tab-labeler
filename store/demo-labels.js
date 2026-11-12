// Prints the real labels for the store screenshot's tabs, so the image never shows invented output.
// Run: node store/demo-labels.js
const { labelWindow } = require('../extension/clean.js');
const rows = [
  ['Project Atlas Budget - Google Sheets', 'https://docs.google.com/spreadsheets/d/a'],
  ['Project Atlas Roadmap - Google Docs', 'https://docs.google.com/document/d/b'],
  ['Project Atlas Kickoff Deck - Google Slides', 'https://docs.google.com/presentation/d/c'],
  ['Project Atlas Hiring Plan - Notion', 'https://www.notion.so/atlas-hiring'],
  ['Inbox (12) - you@company.com - Company Mail', 'https://mail.google.com/mail/u/0/#inbox'],
  ['Weekly Team Sync - Calendar', 'https://calendar.google.com/calendar/r'],
  ['PROJ-142 Fix login timeout - Jira', 'https://company.atlassian.net/browse/PROJ-142'],
  ['PROJ-157 Pricing page redesign - Jira','https://company.atlassian.net/browse/PROJ-157'],
  ['Vendor Contract Draft - Google Docs', 'https://docs.google.com/document/d/d'],
  ['Customer Feedback Summary - Google Docs', 'https://docs.google.com/document/d/e'],
  ['Acme Corp Renewal | Salesforce', 'https://company.lightning.force.com/r/1'],
  ['Onboarding Checklist - Notion', 'https://www.notion.so/onboarding'],
].map(([title, url], id) => ({ id, title, url }));
const L = labelWindow(rows, 9);
rows.forEach(r => console.log(JSON.stringify(L[r.id]).padEnd(22), r.title));
