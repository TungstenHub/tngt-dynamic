import { LambdaVisitor } from "./lambda.js";
import { rename } from "./subs.js";

class LiteralEq extends LambdaVisitor {
  visitVar(x,y) {return y.isVar() && x.var == y.var;}
  visitAbs(x,y) {
    return y.isAbs()
    && x.var == y.var
    && x.term.accept(this, y.term);
  }
  visitApp(x,y) {
    return y.isApp()
    && x.fun.accept(this, y.fun)
    && x.body.accept(this, y.body);
  }
}

class AlphaEq extends LiteralEq {
  visitAbs(x,y) {
    return y.isAbs()
    && x.term.accept(this, rename(y.var,x.var)(y.term));
  }
}

const LITERAL_THE = new LiteralEq();
const literalEq = (x,y) => x.accept(LITERAL_THE,y);
const ALPHA_THE = new AlphaEq();
const alphaEq = (x,y) => x.accept(ALPHA_THE,y);

export {
  literalEq,
  alphaEq,
}
