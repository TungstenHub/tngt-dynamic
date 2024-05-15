import { freeVars } from "./freeVars.js";
import { LambdaVisitor, abs, app, vbl } from "./lambda.js";
import { varProvider } from "./varProvider.js";

class Subs extends LambdaVisitor {

  visitVar(x,v,b) {return x.var == v ? b : x;}
  visitAbs(x,v,b) {
    if (x.var == v) return x;
    let fv1, fv2;
    if (!(fv1 = freeVars(x.term)).has(v)) return x;
    if (!(fv2 = freeVars(b)).has(x.var))
      return abs(x.var, x.term.accept(this,v,b));
    const a = varProvider(fv1,fv2);
    return abs(
      a,
      x.term
        .accept(this,x.var,vbl(a))
        .accept(this,v,b));
  }
  visitApp(x,v,b) {
    return app(x.fun.accept(this,v,b),x.body.accept(this,v,b));
  }
}

const THE = new Subs();

const subs = (v,b) => l => l.accept(THE,v,b);
const rename = (v,w) => subs(v,vbl(w));

export {
  subs,
  rename,
}
