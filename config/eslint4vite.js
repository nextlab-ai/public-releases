import { fileURLToPath } from 'url';
import { resolve } from 'path';

import eslint from 'eslint/use-at-your-own-risk';

const overrideConfigFile = resolve(fileURLToPath(import.meta.url), '../..', 'eslint.config.js');

// eslint-disable-next-line import/prefer-default-export
export class ESLint extends eslint.FlatESLint {
  constructor(params) {
    Object.assign(params, { overrideConfigFile });
    super(params);
  }
}
