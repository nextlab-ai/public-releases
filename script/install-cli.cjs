const { readFileSync, symlinkSync } = require('fs');
const { resolve, join } = require('path');

const { name, bin } = JSON.parse(readFileSync('package.json'));
symlinkSync(resolve(bin), join('/usr/local/bin', name));
