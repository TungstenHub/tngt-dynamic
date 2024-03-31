import { echelonExplainer } from "../math/matrix/echelon.js";
import { initial, parseMatrix } from "../math/matrix/repr.js";

const script = {
  args: [
    {
      name: 'matrix',
      default: '[[1,2,3],[4,5,6],[7,8,9]]',
    },
  ],
  logic: ([s]) => {
    const m = parseMatrix(s);
    return [
      ...initial(m),
      ...echelonExplainer(m),
    ]
  }
};

window.handleScript(script);