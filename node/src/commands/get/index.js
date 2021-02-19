const schemaCommand = require('./schema');
const objectCommand = require('./object');

exports.command = 'get <schema|object>';
exports.describe = 'Get CRM schema or object instance';

exports.builder = (yargs) => {
  yargs.command(schemaCommand);
  yargs.command(objectCommand);
  return yargs;
};
