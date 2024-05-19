import { False, True, add, exp, fst, ifthenelse, mul, num, pair, snd, succ }
  from "../math/lambda/arith.js";
import { leftmost_seq, infinite_seq, normal } from "../math/lambda/beta.js";
import { alphaEq, literalEq } from "../math/lambda/eq.js";
import { freeVars, isCombinator } from "../math/lambda/freeVars.js";
import { app, apps, vbl } from "../math/lambda/lambda.js";
import { parseLambda } from "../math/lambda/parse.js";
import { repr, richRepr, simpleRepr } from "../math/lambda/repr.js";
import { subs } from "../math/lambda/subs.js";
import { check, checkTrans, sect, test } from "./util.js";

const checkParseSimpleRepr = checkTrans(x => simpleRepr(parseLambda(x)));
const checkParseRepr       = checkTrans(x => repr(parseLambda(x)));
const checkParseRichRepr   = checkTrans(x => richRepr(parseLambda(x)));
const checkRichRepr        = checkTrans(richRepr);

const checkParseInvalid = checkTrans(x => {
  try { return repr(parseLambda(x)); }
  catch (e) { return e.message; }
});

const checkFV   = checkTrans(x => [...freeVars(parseLambda(x))].join(''));
const checkComb = checkTrans(x => isCombinator(parseLambda(x)));

const checkSubs = (v,b) => checkTrans(x => repr(subs(v,b)(parseLambda(x))));

const checkLiteral = (x,y,b) => check(literalEq(parseLambda(x),parseLambda(y)),b);
const checkAlpha   = (x,y,b) => check(alphaEq(parseLambda(x),parseLambda(y)),b);

sect('lambda');

let trials;

test('reprs', () => {
  trials = [
    'x',                    'x',                          'x',                    'x',
    '(x)',                  'x',                          'x',                    'x',
    'λx.x',                 '(λx.x)',                     'λx.x',                 'I',
    'λx.xx',                '(λx.(xx))',                  'λx.xx',                'M',
    'I',                    '(λx.x)',                     'λx.x',                 'I',
    'M',                    '(λx.(xx))',                  'λx.xx',                'M',
    'K',                    '(λx.(λy.x))',                'λxy.x',                'K',
    'S',                    '(λx.(λy.(λz.((xz)(yz)))))',  'λxyz.xz(yz)',          'S',
    'Ω',                    '((λx.(xx))(λx.(xx)))',       '(λx.xx)(λx.xx)',       'Ω',
    'MI',                   '((λx.(xx))(λx.x))',          '(λx.xx)(λx.x)',        'MI',
    'IM',                   '((λx.x)(λx.(xx)))',          '(λx.x)(λx.xx)',        'IM',
    'IyM',                  '(((λx.x)y)(λx.(xx)))',       '(λx.x)y(λx.xx)',       'IyM',
    'xyz',                  '((xy)z)',                    'xyz',                  'xyz',
    '((λx.x)(λy.y))(λz.z)', '(((λx.x)(λy.y))(λz.z))',     '(λx.x)(λy.y)(λz.z)',   'III',
    '(λx.x)((λy.y)(λz.z))', '((λx.x)((λy.y)(λz.z)))',     '(λx.x)((λy.y)(λz.z))', 'I(II)',
  ];

  for (let i = 0; i < trials.length; i += 4) {
    checkParseSimpleRepr(trials[i], trials[i+1]);
    checkParseRepr(trials[i], trials[i+2]);
    checkParseRichRepr(trials[i], trials[i+3]);
  }
});

test('invalid parsing', () => {
  trials = [
    '-',            'Invalid character `-` at position 1',
    '&',            'Invalid character `&` at position 1',
    'abc%def',      'Invalid character `%` at position 4',
    '.',            'Unexpected character `.` at position 1',
    '(((((x)))))',  'x',
    '((x)))))',     'Unexpected character `)` at position 6',
    '(((((x))',     'Non-closed parenthesis',
    '',             'Unexpected end of input',
    '()',           'Unexpected character `)` at position 2',
    '(λ)',          'Unexpected character `)` at position 3',
    'λ',            'Unexpected end of input',
    'λλ',           'Unexpected character `λ` at position 2',
    'λxλ',          'Unexpected character `λ` at position 3',
    'xλ',           'Unexpected end of input',
    'xλx',          'Unexpected end of input',
    'xλx.x',        'x(λx.x)',
    'xx',           'xx',
    'x.',           'Unexpected character `.` at position 2',
    '.x',           'Unexpected character `.` at position 1',
    'λx..x',        'Unexpected character `.` at position 4',
  ];

  for (let i = 0; i < trials.length; i += 2) {
    checkParseInvalid(trials[i], trials[i+1]);
  }
});

test('free variables', () => {
  trials = [
    'x',    'x',  false,
    '(x)',  'x',  false,
    'λx.x', '',   true,
    'λx.xx','',   true,
    'I',    '',   true,
    'M',    '',   true,
    'K',    '',   true,
    'MI',   '',   true,
    'IM',   '',   true,
    'IyM',  'y',  false,
  ];

  for (let i = 0; i < trials.length; i += 3) {
    checkFV(trials[i], trials[i+1]);
    checkComb(trials[i], trials[i+2]);
  }
});

test('substitution', () => {
  trials = [
    'x',        'yz',
    '(x)',      'yz',
    'λx.x',     'λx.x',
    'λx.xx',    'λx.xx',
    'I',        'λx.x',
    'M',        'λx.xx',
    'K',        'λxy.x',
    'MI',       '(λx.xx)(λx.x)',
    'IM',       '(λx.x)(λx.xx)',
    'IyM',      '(λx.x)y(λx.xx)',
    'IxM',      '(λx.x)(yz)(λx.xx)',
    'y',        'y',
    'yx',       'y(yz)',
    'λy.x',     'λa.yz',
    'λy.z',     'λy.z',
    'λy.yx',    'λa.a(yz)',
    'λzy.yxz',  'λab.b(yz)a',
    'λy.yaxb',  'λc.ca(yz)b',
  ];

  for (let i = 0; i < trials.length; i += 2) {
    checkSubs('x',parseLambda('yz'))(trials[i], trials[i+1]);
  }
});

test('literal and alpha equality', () => {
  trials = [
    'x',            'x',            true,   true,
    'x',            'y',            false,  false,
    'λx.x',         'λy.y',         false,  true,
    'λx.y',         'λy.x',         false,  false,
    'λxy.xy',       'λyx.yx',       false,  true,
    'λxyz.zyx',     'λabc.cba',     false,  true,
    'xy',           'λx.y',         false,  false,
    'xy',           'yx',           false,  false,
    'x(λx.x)',      'x(λy.y)',      false,  true,
    'KI',           'KI',           true,   true,
    '(λx.x)(λy.y)', '(λy.y)(λz.z)', false,  true,
    'II',           '(λy.y)(λz.z)', false,  true,
  ];

  for (let i = 0; i < trials.length; i += 4) {
    checkLiteral(trials[i], trials[i+1], trials[i+2]);
    checkAlpha(trials[i], trials[i+1], trials[i+3]);
  }
});

test('common leftmost and infinite beta', () => {
  trials = [
    'x',    ['x'],
    'I',    ['I'],
    'My',   ['My', 'yy'],
    'IK',   ['IK', 'K'],
    'KI',   ['KI', 'λy.I'],
    'Ω',    ['Ω', 'Ω', 'Ω', 'Ω', 'Ω', 'Ω', 'Ω', 'Ω', 'Ω', 'Ω'],
    'Y',    ['Y',
             'λf.f((λx.f(xx))(λx.f(xx)))',
             'λf.f(f((λx.f(xx))(λx.f(xx))))',
             'λf.f(f(f((λx.f(xx))(λx.f(xx)))))',
             'λf.f(f(f(f((λx.f(xx))(λx.f(xx))))))',
             'λf.f(f(f(f(f((λx.f(xx))(λx.f(xx)))))))',
             'λf.f(f(f(f(f(f((λx.f(xx))(λx.f(xx))))))))',
             'λf.f(f(f(f(f(f(f((λx.f(xx))(λx.f(xx)))))))))',
             'λf.f(f(f(f(f(f(f(f((λx.f(xx))(λx.f(xx))))))))))',
             'λf.f(f(f(f(f(f(f(f(f((λx.f(xx))(λx.f(xx)))))))))))'],
  ];

  for (let i = 0; i < trials.length; i += 2) {
    let genL = Array.from(leftmost_seq(parseLambda(trials[i]),10));
    let genI = Array.from(infinite_seq(parseLambda(trials[i]),10));
    check(genL.length, trials[i+1].length);
    check(genI.length, trials[i+1].length);
    for (let j = 0; j < trials[i+1].length; j++) {
      checkRichRepr(genL[j],trials[i+1][j]);
      checkRichRepr(genI[j],trials[i+1][j]);
    }
  }
});

test('leftmost vs infinite beta', () => {
  trials = [
    'KIΩ',
    [
      'KIΩ',
      '(λy.I)Ω',
      'I'
    ], [
      'KIΩ',
      '(λy.I)Ω',
      '(λy.I)Ω',
      '(λy.I)Ω',
      '(λy.I)Ω',
      '(λy.I)Ω',
      '(λy.I)Ω',
      '(λy.I)Ω',
      '(λy.I)Ω',
      '(λy.I)Ω'
    ],
  ];

  for (let i = 0; i < trials.length; i += 3) {
    let genL = Array.from(leftmost_seq(parseLambda(trials[i]),10));
    let genI = Array.from(infinite_seq(parseLambda(trials[i]),10));
    check(genL.length, trials[i+1].length);
    check(genI.length, trials[i+2].length);
    for (let j = 0; j < trials[i+1].length; j++)
      checkRichRepr(genL[j],trials[i+1][j]);
    for (let j = 0; j < trials[i+2].length; j++)
      checkRichRepr(genI[j],trials[i+2][j]);
  }
});

test('arithmetic', () => {
  const x = vbl('x'), y = vbl('y');
  const [_0,_1,_2,_3,_4,_5,_6,_7,_8,_9] = [0,1,2,3,4,5,6,7,8,9].map(num);

  trials = [
    apps(ifthenelse,True, x,y), x,
    apps(ifthenelse,False,x,y), y,
    app(fst,apps(pair,x,y)),    x,
    app(snd,apps(pair,x,y)),    y,
    app(succ,_0),               _1,
    app(succ,_1),               _2,
    app(succ,_2),               _3,
    apps(add,_0,_0),            _0,
    apps(add,_1,_2),            _3,
    apps(add,_4,_5),            _9,
    apps(mul,_2,_3),            _6,
    apps(mul,_2,_3),            _6,
    apps(exp,_2,_3),            _8,
    apps(exp,_3,_2),            _9,
    apps(exp,_5,_0),            _1,
    apps(exp,_5,_1),            _5,
    apps(exp,_0,_5),            _0,
    apps(exp,_1,_5),            _1,
  ];

  for (let i = 0; i < trials.length; i += 2) {
    check(alphaEq(normal(trials[i]),trials[i+1]), true);
  }
});
