import { LambdaVisitor } from "./lambda.js";
import { tex as baseTex } from "../../utils/log.js";

class SimpleRepr extends LambdaVisitor {
  visitVar(x) {return x.var;}
  visitAbs(x) {return `(λ${x.var}.${x.term.accept(this)})`;}
  visitApp(x) {return `(${x.fun.accept(this)}${x.body.accept(this)})`;}
}

const par = (p,x) => p ? `(${x})` : x;

class Repr extends LambdaVisitor {
  visitVar(x,p) {return x.var;}
  visitAbs(x,p) {return par(p,`λ${this._collectAbs(x)}`);}
  visitApp(x,p) {return par(p,
    `${x.fun.accept(this,!x.fun.isApp())}${x.body.accept(this,true)}`);}

  _collectAbs(x) {return x.var + (x.term.isAbs()
    ? this._collectAbs(x.term)
    : '.'+x.term.accept(this,false));
  }
}

const SIMPLE_THE = new SimpleRepr();
const THE = new Repr();

const simpleRepr = l => l.accept(SIMPLE_THE);
const simpleTex  = l => baseTex(simpleRepr(l).replaceAll('λ','\\lambda '));
const repr       = l => l.accept(THE);
const tex        = l => baseTex(repr(l).replaceAll('λ','\\lambda '));

export {
  repr,
  tex,
  simpleRepr,
  simpleTex,
}