#! /usr/bin/env node

const program = require('commander');

const { create } = require('./create');
const version = require('../package.json').version;

program
  .version(version)
  .arguments('[files]')
  .option('-c, --create', 'Create a tar archive')
  .option('-v, --verbose', 'Show verbose output')
  .option('--portable', 'Omit system-specific metadata from the output file')
  .option('-f, --file [file]', 'Output filename')
  .option('-C, --change [dir]', 'Change into directory before archiving')
  .parse(process.argv);

if (program.create) {
  create(program);
}
