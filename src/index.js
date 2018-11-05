#! /usr/bin/env node

const program = require('commander');

const modes = require('./modes');
const version = require('../package.json').version;

program
  .version(version)
  .arguments('[files]')
  .description('Command-line utility for working with tar files.')
  .option('-c, --create', 'Create a tar archive')
  .option('-t, --list', 'List tar contents')
  .option('-x, --extract', 'Extract tar file')
  .option('-f, --file [file]', 'Name of the tar file to operate on')
  .option('-v, --verbose', 'Show verbose output')
  .option('-q, --quiet', 'Show minimal output')
  .option('--exclude [pattern]', 'Exclude files or directories that match the given pattern')
  .option('--no-mtime', 'Omit the modification time of all added entries')
  .option('--portable', 'Omit system-specific metadata from the output file (except modification time)')
  .option('-C, --change [dir]', 'Change into directory before archiving or extracting')
  .parse(process.argv);

main();

async function main() {
  const exitCode = await checkAndRunMode();
  process.exit(exitCode);
}

async function checkAndRunMode() {
  const selectedModes = Object.keys(modes).filter(mode => program[mode]);
  switch (selectedModes.length) {
    case 0:
      process.stderr.write('Must specify one of -c, -t, -x\n');
      return 1;
    case 1:
      return await modes[selectedModes[0]](program);
    default:
      process.stderr.write('Cannot specify multiple operations\n');
      return 1;
  }
}
