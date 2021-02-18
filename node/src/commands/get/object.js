const { checkConfig } = require('../../config');
const { logger } = require('../../helpers/logger');

const { getAllObjects, getObject } = require('../../sdk');

exports.command = ['object <schemaId> [objectId]', 'objects <schemaId> [objectId]'];
exports.describe = 'Get CRM object instance';

exports.handler = async (options) => {
  const { objectId, all, schemaId, query, properties } = options;

  if (!checkConfig()) {
    process.exit(1);
  }

  if (!all && !objectId) {
    logger.error(
      'Please, specify object id, or use --all flag for getting all objects'
    );
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
    await getObject({ objectType: schemaId, objectId });
  }
};

exports.builder = (yargs) => {
  yargs.positional('schemaId', {
    describe: 'Schema Id for getting object instance',
    type: 'string',
  });

  yargs.option('objectId', {
    describe: 'Id of object instance',
    type: 'string',
  });

  yargs.option('all', {
    alias: 'a',
    describe: 'Get all object instances',
    type: 'boolean',
  });

  yargs.option('query', {
    alias: 'q',
    describe: 'Searching filter for getting list of object instances',
    type: 'string',
  });

  yargs.option('properties', {
    alias: 'p',
    describe: 'Properties of object instance to retrieve',
    type: 'string',
  });

  yargs.example([
    [
      '$0 get object *schemaId* --objectId=*objectId*',
      'Get object by its schema id and object id',
    ],
    [
      '$0 get object *schemaId* -a -p=property1,property2',
      'Get all objects of *schemaId* type, retrieve property1 and property2 properties',
    ],
  ]);
  return yargs;
};
