const schemaCommand = require('./schema');
const objectCommand = require('./object');

exports.command = 'update <schema|object>';
exports.describe = 'Update CRM schema or object instance';

exports.builder = (yargs) => {
  yargs.command(schemaCommand);
  yargs.command(objectCommand);
  return yargs;
};
