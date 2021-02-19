const { UPDATE_SCHEMA_ARRAY_PROPERTIES } = require('../../helpers/constants');
const { cleanupDefaultArgs } = require('../../helpers/common');
const { checkConfig } = require('../../config');
const { updateSchema } = require('../../sdk/schema');

exports.command = 'schema <schemaId> [properties]';
exports.describe = 'Update CRM schema';

exports.handler = async (options) => {
  const { type, schemaId, ...properties } = options;

  if (!checkConfig()) {
    process.exit(1);
  }

  UPDATE_SCHEMA_ARRAY_PROPERTIES.forEach((property) => {
    if (properties[property]) {
      properties[property] = properties[property].split(',');
    }
  });
  await updateSchema({
    schemaId,
    properties: cleanupDefaultArgs(properties),
  });
};

exports.builder = (yargs) => {
  yargs.positional('schemaId', {
    describe: 'CRM schema id',
    type: 'string',
  });

  yargs.example([
    [
      "$0 update schema *schemaId* --primaryDisplayProperty='property_1' --label.singular='New singular label'",
      'Update schema simple properties',
    ],
    [
      "$0 update schema *schemaId* --requiredProperties='property_1,property_2'",
      'Update schema array properties, comma separated values',
    ],
  ]);
  return yargs;
};
