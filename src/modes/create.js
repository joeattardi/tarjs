const { existsSync, statSync } = require('fs');
const { resolve } = require('path');

const { bold } = require('chalk');
const debug = require('debug')('tarjs:create');
const filesize = require('filesize');
const ora = require('ora');
const { create } = require('tar');

const spinner = ora();

exports.create = async function(program) {
  if (!validateOptions(program)) {
    return 1;
  }

  debug(`Creating tar archive ${program.file}`);
  debug(`Including files: ${JSON.stringify(program.args)}`);

  let filterRegexp;
  try {
    filterRegexp = new RegExp(program.exclude);
  } catch (err) {
    process.stderr.write(`Invalid pattern specified for --exclude: ${bold(program.exclude)}\n`);
    return 1;
  }

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
        filter: (path, stat) => filter(path, stat, program, filterRegexp)
      },
      program.args
    );
  } catch (err) {
    spinner.stop();
    process.stderr.write(`An unexpected error occured while writing ${bold(program.file)}:\n`);
    process.stderr.write(`    ${err.message}\n`);
    return 1;
  }

  const end = Date.now();
  spinner.stop();

  if (!program.quiet) {
    const stats = statSync(program.file);
    process.stdout.write(`Wrote ${bold(program.file)} (${filesize(stats.size)}) in ${(end - start) / 1000} sec.\n`);
  }
};

function filter(path, stat, program, filterRegexp) {
  if (resolve(path) === resolve(program.file)) {
    if (!program.quiet) {
      process.stderr.write(`${bold(path)}: Can't add archive to itself\n`);
    }

    return false;
  }

  if (filterRegexp && !filterRegexp.test(path)) {
    if (program.verbose) {
      logEntry(path, stat);
    }

    return true;
  } else {
    return false;
  }
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

  const missingFiles = getMissingFiles(program.args);
  if (missingFiles.length) {
    missingFiles.forEach(file => {
      process.stderr.write(`${bold(file)}: No such file or directory\n`);
    });
    return false;
  }

  return true;
}

function getMissingFiles(files) {
  return files.filter(file => !existsSync(file));
}
