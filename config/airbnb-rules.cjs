// Committed for future use

const airbnbBase = require('eslint-config-airbnb-base');

module.exports = Object.assign(
  {},
  ...airbnbBase.extends.filter((x) => !x.endsWith('imports.js'))
    .map(require)
    .flatMap(({ rules }) => rules),
);
