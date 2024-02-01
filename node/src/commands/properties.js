const _ = require('lodash');
const { checkConfig } = require('../config');

const { getProperties } = require('../sdk/schema');

exports.command = 'properties <schemaId> [-u] [-h]';
exports.describe = 'Get CRM schema properties';

exports.handler = async (options) => {
  if (!checkConfig()) {
    process.exit(1);
  }
  const { schemaId, userDefined, hubspotDefined } = options;
  const responce = await getProperties({ objectType: schemaId });
  let propertiesList = responce;
  if (userDefined) {
    propertiesList = responce.filter((property) => {
      if (property?.hubspotDefined != true) {
        return property;
      }
    });
  } else if (hubspotDefined) {
    propertiesList = responce.filter((property) => {
      if (property?.hubspotDefined == true) {
        return property;
      }
    });
  }
  console.table(
    propertiesList.map((item) =>
      _.pick(item, ['name', 'label', 'type', 'groupName', 'hubspotDefined'])
    )
  );
};

exports.builder = (yargs) => {
  yargs.positional('schemaId', {
    describe: 'CRM schema Id',
    type: 'string',
    coerce: (arg) => arg.toLowerCase(),
  });

  yargs.option('userDefined', {
    alias: 'u',
    describe: 'View user defined properties',
  });

  yargs.option('hubspotDefined', {
    alias: 'h',
    describe: 'View HubSpot defined properties',
  });

  return yargs;
};
