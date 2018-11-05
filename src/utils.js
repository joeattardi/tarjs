const fs = require('fs');

const { bold } = require('chalk');
const debug = require('debug')('tarjs:util');

exports.checkReadFile = function(filename) {
  debug(`Checking access to file ${filename}`);

  try {
    fs.accessSync(filename, fs.constants.R_OK);
    return true;
  } catch (err) {
    debug(`Error accessing file, error code ${err.code}`);
    if (err.code === 'ENOENT') {
      process.stderr.write(`Input file ${bold(filename)} not found\n`);
    } else if (err.code === 'EACCES') {
      process.stderr.write(`Failed to open input file ${bold(filename)}: permission denied\n`);
    } else {
      process.stderr.write(`Failed to open input file ${bold(filename)}: ${err.message}\n`);
    }
    return false;
  }
};
