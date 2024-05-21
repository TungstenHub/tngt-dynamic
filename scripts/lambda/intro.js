import { parseLambda } from "../../math/lambda/parse.js";
import { richTex, simpleTex, stdTex } from "../../math/lambda/repr.js";
import { label } from "../../utils/lang.js";
import { tex } from "../../utils/log.js";

const lb = label({
  en : {
    strict: 'Strict representation:',
    standard: 'Standard representation:',
    simplified: 'Simplified representation:',
    term: 'term',
  },
  es : {
    strict: 'Representación estricta:',
    standard: 'Representación estándar:',
    simplified: 'Representación simplificada:',
    term: 'término',
  },
});

const script = {
  get args() { return [
    {
      name: lb('term'),
      default: 'λx.xx',
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
  ],
  logic: ([s]) => {
    const l = parseLambda(s);
    return [
      lb('strict'),
      tex(simpleTex(l)),
      lb('standard'),
      tex(stdTex(l)),
      lb('simplified'),
      tex(richTex(l)),
    ]
  }
};

window.handleScript(script);