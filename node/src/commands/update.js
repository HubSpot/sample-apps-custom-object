const {
  AVAILABLE_TYPES,
  UPDATE_SCHEMA_ARRAY_PROPERTIES,
} = require('../helpers/constants');
const { cleanupDefaultArgs } = require('../helpers/common');
const { logger } = require('../helpers/logger');
const { checkConfig } = require('../config');
const { updateObject, updateSchema } = require('../sdk');

exports.command = 'update <type> <id> [properties]';
exports.describe = 'Update CRM schema or object instance';

exports.handler = async (options) => {
  const { type, id, schemaId, ...properties } = options;

  if (!checkConfig()) {
    process.exit(1);
  }

  if (type === AVAILABLE_TYPES.schema) {
    UPDATE_SCHEMA_ARRAY_PROPERTIES.forEach((property) => {
      if (properties[property]) {
        properties[property] = properties[property].split(',');
      }
    });
    await updateSchema({
      schemaId: id,
      properties: cleanupDefaultArgs(properties),
    });
  } else {
    if (!schemaId) {
      logger.error('Please, specify schemaId for deleting object instance');
      process.exit(1);
    }
    await updateObject({
      objectType: schemaId,
      objectId: id,
      properties: cleanupDefaultArgs(properties),
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
    describe: 'Schema Id for updating object instance',
    type: 'string',
  });

  yargs.example([
    [
      "$0 update schema *id* --primaryDisplayProperty='property_1' --label.singular='New singular label'",
      'Update schema simple properties',
    ],
    [
      "$0 update schema *id* --requiredProperties='property_1,property_2'",
      'Update schema array properties, comma separated values',
    ],
    [
      '$0 update object *id* --schemaId=*schemaId* --property1=new_property_value',
      'Update object instance',
    ],
  ]);
  return yargs;
};
