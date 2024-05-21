const vars = 'abcdefghijklmnopqrstuvwxyz'.split('');

const varProvider = (...sets) => {
  for (const v of vars) if (sets.every(s => !s.has(v))) return v;
  return undefined;
}

export {
  varProvider,
}