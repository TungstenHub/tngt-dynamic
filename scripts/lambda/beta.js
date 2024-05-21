import { leftmost, leftmostMark } from "../../math/lambda/beta.js";
import { findNote } from "../../math/lambda/noteFinder.js";
import { parseLambda } from "../../math/lambda/parse.js";
import { RichRepr, namedRepr, richRepr, richTex, stdRepr }
  from "../../math/lambda/repr.js";
import { label } from "../../utils/lang.js";
import { tex } from "../../utils/log.js";

const findRedex = findNote('redex');

const par = (p,x) => p ? `(${x})` : x;
class BetaNotedRichRepr1 extends RichRepr {
  visitApp(x,p) {return x.redex
    ? par(p, this._redex(x))
    : super.visitApp(x,p);}

  _redex(x) {
    return `\\overset{\\textsf{fun}}{\\overgroup{${
      `(λ${x.fun.var}.${x.fun.term.accept(this)})`
    }}}\\underset{\\textsf{arg}}{\\undergroup{${
      x.body.accept(this,true)
    }}}`;
  }

  _rich(x) {
    if (findRedex(x)) return undefined;
    return super._rich(x);
  }
}

class BetaNotedRichRepr2 extends BetaNotedRichRepr1 {
  _redex(x) {
    return `\\undergroup{${
      `${
        x.fun.term.accept(this,!x.fun.term.isVar())
      }[${x.fun.var} \\, := \\, ${x.body.accept(this,false)}]`
    }}`
  }
}

const BNRR1 = new BetaNotedRichRepr1();
const BNRR2 = new BetaNotedRichRepr2();

const convert = l => {
  const t = leftmostMark(l);
  if (!t) return undefined;
  const rl = richRepr(l);
  const lm = leftmost(l);
  const named = namedRepr(lm);
  const rich = richRepr(lm);
  return tex(`${
    stdRepr(l) != rl
    ? rl + ' \\, = \\, '
    : ''
  }${
    t.accept(BNRR1)
  }\\,\\longrightarrow_\\beta\\,${
    t.accept(BNRR2)
  }\\, = \\,${
    named
  }${named != rich
    ? ' \\, = \\, ' + rich
    : ''
  }`
  .replaceAll('λ','\\lambda ')
  .replace(/([IMKSΩY])/g, "\\mathsf{$1}"));
};

const lb = label({
  en : {
    normal: 'is already in $\\beta$-normal form',
    term: 'term',
  },
  es : {
    normal: 'ya está en forma $\\beta$-normal',
    term: 'término',
  },
});

const script = {
  get args() { return [
    {
      name: lb('term'),
      default: 'SKK',
    },
  ]},
  suggs: [
    {
      desc: 'I = λx.x',
      inputs: ['I'],
    },
    {
      desc: 'M = λx.xx',
      inputs: ['M'],
    },
    {
      desc: 'K = λxy.x',
      inputs: ['K'],
    },
    {
      desc: 'S = λxyz.xz(yz)',
      inputs: ['S'],
    },
    {
      desc: 'Ω = MM = (λx.xx)(λx.xx)',
      inputs: ['Ω'],
    },
    {
      desc: 'Y = λf.(λx.f(xx))(λx.f(xx))',
      inputs: ['Y'],
    },
    {
      desc: 'MI',
      inputs: ['MI'],
    },
    {
      desc: 'KIY',
      inputs: ['KIY'],
    },
    {
      desc: 'YI',
      inputs: ['YI'],
    },
  ],
  logic: ([l]) => {
    const t = parseLambda(l);
    const conv = convert(t);
    return conv ? [conv] : [tex(richTex(t)), lb('normal')];
  }
};

window.handleScript(script);