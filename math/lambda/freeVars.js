import { LambdaVisitor } from "./lambda.js";

class FreeVars extends LambdaVisitor {
  visitVar(x) {return new Set(x.var);}
  visitAbs(x) {const s = x.term.accept(this); s.delete(x.var); return s;}
  visitApp(x) {
    const s = x.fun.accept(this);
    x.body.accept(this).forEach(e => s.add(e));
    return s;
  }
}

const THE = new FreeVars();

const freeVars = l => l.accept(THE);
const isCombinator = l => freeVars(l).size == 0;

export {
  freeVars,
  isCombinator,
}