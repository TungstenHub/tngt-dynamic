import { freeVars } from "../../math/lambda/freeVars.js";
import { parseLambda } from "../../math/lambda/parse.js";
import { richTex } from "../../math/lambda/repr.js";
import { label } from "../../utils/lang.js";
import { tex } from "../../utils/log.js";

const lb = label({
  en : {
    and: 'and',
    nfv: 'has no free variables, and is thus a combinator',
    fv: 'has the free variables',
    term: 'term',
  },
  es : {
    and: 'y',
    nfv: 'no tiene variables libres, y por tanto es un combinador',
    fv: 'tiene las variables libres',
    term: 'término',
  },
});

const script = {
  get args() { return [
    {
      name: lb('term'),
      default: 'λx.xy',
    },
  ]},
  suggs: [
    {
      desc: 'x',
      inputs: ['x'],
    },
    {
      desc: 'λx.xy',
      inputs: ['λx.xy'],
    },
    {
      desc: 'z(λxz.xy)',
      inputs: ['z(λxz.xy)'],
    },
    {
      desc: 'I',
      inputs: ['I'],
    },
    {
      desc: 'M',
      inputs: ['M'],
    },
    {
      desc: 'K',
      inputs: ['K'],
    },
    {
      desc: 'S',
      inputs: ['S'],
    },
    {
      desc: 'Ω',
      inputs: ['Ω'],
    },
    {
      desc: 'Y',
      inputs: ['Y'],
    },
  ],
  logic: ([s]) => {
    const l = parseLambda(s);
    const fvs = freeVars(l);
    const format = xs => {
      const xxs = [...xs];
      let s = '`' + xxs[0] + '`';
      for (let i = 1; i < xxs.length - 1; i++) s += ', `' + xxs[i] + '`';
      if (xxs.length > 1) s += ` ${lb('and')} \`` + xxs[xxs.length - 1] + '`';
      return s;
    }
    return fvs.size == 0
      ? [tex(richTex(l)), `${lb('nfv')}.`]
      : [tex(richTex(l)), `${lb('fv')} ${format(fvs)}.`]
  }
};

window.handleScript(script);