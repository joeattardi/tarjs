const { bold } = require('chalk');
const debug = require('debug')('tarjs:list');
const filesize = require('filesize');
const { list } = require('tar');

exports.list = async function(program) {
  if (!validateOptions(program)) {
    process.exit(1);
  }

  debug(`Listing contents of tar archive: ${program.file}`);

  try {
    await list({
      file: program.file,
      onentry: entry => printEntry(entry, program)
    });
  } catch (err) {
    process.stderr.write(`An unexpected error occurred while writing ${bold(program.file)}:\n`);
    process.stderr.write(`    ${err.message}\n`);
  }
};

function validateOptions(program) {
  if (!program.file || typeof program.file !== 'string') {
    process.stderr.write('No input filename specified\n');
    return false;
  }

  return true;
}

function printEntry(entry, program) {
  if (program.quiet) {
    process.stdout.write(`${entry.path}\n`);
  } else {
    process.stdout.write(`${bold(entry.path)} (${filesize(entry.size)})\n`);
  }
}
