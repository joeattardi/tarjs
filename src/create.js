const { statSync } = require('fs');

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

  if (!program.verbose && !program.quiet) {
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
        noMtime: !program.mtime,
        filter: (path, stat) => filter(path, stat, program)
      },
      program.args
    );
  } catch (err) {
    spinner.stop();
    process.stderr.write(`An unexpected error occured while writing ${bold(program.file)}:\n`);
    process.stderr.write(`    ${err.message}\n`);
    process.exit(1);
  }

  const end = Date.now();
  spinner.stop();

  if (!program.quiet) {
    const stats = statSync(program.file);
    process.stdout.write(`Wrote ${bold(program.file)} (${filesize(stats.size)}) in ${(end - start) / 1000} sec.\n`);
  }
};

function filter(path, stat, program) {
  if (program.verbose) {
    logEntry(path, stat);
  }

  return true;
}

function logEntry(path, stat) {
  process.stdout.write(`adding ${bold(path)} (${filesize(stat.size)})\n`);
  return true;
}

function validateOptions(program) {
  if (!program.file || typeof program.file !== 'string') {
    process.stderr.write('No output filename specified\n');
    return false;
  }

  if (!program.args.length) {
    process.stderr.write('No input files or directories specified\n');
    return false;
  }

  return true;
}
