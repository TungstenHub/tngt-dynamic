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

const apps = (...args) => args.reduce(app);

const x = 'x';
const y = 'y';
const z = 'z';
const f = 'f';
const _x = vbl(x);
const _y = vbl(y);
const _z = vbl(z);
const _f = vbl(f);
Lambda.I = abs(x,_x);
Lambda.M = abs(x,app(_x,_x));
Lambda.K = abs(x,abs(y,_x));
Lambda.S = abs(x,abs(y,abs(z,app(app(_x,_z),app(_y,_z)))));
Lambda.Ω = app(Lambda.M,Lambda.M);
Lambda.Y = abs(f,app(abs(x,app(_f,app(_x,_x))),abs(x,app(_f,app(_x,_x)))));

export {
  Lambda, Var, Abs, App,
  vbl, abs, app, apps,
  LambdaVisitor,
}
