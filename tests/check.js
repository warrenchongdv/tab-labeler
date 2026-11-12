// Tiny test helper: compare each label to the one we expect, then exit 1 if anything failed.
// A "todo" case is a known-bad label: it shows what we want, but doesn't fail the run yet.
let fails = 0, passes = 0, todos = 0;

function expect(got, want, from, note = '') {
  if (got === want) { passes++; console.log('ok    ', String(got).padEnd(30), '<=', from); return; }
  fails++;
  console.log('FAIL  ', String(got).padEnd(30), '<=', from);
  console.log('       expected:', JSON.stringify(want), note);
}

function todo(got, want, from) {
  todos++;
  const fixed = got === want;
  console.log(fixed ? 'FIXED ' : 'todo  ', String(got).padEnd(30), '<=', from, fixed ? '(move it to expect)' : '-> want ' + JSON.stringify(want));
}

function done(name) {
  console.log(`\n${name}: ${passes} passed, ${fails} failed, ${todos} todo`);
  if (fails) process.exit(1);
}

module.exports = { expect, todo, done };
