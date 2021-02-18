const _ = require('lodash');
const { checkConfig } = require('../../config');
const { logger } = require('../../helpers/logger');

const { getSchema, getAllSchemas } = require('../../sdk');

exports.command = ['schema [schemaId]', 'schemas [schemaId]'];
exports.describe = 'Get CRM schema';

exports.handler = async (options) => {
  const { all, schemaId } = options;

  if (!checkConfig()) {
    process.exit(1);
  }

  if (!all && !schemaId) {
    logger.error(
      'Please, specify schema id, or use --all flag for getting all schemas'
    );
    process.exit(1);
  }

  if (all) {
    const schemasResponse = await getAllSchemas();
    console.table(
      schemasResponse.map((item) =>
        _.pick(item, ['id', 'name', 'objectTypeId', 'fullyQualifiedName'])
      )
    );
  } else {
    await getSchema({ schemaId });
  }
};

exports.builder = (yargs) => {
  yargs.option('schemaId', {
    describe: 'Id of the schema',
    type: 'string',
  });

  yargs.option('all', {
    alias: 'a',
    describe: 'Get all schemas',
    type: 'boolean',
  });

  yargs.example([['$0 get schema -a', 'Get all schemas']]);
  return yargs;
};
