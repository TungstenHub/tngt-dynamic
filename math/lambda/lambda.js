const unimplemented = what => { throw new Error('Unimplemented: ' + what); }

class Lambda {
  accept(visitor, ...xtra) {unimplemented('accept');}
  isVar() { return false; }
  isAbs() { return false; }
  isApp() { return false; }
}

class Var extends Lambda {
  constructor(name) {
    super();
    this.var = name;
  }

  accept(visitor, ...xtra) {return visitor.visitVar(this, ...xtra);}
  isVar() { return true; }
}

class Abs extends Lambda {
  constructor(name,term) {
    super();
    this.var = name;
    this.term = term;
  }

  accept(visitor, ...xtra) {return visitor.visitAbs(this, ...xtra);}
  isAbs() { return true; }
}

class App extends Lambda {
  constructor(fun,body) {
    super();
    this.fun = fun;
    this.body = body;
  }

  accept(visitor, ...xtra) {return visitor.visitApp(this, ...xtra);}
  isApp() { return true; }
}

class LambdaVisitor {
  visitVar(x, ...xtra) {unimplemented('visitVar');}
  visitAbs(x, ...xtra) {unimplemented('visitAbs');}
  visitApp(x, ...xtra) {unimplemented('visitApp');}
}

const vbl = name         => new Var(name);
const abs = (name, term) => new Abs(name,term);
const app = (fun, body)  => new App(fun,body);

Lambda.I = abs('x',vbl('x'));
Lambda.M = abs('x',app(vbl('x'),vbl('x')));
Lambda.K = abs('x',abs('y',vbl('x')));

export {
  Lambda, Var, Abs, App,
  vbl, abs, app,
  LambdaVisitor,
}
