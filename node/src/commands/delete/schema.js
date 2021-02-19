const { checkConfig } = require('../../config');
const { deleteSchema } = require('../../sdk/schema');

exports.command = 'schema <schemaId>';
exports.describe = 'Delete CRM schema';

exports.handler = async (options) => {
  const { schemaId, purge } = options;

  if (!checkConfig()) {
    process.exit(1);
  }

  await deleteSchema({ schemaId, purge });
};

exports.builder = (yargs) => {
  yargs.positional('schemaId', {
    describe: 'CRM schema id for deletion',
    type: 'string',
  });

  yargs.option('purge', {
    alias: 'p',
    describe: 'Delete schema completely',
    type: 'boolean',
  });
  return yargs;
};
