const { cleanupDefaultArgs } = require('../../helpers/common');
const { checkConfig } = require('../../config');

const { createObject } = require('../../sdk');

exports.command = 'object <schemaId>';
exports.describe = 'Create CRM object instance from schema';

exports.handler = async (options) => {
  const { schemaId, ...properties } = options;

  if (!checkConfig()) {
    process.exit(1);
  }

  await createObject({
    objectType: schemaId,
    properties: cleanupDefaultArgs(properties),
  });
};

exports.builder = (yargs) => {
  yargs.positional('schemaId', {
    describe: 'Schema Id for creating object instance',
    type: 'string',
  });

  yargs.example([
    [
      '$0 create object *schemaId* --property1=value2 --property2=value2',
      'Create object instance with schema id and given properties',
    ],
  ]);
  return yargs;
};
