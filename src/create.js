const debug = require('debug')('tarjs:create');
const { create } = require('tar');

exports.create = async function(program) {
  if (!validateOptions(program)) {
    process.exit(1);
  }

  debug(`Creating tar archive ${program.file}`);
  debug(`Including files: ${JSON.stringify(program.args)}`);

  if (program.portable) {
    debug('Creating portable tar, not including system-specific metadata');
  }

  const result = await create({
    file: program.file,
    cwd: program.change,
    portable: program.portable
  }, program.args);

  process.stdout.write(`wrote ${program.file}\n`);
};

function validateOptions(program) {
  if (!program.file) {
    process.stderr.write('No output filename specified\n');
    return false;
  }

  return true;
}
