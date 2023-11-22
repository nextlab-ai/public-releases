import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { FlatCompat } from '@eslint/eslintrc';
import airbnbBase from 'eslint-config-airbnb-base';
import importPlugin from 'eslint-plugin-import';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

import { jsRules, tsRules } from './config/index.js';
// import airbnbRules from './config/airbnb-rules.cjs';

const { default: importConfig } = await import(airbnbBase.extends.find(x => x.endsWith('imports.js')));
importConfig.plugins = [];

const SYMBOL = Symbol('nextlab-eslint');
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat();

const config = [{
  // All eslint-plugin-import config is here
  languageOptions: {
    parserOptions: {
      // Eslint doesn't supply ecmaVersion in `parser.js` `context.parserOptions`
      // This is required to avoid ecmaVersion < 2015 error or 'import' / 'export' error
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    globals: {},
  },
  plugins: {
    import: importPlugin,
  },
  settings: {
    // https://github.com/import-js/eslint-plugin-import/issues/2556#issuecomment-1663038247
    'import/parsers': {
      espree: ['.js', '.cjs', '.mjs', '.jsx'],
    },
    'import/resolver': {
      exports: {
        require: false,
        browser: false,
        unsafe: false,
      },
    },
  },
},

...compat.extends(join(__dirname, '/config/importless-airbnb-base.cjs')),
...compat.config(importConfig),

{
  files: ['**/*.js'],
  languageOptions: {
    ecmaVersion: 'latest',
  },
  rules: jsRules,
},

{
  files: ['**/*.ts'],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      project: true,
    },
  },
  plugins: {
    '@typescript-eslint': tsPlugin,
    ts: tsPlugin,
  },
  rules: {
    ...tsPlugin.configs.base.rules,
    ...tsPlugin.configs['eslint-recommended'].rules,
    ...tsPlugin.configs['strict-type-checked'].rules,
    ...jsRules,
    ...tsRules,
  },
  settings: {
    'import/resolver': {
      typescript: true,
    },
  },
},
];

config[SYMBOL] = true;

function throwIfModuleFound(error) {
  if (error.code !== 'ERR_MODULE_NOT_FOUND')
    throw error;
}

async function mergeLocalConfig() {
  if (__dirname === process.cwd())
    return;
  const { default: localConfig } = await import(process.cwd() + '/eslint.config.js')
    .then(x => x, error => {
      throwIfModuleFound(error);
      return import(process.cwd() + '/eslint.config.mjs');
    })
    .catch(throwIfModuleFound) || {};
  if (!localConfig)
    return;
  if (localConfig[SYMBOL])
    return;

  console.log('localConfig', localConfig);
  config.push(...localConfig);
}

// console.log(config);
await mergeLocalConfig();

export default config;
