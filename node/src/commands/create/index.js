const schemaCommand = require('./schema');
const objectCommand = require('./object');

exports.command = 'create <schema|object>';
exports.describe = 'Create CRM schema or object instance';

exports.builder = (yargs) => {
  yargs.command(schemaCommand);
  yargs.command(objectCommand);
  return yargs;
};
