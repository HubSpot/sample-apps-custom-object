const schemaCommand = require('./schema');
const objectCommand = require('./object');

exports.command = 'delete <schema|object>';
exports.describe = 'Delete CRM schema or object instance';

exports.builder = (yargs) => {
  yargs.command(schemaCommand);
  yargs.command(objectCommand);
  return yargs;
};
