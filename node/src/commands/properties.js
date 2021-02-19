const _ = require('lodash');
const { checkConfig } = require('../config');

const { getProperties } = require('../sdk/schema');

exports.command = 'properties <schemaId>';
exports.describe = 'Get CRM schema properties';

exports.handler = async (options) => {
  if (!checkConfig()) {
    process.exit(1);
  }
  const { schemaId } = options;
  const res = await getProperties({ objectType: schemaId });
  console.table(
    res.map((item) => _.pick(item, ['name', 'label', 'type', 'groupName']))
  );
};

exports.builder = (yargs) => {
  yargs.positional('schemaId', {
    describe: 'CRM schema Id',
    type: 'string',
    coerce: (arg) => arg.toLowerCase(),
  });
  return yargs;
};
