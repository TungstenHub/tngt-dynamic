import { isBNF, leftmost_seq } from "../../math/lambda/beta.js";
import { parseLambda } from "../../math/lambda/parse.js";
import { richTex } from "../../math/lambda/repr.js";
import { label } from "../../utils/lang.js";
import { iTex, tex } from "../../utils/log.js";

const lb = label({
  en : {
    already: 'is already in $\\beta$-normal form',
    reductions: 'Let\'s perform some $\\beta$-reductions in the first'
      + ' $\\beta$-redex we find',
    normal: w => `and ${w} is in $\\beta$-normal form`,
    forever: 'and we have not yet encountered a $\\beta$-normal form',
    term: 'term',
  },
  es : {
    already: 'ya está en forma $\\beta$-normal',
    reductions: 'Vamos a hacer unas $\\beta$-reducciones en el primer'
      + ' $\\beta$-redex que encontremos',
    normal: w => `y ${w} está en forma $\\beta$-normal`,
    forever: 'y todavía no hemos encontrado una forma $\\beta$-normal',
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
    const tt = Array.from(leftmost_seq(t,10));
    if (tt.length == 1) return [tex(richTex(t)), lb('already')];
    const bnf = isBNF(tt[tt.length-1]);
    return [
      lb('reductions'),
      tex(`\\begin{split} ${
        richTex(t)
      } & \\,\\longrightarrow_\\beta\\, ${
        tt.slice(1).map(richTex).join('\\\\ & \\,\\longrightarrow_\\beta\\,')
      } ${
        bnf ? '' : '\\\\ & \\,\\longrightarrow_\\beta\\, \\cdots'
      } \\end{split}`),
      bnf
        ? lb('normal')(iTex(richTex(tt[tt.length-1])))
        : lb('forever')
    ];
  }
};

window.handleScript(script);