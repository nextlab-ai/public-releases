// Test TS import and parsing
import util from 'util';

import '@eslint/eslintrc';

import './blank';

console.log(util);

const num = 0 as const;
console.log(num);
