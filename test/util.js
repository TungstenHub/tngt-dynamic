const strict = true;

// test structure
const sect = w => console.log(`\n\x1b[36m${w}\x1b[0m`);
const ok = w => console.log(`\x1b[32mOK\x1b[0m ${w}`);
const ko = w => console.log(`\x1b[31mKO\x1b[0m ${w}`);

let success = true;

const test = (name,trial) => {
  if (strict && !success) return;
  try { trial(); ok(name); }
  catch (e) { success = false; ko(name); console.log('  ' + e.message); }
}

// check
const check = (a,b) => {
  if (a != b) throw new Error (`Expected ${a} to be equal to ${b}`);
}
const checkTrans = trans => (a,b) => { check(trans(a),b); };

export {
  sect,
  test,
  check,
  checkTrans,
}