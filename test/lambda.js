import { freeVars } from "../math/lambda/freeVars.js";
import { parseLambda } from "../math/lambda/parse.js";
import { repr, simpleRepr } from "../math/lambda/repr.js";
import { subs } from "../math/lambda/subs.js";
import { checkTrans, sect, test } from "./util.js";

const checkParseSimpleRepr = checkTrans(x => simpleRepr(parseLambda(x)));
const checkParseRepr       = checkTrans(x => repr(parseLambda(x)));

const checkParseInvalid = checkTrans(x => {
  try { return repr(parseLambda(x)); }
  catch (e) { return e.message; }
});

const checkParseFV = checkTrans(x => [...freeVars(parseLambda(x))].join(''));

const checkSubs = (v,b) => checkTrans(x => repr(subs(v,b)(parseLambda(x))));

sect('lambda');

let trials;

test('repr and simpleRepr', () => {
  trials = [
    'x',                    'x',                      'x',
    '(x)',                  'x',                      'x',
    'λx.x',                 '(λx.x)',                 'λx.x',
    'λx.xx',                '(λx.(xx))',              'λx.xx',
    'I',                    '(λx.x)',                 'λx.x',
    'M',                    '(λx.(xx))',              'λx.xx',
    'K',                    '(λx.(λy.x))',            'λxy.x',
    'MI',                   '((λx.(xx))(λx.x))',      '(λx.xx)(λx.x)',
    'IM',                   '((λx.x)(λx.(xx)))',      '(λx.x)(λx.xx)',
    'IyM',                  '(((λx.x)y)(λx.(xx)))',   '(λx.x)y(λx.xx)',
    'xyz',                  '((xy)z)',                'xyz',
    '((λx.x)(λy.y))(λz.z)', '(((λx.x)(λy.y))(λz.z))', '(λx.x)(λy.y)(λz.z)',
    '(λx.x)((λy.y)(λz.z))', '((λx.x)((λy.y)(λz.z)))', '(λx.x)((λy.y)(λz.z))',
  ];

  for (let i = 0; i < trials.length; i += 3) {
    checkParseSimpleRepr(trials[i], trials[i+1]);
    checkParseRepr(trials[i], trials[i+2]);
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
    'x',    'x',
    '(x)',  'x',
    'λx.x', '',
    'λx.xx','',
    'I',    '',
    'M',    '',
    'K',    '',
    'MI',   '',
    'IM',   '',
    'IyM',  'y',
  ];

  for (let i = 0; i < trials.length; i += 2) {
    checkParseFV(trials[i], trials[i+1]);
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
