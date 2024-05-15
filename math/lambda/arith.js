import { abs, app, vbl } from "./lambda.js";
import { parseLambda } from "./parse.js";

const True  = parseLambda('λxy.x');
const False = parseLambda('λxy.y');

const ifthenelse = parseLambda('λxyz.xyz');

const pair = parseLambda('λmnx.xmn');

const fst = parseLambda('λp.p(λxy.x)');
const snd = parseLambda('λp.p(λxy.y)');

const num = k => {
  const x = vbl('x'), f = vbl('f');
  let curr = x;
  for (let i = 0; i < k; i++) curr = app(f,curr);
  return abs('f',abs('x',curr));
}

const succ = parseLambda('λnfx.f(nfx)');
const add = parseLambda('λmnfx.mf(nfx)');
const mul = parseLambda('λmnfx.m(nf)x');
const exp = parseLambda('λmnfx.nmfx');

export {
  True, False, ifthenelse,
  pair, fst, snd,
  num, succ, add, mul, exp,
}