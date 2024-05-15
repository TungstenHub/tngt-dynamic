import { Lambda, LambdaVisitor } from "./lambda.js";
import { tex as baseTex } from "../../utils/log.js";
import { alphaEq } from "./eq.js";

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

class RichRepr extends Repr {
  visitAbs(x,p) {return this._rich(x) || super.visitAbs(x,p);}
  visitApp(x,p) {return this._rich(x) || super.visitApp(x,p);}

  _rich(x) {
    for (const c of 'IMKSΩY'.split(''))
      if (alphaEq(x,Lambda[c])) return c;
  }
}

const SIMPLE_THE = new SimpleRepr();
const THE = new Repr();
const RICH_THE = new RichRepr();

const simpleRepr = l => l.accept(SIMPLE_THE);
const simpleTex  = l => baseTex(simpleRepr(l).replaceAll('λ','\\lambda '));
const repr       = l => l.accept(THE);
const tex        = l => baseTex(repr(l).replaceAll('λ','\\lambda '));
const richRepr   = l => l.accept(RICH_THE);
const richTex    = l => baseTex(richRepr(l).replaceAll('λ','\\lambda ')
                        .replace(/([IMKSΩY])/g, "\\mathsf{$1}"));

export {
  repr,
  tex,
  simpleRepr,
  simpleTex,
  richRepr,
  richTex,
}