const { bold } = require('chalk');
const debug = require('debug')('tarjs:extract');
const filesize = require('filesize');
const ora = require('ora');
const { extract } = require('tar');

const { checkReadFile } = require('../utils');

const spinner = ora();

exports.extract = async function(program) {
  if (!validateOptions(program)) {
    return 1;
  }

  debug(`Extracting tar archive: ${program.file}`);

  if (!program.verbose && !program.quiet) {
    spinner.start();
    spinner.text = `Extracting archive: ${bold(program.file)}`;
  }

  const start = Date.now();

  try {
    await extract({
      file: program.file,
      cwd: program.change,
      onentry: entry => printEntry(entry, program),
      onwarn: printWarning
    });
  } catch (err) {
    spinner.stop();
    process.stderr.write(`An unexpected error occurred while reading ${bold(program.file)}:\n`);
    process.stderr.write(`${err.message}\n`);
    return 1;
  }

  const end = Date.now();
  spinner.stop();

  if (!program.quiet) {
    process.stdout.write(`Extracted ${bold(program.file)} in ${(end - start) / 1000} sec.\n`);
  }
};

function validateOptions(program) {
  if (!program.file || typeof program.file !== 'string') {
    process.stderr.write('No input filename specified\n');
    return false;
  }

  return checkReadFile(program.file);
}

function printEntry(entry, program) {
  if (program.verbose) {
    process.stdout.write(`extracting ${bold(entry.path)} (${filesize(entry.size)})\n`);
  }
}

function printWarning(message) {
  process.stdout.write(`warning: ${message}\n`);
}
