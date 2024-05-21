import { isBNF, leftmost_seq } from "../../math/lambda/beta.js";
import { alphaEq } from "../../math/lambda/eq.js";
import { Lambda } from "../../math/lambda/lambda.js";
import { parseLambda } from "../../math/lambda/parse.js";
import { numTex, richRepr } from "../../math/lambda/repr.js";
import { label } from "../../utils/lang.js";
import { tex } from "../../utils/log.js";

const lb = label({
  en : {
    allowed: 'Only digits and `#+*^()` allowed',
    equals: 'which equals ',
    term: 'term',
  },
  es : {
    allowed: 'Sólo se permiten dígitos y `#+*^()`',
    equals: 'que es igual a ',
    term: 'término',
  },
});

const script = {
  get args() { return [
    {
      name: lb('term'),
      default: '+34',
    },
  ]},
  suggs: [
    {
      desc: '#6',
      inputs: ['#6'],
    },
    {
      desc: '+71',
      inputs: ['+71'],
    },
    {
      desc: '*23',
      inputs: ['*23'],
    },
    {
      desc: '^32',
      inputs: ['^32'],
    },
    {
      desc: '+(*46)5',
      inputs: ['+(*46)5'],
    },
    {
      desc: '*(+89)(+67)',
      inputs: ['*(+89)(+67)'],
    },
  ],
  logic: ([l]) => {
    if ([...l].some(c => !c.match(/[0-9#+*^()]/)))
      return [lb('allowed')];
    const t = parseLambda(l);
    const tt = Array.from(leftmost_seq(t,1000));
    if (tt.length == 1) return [tex(numTex(t))];
    const bnf = isBNF(tt[tt.length-1]);
    const r = richRepr(tt[tt.length-1]);
    let res;
    if (bnf && r.length != 1) {
      const cand = r.split("f").length-2;
      if (alphaEq(Lambda.num(cand),tt[tt.length-1])) res = cand;
    }
    return [
      tex(`\\begin{split} ${
        numTex(t)
      } & \\,\\longrightarrow_\\beta\\, ${
        tt.slice(1).map(numTex).join('\\\\ & \\,\\longrightarrow_\\beta\\,')
      } ${
        bnf ? '' : '\\\\ & \\,\\longrightarrow_\\beta\\, \\cdots'
      } \\end{split}`),
      res ? lb('equals') + `$\\mathsf{${res}}$` : ''
    ];
  }
};

window.handleScript(script);