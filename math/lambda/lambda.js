const unimplemented = what => { throw new Error('Unimplemented: ' + what); }

class Lambda {
  accept(visitor, ...xtra) {unimplemented('accept');}
  isVar() { return false; }
  isAbs() { return false; }
  isApp() { return false; }

  static get I() { return _name(I(), 'I'); }
  static get M() { return _name(M(), 'M'); }
  static get K() { return _name(K(), 'K'); }
  static get S() { return _name(S(), 'S'); }
  static get Ω() { return _name(Ω(), 'Ω'); }
  static get Y() { return _name(Y(), 'Y'); }

  static num(n)  { return _name(num(n), n); }
  static get suc() { return _name(suc(), '#'); }
  static get add() { return _name(add(), '+'); }
  static get mul() { return _name(mul(), '*'); }
  static get exp() { return _name(exp(), '^'); }
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
const m = 'm';
const n = 'n';
const _x = vbl(x);
const _y = vbl(y);
const _z = vbl(z);
const _f = vbl(f);
const _m = vbl(m);
const _n = vbl(n);

const I = () => abs(x,_x);
const M = () => abs(x,app(_x,_x));
const K = () => abs(x,abs(y,_x));
const S = () => abs(x,abs(y,abs(z,app(app(_x,_z),app(_y,_z)))));
const Ω = () => app(Lambda.M,Lambda.M);
const Y = () => abs(f,app(abs(x,app(_f,app(_x,_x))),abs(x,app(_f,app(_x,_x)))));

const num = k => {
  let curr = _x;
  for (let i = 0; i < k; i++) curr = app(_f,curr);
  return abs(f,abs(x,curr));
}

const suc = () => abs(n,abs(f,abs(x,app(_f,app(app(_n,_f),_x)))));
const add = () => abs(m,abs(n,abs(f,abs(x,app(app(_m,_f),app(app(_n,_f),_x))))));
const mul = () => abs(m,abs(n,abs(f,abs(x,app(app(_m,app(_n,_f)),_x)))));
const exp = () => abs(m,abs(n,abs(f,abs(x,app(app(app(_n,_m),_f),_x)))));

const _name = (x,n) => {x.name = n; return x;};

export {
  Lambda, Var, Abs, App,
  vbl, abs, app, apps,
  LambdaVisitor,
}
