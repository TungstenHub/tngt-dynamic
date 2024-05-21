import { label } from "../../utils/lang.js";
import { tex } from "../../utils/log.js";
import { matrixRepr } from "./repr.js";

const echelonListener = {
  show: (m,pivots) => {},
  swap: (i,j) => {},
  mul: (i,k) => {},
  add: (k,i,j) => {},
  piv: (i,j) => {},
};

const echelon = listener => m => {
  let col = 0;
  let pivots = [];
  const nRows = m.length;
  const nCols = m[0].length;
  for (let row = 0; row < nRows; row++) {
    let pivotFound;
    while (col < nCols && m[row][col].isZero()) {
      pivotFound = false;
      for (let i = row; i < nRows; i++)
        if (!m[i][col].isZero()) {
          listener.swap(row,i);
          let temp = m[row]; m[row] = m[i]; m[i] = temp;
          listener.show(m,pivots);
          pivotFound = true;
          break
        }
      if (!pivotFound) col += 1;
    }
    if (col >= nCols) break;

    pivots.push([row,col]);
    listener.piv(row,col);
    const v = m[row][col];
    if (v != 1) {
      listener.mul(row,v.inv());
      for (let j = 0; j < nCols; j++) m[row][j] = m[row][j].div(v);
    }
    listener.show(m,pivots);
    let matrixChanged = false;
    for (let i = row+1; i < nRows; i++) {
      if (!m[i][col].isZero()) {
        matrixChanged = true;
        const factor = m[i][col].neg();
        listener.add(factor, row, i);
        for (let j = 0; j < nCols; j++)
          m[i][j] = m[i][j].add(factor.mul(m[row][j]));
      }
    }
    if (matrixChanged) listener.show(m,pivots);
    col += 1;
  }
  return pivots;
};

const reduce = listener => (m,pivots) => {
  const nCols = m[0].length;
  for (const [row,col] of pivots) {
    let matrixChanged = false;
    for (let k = 0; k < row; k++) {
      if (!m[k][col].isZero()) {
        matrixChanged = true;
        const factor = m[k][col].neg();
        listener.add(factor, row, k);
        for (let j = col; j < nCols; j++)
          m[k][j] = m[k][j].add(factor.mul(m[row][j]));
      }
    }
    if (matrixChanged) listener.show(m,pivots);
  }
}

const lb = label({
  en : {
    swap: (i,j) => `Swap **row ${i+1}** with **row ${j+1}**`,
    mul: (i,k) => `Multiply **row ${i+1}** by **${k}**`,
    add: (k,i,j) => `Take **${k}** times **row ${i+1}** and add it to **row ${j+1}**`,
    piv: (i,j) => `We have a pivot in position **(${i+1},${j+1})**`,
    alreadyReduced: 'This matrix is already in reduced echelon form',
    alreadyEchelon: 'This matrix is already in echelon form. Let\'s convert it to reduced echelon form',
    toEchelon: 'Let\'s convert this matrix to echelon form',
    echelonAlreadyReduced: 'This is the echelon form and it is already reduced',
    toReduced: 'Now let\'s convert this matrix to reduced echelon form',
    reduced: 'This is the reduced echelon form',
  },
  es : {
    swap: (i,j) => `Intercambiamos las filas **${i+1}** y **${j+1}**`,
    mul: (i,k) => `Multiplicamos la **fila ${i+1}** por **${k}**`,
    add: (k,i,j) => `Añadimos **${k}** veces la **fila ${i+1}** a la **fila ${j+1}**`,
    piv: (i,j) => `Tenemos un pivote en la posición **(${i+1},${j+1})**`,
    alreadyReduced: 'Esta matriz ya está en forma escalonada reducida',
    alreadyEchelon: 'Esta matriz ya está en forma escalonada. Vamos a convertirla a la forma escalonada reducida',
    toEchelon: 'Vamos a convertir esta matriz a la forma escalonada',
    echelonAlreadyReduced: 'Ésta es la forma escalonada y ya es reducida',
    toReduced: 'Ahora vamos a convertir esta matriz a la forma escalonada reducida',
    reduced: 'Ésta es la forma escalonada reducida',
  },
})

const explainer = collect => ({
  ...echelonListener,
  show: (m,pivots) => collect(tex(matrixRepr(m,{pivots}))),
  swap: (i,j) => collect(lb('swap')(i,j)),
  mul: (i,k) => collect(lb('mul')(i,k)),
  add: (k,i,j) => collect(lb('add')(k,i,j)),
  piv: (i,j) => collect(lb('piv')(i,j)),
});

const echelonExplainer = m => {
  const eSteps = [];
  const rSteps = [];
  const pivots = echelon(explainer(x => eSteps.push(x)))(m);
  reduce(explainer(x => rSteps.push(x)))(m,pivots);
  if (eSteps.length == 0 && rSteps.length == 0)
    return [lb('alreadyReduced')];
  if (eSteps.length == 0)
    return [
      lb('alreadyEchelon'),
      ...rSteps,
      lb('reduced'),
    ];
  if (rSteps.length == 0)
    return [
      lb('toEchelon'),
      ...eSteps,
      lb('echelonAlreadyReduced'),
    ];
  return [
    lb('toEchelon'),
    ...eSteps,
    lb('toReduced'),
    ...rSteps,
    lb('reduced'),
  ];
};

export {
  echelonListener,
  echelon,
  echelonExplainer,
};