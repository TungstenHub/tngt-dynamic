const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);

class Frac {
  constructor(num, den) {
    if (den == 0) throw new Error('Zero denominator');
    const d = gcd(num,den);
    this._num = Math.sign(den)*num/d;
    this._den = Math.abs(den)/d;
  }

  get num() {return this._num};
  get den() {return this._den};

  static of(x) {
    if (Number.isInteger(x)) return new Frac(x, 1);
    // enough tens, just in case
    const tens = 10 ** x.toString().length;
    return new Frac(Math.round(tens * x), tens);
  }

  add(other) {
    const a = this.num, b = this.den, c = other.num, d = other.den;
    return new Frac(a*d + c*b, b*d);
  }

  neg() {
    const a = this.num, b = this.den;
    return new Frac(-a,b);
  }

  sub(other) {
    return this.add(other.neg());
  }

  mul(other) {
    const a = this.num, b = this.den, c = other.num, d = other.den;
    return new Frac(a*c, b*d);
  }

  inv() {
    const a = this.num, b = this.den;
    return new Frac(Math.sign(a)*b,Math.abs(a));
  }

  div(other) {
    return this.mul(other.inv());
  }

  isZero() {
    return this.num == 0;
  }

  toString() { return this.num + (this.den == 1 ? '' : ('/'+this.den))}

  tex() {
    if (this.den == 1) return this.num.toString();
    return `${this.num < 0 ? '-' : ''}\\frac{${Math.abs(this.num)}}{${this.den}}`;
  }
}

export default Frac;