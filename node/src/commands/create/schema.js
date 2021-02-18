const _ = require('lodash');
const pluralize = require('pluralize');
const {
  schemaPropertiesPrompt,
  SCHEMA_PARAMETERS_PROMPT,
  promptUser,
} = require('../../helpers/prompts');
const { logger } = require('../../helpers/logger');
const { checkConfig } = require('../../config');

const { createSchema } = require('../../sdk');

exports.command = 'schema [name]';
exports.describe = 'Create CRM schema';

exports.handler = async (options) => {
  let { name } = options;

  if (!checkConfig()) {
    process.exit(1);
  }

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
};

exports.builder = (yargs) => {
  yargs.option('name', {
    alias: 'n',
    describe: 'name of the schema',
    type: 'string',
  });
  yargs.example([
    ['$0 create schema -n=car', 'Create schema with predefined name'],
  ]);
  return yargs;
};
