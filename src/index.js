#! /usr/bin/env node

const program = require('commander');

const { create } = require('./create');
const { list } = require('./list');
const version = require('../package.json').version;

program
  .version(version)
  .arguments('[files]')
  .option('-c, --create', 'Create a tar archive')
  .option('-t, --list', 'List tar contents')
  .option('-v, --verbose', 'Show verbose output')
  .option('--portable', 'Omit system-specific metadata from the output file')
  .option('-f, --file [file]', 'Output filename')
  .option('-C, --change [dir]', 'Change into directory before archiving')
  .parse(process.argv);

if (!checkCombinations()) {
  process.exit(1);
}

if (program.create) {
  create(program);
} else if (program.list) {
  list(program);
}

function checkCombinations() {
  if (program.list && program.create) {
    process.stdout.write("Can't specify both -c and -t options\n");
    return false;
  }

  return true;
}
