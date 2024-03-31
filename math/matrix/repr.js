import label from "../../utils/lang.js";
import { tex } from "../../utils/log.js";
import Frac from "../number/frac.js";

const msgs = {
  en : {
    notDoubleArray: s => 'Input `' + s + '` is not a double array.',
    notNumbers:     s => 'Input `' + s + '` is not made of numbers.',
    unequalRows:    s => 'Input `' + s + '` has unequal row lengths.',
    notSquare:      s => 'Matrix `' + s + '` is not square.',
    initial:             'Your initial matrix is',
  },
  es : {
    notDoubleArray: s => 'La entrada `' + s + '` no es un array doble.',
    notNumbers:     s => 'La entrada `' + s + '` no está hecha de números.',
    unequalRows:    s => 'La entrada `' + s + '` tiene filas de distinta longitud.',
    notSquare:      s => 'Matrix `' + s + '` no es cuadrada.',
    initial:             'La matriz inicial es',
  },
}
const error = id => s => { throw new Error(label(msgs)(id)(s)); }

const fracMatrix = m => m.map(r => r.map(e => Frac.of(e)));

const _parse = square => s => {
  const err = id => error(id)(s);
  let m;
  try { m = JSON.parse(s); } catch (e) {err('notDoubleArray')}
  if (!Array.isArray(m)) err('notDoubleArray');
  if (!m.every(r => Array.isArray(r))) err('notDoubleArray');
  if (m.some(r => r.some(e => typeof(e) != 'number'))) err('notNumbers');
  if (m.length > 0 && m.some(r => r.length != m[0].length)) err('unequalRows');
  if (square && m.length > 0 && m.length != m[0].length) err('notSquare');
  return fracMatrix(m);
};

const parseMatrix = _parse(false);
const parseSquareMatrix = _parse(true);

const matrixRepr = (m,xtra={}) => {
  const repr = (e,i,j) =>
    xtra.pivots && xtra.pivots.some(([a,b]) => a==i && b==j)
      ? '\\hl{' + e.tex() + '}' : e.tex();
  return `
    \\left(\\begin{array}{${'c'.repeat(m[0].length)}}
    ${m.map((r,i) => r.map((e,j) =>
      repr(e,i,j)).join(' & ') + ' \\\\').join(' ')}
    \\end{array}\\right)
  `;
};

const initial = m => [
  label(msgs)('initial'),
	tex(matrixRepr(m)),
];

export {
  parseMatrix,
  parseSquareMatrix,
  matrixRepr,
  initial,
};