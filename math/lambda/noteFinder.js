import { LambdaVisitor } from "./lambda.js";

class NoteFinder extends LambdaVisitor {
  constructor(type) {
    super();
    this._type = type;
  }
  visitVar(x) {return x[this._type];}
  visitAbs(x) {return x[this._type] || x.term.accept(this);}
  visitApp(x) {return x[this._type]
    || x.fun.accept(this) || x.body.accept(this);}
}

const findNote = t => l => l.accept(new NoteFinder(t));

export {
  findNote
}