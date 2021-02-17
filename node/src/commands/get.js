const _ = require('lodash');
const pluralize = require('pluralize');
const { AVAILABLE_TYPES } = require('../helpers/constants');
const { checkConfig } = require('../config');
const { logger } = require('../helpers/logger');

const {
  getSchema,
  getAllSchemas,
  getAllObjects,
  getObject,
} = require('../sdk');

exports.command = 'get <type> [id]';
exports.describe = 'Get CRM schema or object instance';

exports.handler = async (options) => {
  const { type, id, all, schemaId, query, properties } = options;

  if (!all && !id) {
    logger.error(
      'Please, specify Id, or use --all flag for getting all schemas/objects'
    );
    process.exit(1);
  }

  if (!checkConfig()) {
    process.exit(1);
  }

  if ([type, pluralize.singular(type)].includes(AVAILABLE_TYPES.schema)) {
    if (all) {
      const schemasResponse = await getAllSchemas();
      console.table(
        schemasResponse.map((item) =>
          _.pick(item, ['id', 'name', 'objectTypeId', 'fullyQualifiedName'])
        )
      );
    } else {
      await getSchema({ schemaId: id });
    }
  } else {
    if (!schemaId) {
      logger.error('Please, specify schema Id for getting object instance');
      process.exit(1);
    }
    if (all) {
      const objectsResponse = await getAllObjects({
        objectType: schemaId,
        query,
        properties: properties ? properties.split(',') : properties,
      });
      logger.log(objectsResponse);
    } else {
      await getObject({ objectType: schemaId, objectId: id });
    }
  }
};

exports.builder = (yargs) => {
  yargs.positional('type', {
    describe: 'type',
    type: 'string',
    choices: [
      ...Object.values(AVAILABLE_TYPES).map((type) => pluralize(type)),
      ...Object.values(AVAILABLE_TYPES),
    ],
    coerce: (arg) => arg.toLowerCase(),
  });

  yargs.option('id', {
    describe: 'Id of the schema or object instance',
    type: 'string',
  });

  yargs.option('schemaId', {
    describe: 'Schema Id for getting object instance',
    type: 'string',
  });

  yargs.option('all', {
    alias: 'a',
    describe: 'Get all schemas or object instances',
    type: 'boolean',
  });

  yargs.option('query', {
    alias: 'q',
    describe: 'searching filter for getting list of objects',
    type: 'string',
  });

  yargs.option('properties', {
    alias: 'p',
    describe: 'Properties of object instance to retrieve',
    type: 'string',
  });

  yargs.example([
    ['$0 get schema -a', 'Get all schemas'],
    [
      '$0 get object --schemaId=*schemaId* --id=*objectId*',
      'Get object by its schema id and object id',
    ],
    [
      '$0 get object --schemaId=*schemaId* -a -p=property1,property2',
      'Get all objects of *schemaId* type, retrieve property1 and property2 properties',
    ],
  ]);
  return yargs;
};
