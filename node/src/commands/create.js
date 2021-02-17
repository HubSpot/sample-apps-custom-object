const _ = require('lodash');
const pluralize = require('pluralize');
const {
  schemaPropertiesPrompt,
  SCHEMA_PARAMETERS_PROMPT,
  promptUser,
} = require('../helpers/prompts');
const { AVAILABLE_TYPES } = require('../helpers/constants');
const { cleanupDefaultArgs } = require('../helpers/common');
const { logger } = require('../helpers/logger');
const { checkConfig } = require('../config');

const { createSchema, createObject } = require('../sdk');

exports.command = 'create <type> [name]';
exports.describe = 'Create CRM schema or object instance';

exports.handler = async (options) => {
  const { type, schemaId, ...properties } = options;
  let { name } = options;

  if (!checkConfig()) {
    process.exit(1);
  }

  if (type === AVAILABLE_TYPES.schema) {
    if (!name) {
      ({ name } = await promptUser(SCHEMA_PARAMETERS_PROMPT));
    }
    const label = _.capitalize(name);
    const { properties } = await schemaPropertiesPrompt();
    const requiredProperties = properties
      .filter((property) => property.required)
      .map((property) => property.name);
    const schema = {
      name,
      labels: {
        singular: label,
        plural: pluralize(label),
      },
      requiredProperties,
      primaryDisplayProperty: _.get(properties, '[0].name'),
      properties: properties.map((property) => _.omit(property, ['required'])),
    };

    logger.log(
      `Built the following schema to send for creation: ${JSON.stringify(
        schema,
        null,
        2
      )}`
    );

    await createSchema(schema);
  } else {
    if (!schemaId) {
      logger.error('Please, specify schemaId for creating object instance');
      process.exit(1);
    }

    await createObject({
      objectType: schemaId,
      properties: cleanupDefaultArgs(properties),
    });
  }
};

exports.builder = (yargs) => {
  yargs.positional('type', {
    describe: 'Creation type',
    type: 'string',
    choices: Object.values(AVAILABLE_TYPES),
    coerce: (arg) => arg.toLowerCase(),
  });

  yargs.option('name', {
    alias: 'n',
    describe: 'name of the schema',
    type: 'string',
  });

  yargs.option('schemaId', {
    describe: 'Schema Id for creating object instance',
    type: 'string',
  });

  yargs.example([
    ['$0 create schema -n=car', 'Create schema with predefined name'],
    [
      '$0 create object *schemaId* --property1=value2 --property2=value2',
      'Create object instance with schema id and given properties',
    ],
  ]);
  return yargs;
};
