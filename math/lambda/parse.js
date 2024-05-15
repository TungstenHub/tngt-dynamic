import { Lambda, vbl, abs, app } from "./lambda.js";

// state used during the parsing process
let s, idx, nest;

// parse errors
const err = m => () => { throw new Error(m); };
const charError = inv => (c,i) => { throw new Error(
  `${inv ? 'Invalid' : 'Unexpected'} character \`${c}\` at position ${i}`);
};
const invalid = charError(true);
const unexpected = charError(false);
const endOfInput = err('Unexpected end of input');
const openParenthesis = err('Non-closed parenthesis');

const parseLambda = toParse => {
  [...toParse].forEach((c,i) => {
    if (!c.match(/[a-zA-Zα-ωΑ-Ω().]/)) invalid(c,i+1);})
  s = toParse;
  idx = 0;
  nest = 0;
  return _getLambda();
}

const _maybeGetChar = () => {
  if (idx >= s.length) return undefined;
  const c = s[idx];
  if (c == ' ') {idx++; return _maybeGetChar();}
  return c;
};

const _getChar = () => {
  const c = _maybeGetChar();
  if (c == undefined) endOfInput();
  idx++;
  return c;
};

const _maybeGetLambda = () => {
  const char = _maybeGetChar();
  if (char == undefined) {
    if (nest > 0) openParenthesis();
    return undefined;
  }
  if (char == ')') {idx++; _decreaseNest(); return undefined};
  return _getLambda(true);
}

// _getLambda returns a lambda term from a substring s[idx,idx+n].
// If `partial = false`, n is made as big as possible,
// provided that it is a valid lambda term.
// In the same way, `partial = true` tries to have n as small as possible.
const _getLambda = (partial) => {
  const char = _getChar();
  if (char == 'λ') return _absFromVars(_getVars(),_getLambda());
  let term;
  if (char == '(') {nest++; term = _getLambda();}
  else if ('IMKSΩY'.split('').includes(char)) term = Lambda[char];
  else {
    if (!char.match(/[a-z]/i)) unexpected(char,idx);
    term = vbl(char);
  }
  return partial ? term : _app(term);
}

const _getVars = () => {
  const vars = [];
  while (true) {
    const char = _getChar();
    if (char == '.') return vars;
    if (!char.match(/[a-z]/i)) unexpected(char,idx);
    vars.push(char);
  }
}

const _absFromVars = (vars,body) => {
  let term = body;
  for (let i = vars.length - 1; i>=0; i--) term = abs(vars[i],term);
  return term;
}

const _app = (term) => {
  let body = _maybeGetLambda();
  return body ? _app(app(term,body)) : term;
}

const _decreaseNest = () => {
  nest--;
  if (nest < 0) unexpected(')',idx);
}

export {
  parseLambda,
}