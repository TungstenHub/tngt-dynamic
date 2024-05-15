import { freeVars } from "./freeVars.js";
import { LambdaVisitor, abs, app } from "./lambda.js";
import { subs } from "./subs.js";

class Leftmost extends LambdaVisitor {
  visitVar(x) {return undefined;}
  visitAbs(x) {
    const t = x.term.accept(this);
    if (t) return abs(x.var, t);
    else return undefined;
  }
  visitApp(x) {
    if (x.fun.isAbs()) return this._subs(x);
    const f = x.fun.accept(this);
    if (f) return app(f,x.body);
    const b = x.body.accept(this);
    if (b) return app(x.fun,b);
    return undefined;
  }

  _subs(x) { return subs(x.fun.var, x.body)(x.fun.term); }
}

class Infinite extends Leftmost {
  _subs(x) {
    const b = x.body.accept(this);
    if (freeVars(x.fun.term).has(x.fun.var) || !b)
      return subs(x.fun.var, x.body)(x.fun.term);
    else return app(x.fun,b);
  }
}

const L_THE = new Leftmost();
const I_THE = new Infinite();

const leftmost = l => l.accept(L_THE);
const infinite = l => l.accept(I_THE);

const gen = transf => {
  return function* (l,limit) {
    let curr = l;
    let i = 0;
    while (curr && (!limit || i < limit)) {
      yield curr;
      curr = transf(curr);
      i++;
    }
  }
}

// may be infinite!
const normal = l => {
  const red = leftmost(l);
  return red ? normal(red) : l;
}

const isBNF = l => leftmost(l) == undefined;

const leftmost_seq = gen(leftmost);
const infinite_seq = gen(infinite);

export {
  leftmost,
  leftmost_seq,
  infinite,
  infinite_seq,
  normal,
  isBNF,
}