import { Lambda, LambdaVisitor } from "./lambda.js";
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

  _collectAbs(x) {
    const r = this._rich(x.term);
    if (r) return x.var + '.' + r;
    return super._collectAbs(x);
  }
}

class NamedRepr extends RichRepr {
  _rich(x) {
    return x.name;
  }
}

class NumRepr extends RichRepr {
  _rich(x) {
    for (const n of [0,1,2,3,4,5,6,7,8,9])
      if (alphaEq(x,Lambda.num(n))) return n+'';
    if (alphaEq(x,Lambda.suc)) return '\\#';
    if (alphaEq(x,Lambda.add)) return '+';
    if (alphaEq(x,Lambda.mul)) return '*';
    if (alphaEq(x,Lambda.exp)) return '\\,\\hat{}\\,';
    return super._rich(x);
  }
}

const SIMPLE_THE = new SimpleRepr();
const THE = new Repr();
const RICH_THE = new RichRepr();
const NAMED_THE = new NamedRepr();
const NUM_THE = new NumRepr();

const simpleRepr = l => l.accept(SIMPLE_THE);
const simpleTex  = l => simpleRepr(l).replaceAll('λ','\\lambda ');
const stdRepr    = l => l.accept(THE);
const stdTex     = l => stdRepr(l).replaceAll('λ','\\lambda ');
const richRepr   = l => l.accept(RICH_THE);
const richTex    = l => richRepr(l).replaceAll('λ','\\lambda ')
                        .replace(/([IMKSΩY0123456789+])/g, "\\mathsf{$1}");
const namedRepr  = l => l.accept(NAMED_THE);
const namedTex   = l => namedRepr(l).replaceAll('λ','\\lambda ')
                        .replace(/([IMKSΩY0123456789+])/g, "\\mathsf{$1}");
const numRepr  = l => l.accept(NUM_THE);
const numTex   = l => numRepr(l).replaceAll('λ','\\lambda ')
                        .replace(/([IMKSΩY0123456789])/g, "\\mathsf{$1}");

export {
  SimpleRepr,
  simpleRepr,
  simpleTex,
  Repr,
  stdRepr,
  stdTex,
  RichRepr,
  richRepr,
  richTex,
  NamedRepr,
  namedRepr,
  namedTex,
  NumRepr,
  numRepr,
  numTex,
}