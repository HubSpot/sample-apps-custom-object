const { cleanupDefaultArgs } = require('../../helpers/common');
const { checkConfig } = require('../../config');
const { updateObject } = require('../../sdk/object');

exports.command = 'object <schemaId> <objectId> [properties]';
exports.describe = 'Update CRM object instance';

exports.handler = async (options) => {
  const { type, objectId, schemaId, ...properties } = options;

  if (!checkConfig()) {
    process.exit(1);
  }

  await updateObject({
    objectType: schemaId,
    objectId,
    properties: cleanupDefaultArgs(properties),
  });
};

exports.builder = (yargs) => {
  yargs.positional('schemaId', {
    describe: 'Schema Id for updating object instance',
    type: 'string',
  });

  yargs.positional('objectId', {
    describe: 'CRM object id',
    type: 'string',
  });

  yargs.example([
    [
      '$0 update object *schemaId* *objectId* --property1=new_property_value',
      'Update object instance',
    ],
  ]);
  return yargs;
};
