import { firstLetter, getErrorMessage } from './utils.js';

type Production =
  | 'S'
  | 'Z'
  | 'W'
  | 'W`'
  | 'P'
  | 'R'
  | 'R`'
  | 'L'
  | 'L`'
  | 'C'
  | 'O';

type ProductionFollow = 'Z' | 'W`' | 'R`' | 'L`';

const first = (prod: Production): (null | string)[] => {
  switch (prod) {
    case 'S':
      return Array.from('(0123456789');
    case 'Z':
      return [...Array.from('(0123456789'), null];
    case 'W':
      return Array.from('(0123456789');
    case 'W`':
      return [...Array.from('*:+-^'), null];
    case 'P':
      return Array.from('(0123456789');
    case 'R':
      return Array.from('0123456789');
    case 'R`':
      return ['.', null];
    case 'L':
      return Array.from('0123456789');
    case 'L`':
      return [...Array.from('0123456789'), null];
    case 'C':
      return Array.from('0123456789');
    case 'O':
      return Array.from('*:+-^');
  }
};

const follow = (prod: ProductionFollow): (null | string)[] => {
  switch (prod) {
    case 'Z':
      return [];
    case 'W`':
      return Array.from(';,)');
    case 'R`':
      return [...Array.from(';)*:+-^'), null];
    case 'L`':
      return [...Array.from(';)*:+-^'), null];
  }
};

/*
I want to implement this grammar in TypeScript:

S ::= W;Z
Z ::= W;Z|ε
W ::= PW’
W’::= OW|ε
P ::= R|(W)
R ::= LR’
R’::= .L|ε
L ::= CL’
L’::= L|ε
C ::= 0|1|2|3|4|5|6|7|8|9
O ::= *|:|+|-|ˆ


*/

export function s(x: string) {
  const [firstChar] = firstLetter(x);

  if (!first('W').includes(firstChar)) {
    throw new Error(`Expected ${first('W').join(', ')}, but got ${firstChar}`);
  }

  const restAfterW = w(x);

  if (!restAfterW.startsWith(';')) {
    throw new Error(`Expected ;, but got ${restAfterW.charAt(0)}`);
  }

  const restAfterSemicolon = restAfterW.slice(1);

  const restAfterZ = z(restAfterSemicolon);

  return restAfterZ;
}

function z(x: string) {
  const [firstChar, rest] = firstLetter(x);

  if (!first('Z').includes(firstChar) || !follow('Z').includes(firstChar)) {
    throw new Error(getErrorMessage(firstChar, ...first('Z'), ...follow('Z')));
  }

  if (
    firstChar === null ||
    (!first('Z').includes(firstChar) && follow('Z').includes(firstChar))
  ) {
    return rest;
  }

  const restAfterW = w(x);

  if (!restAfterW.startsWith(';')) {
    throw new Error(getErrorMessage(restAfterW.charAt(0), ';'));
  }

  const restAfterSemicolon = restAfterW.slice(1);

  const restAfterZ = z(restAfterSemicolon);

  return restAfterZ;
}

function w(x: string) {
  const [firstChar] = firstLetter(x);

  if (!first('W').includes(firstChar)) {
    throw new Error(getErrorMessage(firstChar, ...first('W')));
  }

  const restAfterP = p(x);

  const restAfterWPrime = wPrime(restAfterP);

  return restAfterWPrime;
}

function wPrime(x: string) {
  const [firstChar, rest] = firstLetter(x);

  if (!first('W`').includes(firstChar) || !follow('W`').includes(firstChar)) {
    throw new Error(
      getErrorMessage(firstChar, ...first('W`'), ...follow('W`')),
    );
  }

  if (
    firstChar === null ||
    (!first('W`').includes(firstChar) && follow('W`').includes(firstChar))
  ) {
    return rest;
  }

  const restAfterO = o(x);

  const restAfterW = w(restAfterO);

  return restAfterW;
}

function p(x: string) {
  const [firstChar] = firstLetter(x);

  if (!first('P').includes(firstChar)) {
    throw new Error(getErrorMessage(firstChar, ...first('P')));
  }

  if (firstChar === '(') {
    const restAfterW = w(x.slice(1));

    if (!restAfterW.startsWith(')')) {
      throw new Error(getErrorMessage(restAfterW.charAt(0), ')'));
    }

    return restAfterW.slice(1);
  }

  return r(x);
}

function r(x: string) {
  const [firstChar] = firstLetter(x);

  if (!first('R').includes(firstChar)) {
    throw new Error(getErrorMessage(firstChar, ...first('R')));
  }

  const restAfterL = l(x);
  const restAfterRPrime = rPrime(restAfterL);

  return restAfterRPrime;
}

function rPrime(x: string) {
  const [firstChar] = firstLetter(x);

  if (!first('R`').includes(firstChar) || !follow('R`').includes(firstChar)) {
    throw new Error(
      getErrorMessage(firstChar, ...first('R`'), ...follow('R`')),
    );
  }

  if (
    firstChar === null ||
    (!first('R`').includes(firstChar) && follow('R`').includes(firstChar))
  ) {
    return x;
  }

  if (!x.startsWith('.')) {
    throw new Error(getErrorMessage(firstChar, '.'));
  }

  const restAfterL = l(x.slice(1));

  return restAfterL;
}

function l(x: string) {
  const [firstChar] = firstLetter(x);

  if (!first('L').includes(firstChar)) {
    throw new Error(getErrorMessage(firstChar, ...first('L')));
  }

  const restAfterC = c(x);

  const restAfterLPrime = lPrime(restAfterC);

  return restAfterLPrime;
}

function lPrime(x: string) {
  const [firstChar] = firstLetter(x);

  if (!first('L`').includes(firstChar) || !follow('L`').includes(firstChar)) {
    throw new Error(
      getErrorMessage(firstChar, ...first('L`'), ...follow('L`')),
    );
  }

  if (
    firstChar === null ||
    (!first('L`').includes(firstChar) && follow('L`').includes(firstChar))
  ) {
    return x;
  }

  const restAfterL = l(x);

  return restAfterL;
}

function c(x: string) {
  const [firstChar] = firstLetter(x);

  if (!first('C').includes(firstChar)) {
    throw new Error(getErrorMessage(firstChar, ...first('C')));
  }

  return x.slice(1);
}

function o(x: string) {
  const [firstChar] = firstLetter(x);

  if (!first('O').includes(firstChar)) {
    throw new Error(getErrorMessage(firstChar, ...first('O')));
  }

  return x.slice(1);
}
