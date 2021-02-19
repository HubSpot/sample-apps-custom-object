const { checkConfig } = require('../../config');

const { archiveObject } = require('../../sdk/object');

exports.command = 'object <schemaId> <objectId>';
exports.describe = 'Delete CRM object instance';

exports.handler = async (options) => {
  const { objectId, schemaId } = options;

  if (!checkConfig()) {
    process.exit(1);
  }

  await archiveObject({
    objectType: schemaId,
    objectId: objectId,
  });
};

exports.builder = (yargs) => {
  yargs.positional('schemaId', {
    describe: 'Schema Id for deleting object instance',
    type: 'string',
  });

  yargs.positional('objectId', {
    describe: 'Object Id for deleting object instance',
    type: 'string',
  });

  return yargs;
};
