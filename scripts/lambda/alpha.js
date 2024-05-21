import { alphaEq } from "../../math/lambda/eq.js";
import { parseLambda } from "../../math/lambda/parse.js";
import { namedTex } from "../../math/lambda/repr.js";
import { label } from "../../utils/lang.js";
import { tex } from "../../utils/log.js";

const lb = label({
  en : {
    result: (t1, t2, eq) => [t1, 'and', t2, `are${
      eq ? '' : ' **not**'
    } $\\alpha$ - equivalent`],
    term: 'term',
  },
  es : {
    result: (t1, t2, eq) => [t1, 'y', t2, `${
      eq ? '' : '**no** '
    }son $\\alpha$ - equivalentes`],
    term: 'término',
  },
});

const script = {
  get args() { return [
    {
      name: lb('term') + ' 1',
      default: 'λx.xy',
    },
    {
      name: lb('term') + ' 2',
      default: 'λz.zy',
    },
  ]},
  suggs: [
    {
      desc: 'λz.z =?= I',
      inputs: ['λz.z','I'],
    },
    {
      desc: 'λxyz.xz(yz) =?= λabc.ac(bc)',
      inputs: ['λxyz.xz(yz)','λabc.ac(bc)'],
    },
    {
      desc: 'I =?= M',
      inputs: ['I','M'],
    },
  ],
  logic: ([l1,l2]) => {
    const t1 = parseLambda(l1);
    const t2 = parseLambda(l2);
    return lb('result')(tex(namedTex(t1)), tex(namedTex(t2)), alphaEq(t1,t2));
  }
};

window.handleScript(script);