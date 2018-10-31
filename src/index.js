#! /usr/bin/env node

const program = require('commander');

const version = require('../package.json').version;

program
  .version(version)
  .arguments('[files]')
  .option('-c, --create', 'Create a tar archive')
  .option('-C, --change [dir]', 'Change into directory before archiving')
  .parse(process.argv);

console.log('create:', program.create);
console.log('args:', program.args);
console.log('change:', program.change);
