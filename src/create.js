const { bold } = require('chalk');
const debug = require('debug')('tarjs:create');
const filesize = require('filesize');
const ora = require('ora');
const { create } = require('tar');

const spinner = ora();

exports.create = async function(program) {
  if (!validateOptions(program)) {
    process.exit(1);
  }

  debug(`Creating tar archive ${program.file}`);
  debug(`Including files: ${JSON.stringify(program.args)}`);

  if (program.portable) {
    debug('Creating portable tar, not including system-specific metadata');
  }

  if (!program.verbose) {
    spinner.start();
    spinner.text = `Creating archive: ${bold(program.file)}`;
  }

  const start = Date.now();

  try {
    await create(
      {
        file: program.file,
        cwd: program.change,
        portable: program.portable,
        filter: program.verbose ? logEntry : () => true
      },
      program.args
    );
  } catch (err) {
    spinner.stop();
    process.stderr.write(`An unexpected error occured while writing ${program.file}:\n`);
    process.stderr.write(`    ${err.message}\n`);
    process.exit(1);
  }

  const end = Date.now();
  spinner.stop();
  process.stdout.write(`Wrote ${bold(program.file)} in ${(end - start) / 1000} sec.\n`);
};

function logEntry(path, stat) {
  process.stdout.write(`adding ${bold(path)} (${filesize(stat.size)})\n`);
  return true;
}

function validateOptions(program) {
  if (!program.file) {
    process.stderr.write('No output filename specified\n');
    return false;
  }

  if (!program.args.length) {
    process.stderr.write('No input files or directories specified\n');
    return false;
  }

  return true;
}
