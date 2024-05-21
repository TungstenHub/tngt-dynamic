import { parseLambda } from "../../math/lambda/parse.js";
import { richRepr } from "../../math/lambda/repr.js";
import { subs } from "../../math/lambda/subs.js";
import { label } from "../../utils/lang.js";
import { tex } from "../../utils/log.js";

const lb = label({
  en : {
    invalid: 'is not a valid variable',
    term: 'in term',
    substitute: 'substitute',
    for: 'for',
  },
  es : {
    invalid: 'no es una variable válida',
    term: 'en el término',
    substitute: 'sustituye',
    for: 'por',
  },
});

const script = {
  get args() { return [
    {
      name: lb('term'),
      default: 'λx.xy',
    },
    {
      name: lb('substitute'),
      default: 'y',
    },
    {
      name: lb('for'),
      default: 'K',
    },
  ]},
  suggs: [
    {
      desc: 'x[x := y]',
      inputs: ['x','x','y'],
    },
    {
      desc: 'z[x := y]',
      inputs: ['z','x','y'],
    },
    {
      desc: '(λx.xy)[y := x]',
      inputs: ['λx.xy','y','x'],
    },
  ],
  logic: ([ts,v,bs]) => {
    if (v.length != 1 || (!v.match(/[a-z]/)))
      throw new Error(`\`${v}\` ${lb('invalid')}.`)
    const t = parseLambda(ts);
    const b = parseLambda(bs);
    return [
      tex((t.isVar() ? richRepr(t) : '(' + richRepr(t) + ')')
      + '[' + v + '\\, := \\,' + richRepr(b) + '] \\, = \\, '
      + richRepr(subs(v,b)(t))).replace(/([IMKSΩY])/g, "\\mathsf{$1}")
    ];
  }
};

window.handleScript(script);