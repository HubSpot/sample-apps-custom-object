const { AVAILABLE_TYPES } = require('../helpers/constants');
const { checkConfig } = require('../config');
const { logger } = require('../helpers/logger');

const { archiveObject, deleteSchema } = require('../sdk');

exports.command = 'delete <type> <id>';
exports.describe = 'Delete CRM schema or object instance';

exports.handler = async (options) => {
  const { type, id, schemaId, purge } = options;

  if (!checkConfig()) {
    process.exit(1);
  }

  if (type === AVAILABLE_TYPES.schema) {
    await deleteSchema({ schemaId: id, purge });
  } else {
    if (!schemaId) {
      logger.error('Please, specify schemaId for deleting object instance');
      process.exit(1);
    }
    await archiveObject({
      objectType: schemaId,
      objectId: id,
    });
  }
};

exports.builder = (yargs) => {
  yargs.positional('type', {
    describe: 'CRM type',
    type: 'string',
    choices: Object.keys(AVAILABLE_TYPES),
    coerce: (arg) => arg.toLowerCase(),
  });

  yargs.positional('id', {
    describe: 'CRM schema or object id',
    type: 'string',
  });

  yargs.option('schemaId', {
    describe: 'Schema Id for deleting object instance',
    type: 'string',
  });

  yargs.option('purge', {
    alias: 'p',
    describe: 'Delete schema completely',
    type: 'boolean',
  });
  return yargs;
};
