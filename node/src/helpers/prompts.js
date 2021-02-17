const _ = require('lodash');
const inquirer = require('inquirer');
const { stringValidator, listValidator } = require('./promptValidators');
const {
  AVAILABLE_SCHEMA_TYPES,
  AVAILABLE_SCHEMA_FIELD_TYPES,
} = require('./constants');

const SCHEMA_PARAMETERS_PROMPT = [
  {
    type: 'input',
    name: 'name',
    message: 'Enter a name for the schema',
    validate: stringValidator,
  },
];

const MAIN_PROPERTY_PARAMETERS_PROMPT = [
  {
    type: 'input',
    name: 'name',
    message: 'Enter a name for the property',
    validate: stringValidator,
  },
  {
    type: 'confirm',
    name: 'required',
    message: 'Is this property required when creating an object of this type?',
    default: false,
  },
  {
    type: 'rawlist',
    loop: false,
    name: 'type',
    pageSize: 20,
    message: 'Select a type of the property',
    choices: Object.values(AVAILABLE_SCHEMA_TYPES),
    validate: listValidator,
  },
];

const ENUMERATED_PROPERTY_OPTIONS_PROMPT = [
  {
    type: 'input',
    name: 'label',
    message: 'Enter a label for the option',
  },
  {
    type: 'input',
    name: 'value',
    message: 'Enter a value for the option',
    validate: stringValidator,
  },
];

const notificationPrompt = (message) =>
  promptUser({
    name: 'notificationPrompt',
    message: `${message} \n<Press enter when you are ready to continue>`,
  });

const continuePrompt = (message) =>
  promptUser({
    type: 'confirm',
    name: 'more',
    message,
    default: false,
  });

const promptUser = async (promptConfig) => {
  const prompt = inquirer.createPromptModule();
  return prompt(promptConfig);
};

const overwritePrompt = (path) => {
  return inquirer.prompt({
    type: 'confirm',
    name: 'overwrite',
    message: `The file '${path}' already exists. Overwrite?`,
    default: false,
  });
};

const schemaPropertiesPrompt = async () => {
  await notificationPrompt(
    'You need to add several properties (at least one) for the new schema'
  );

  let moreProperties = true;
  const properties = [];
  while (moreProperties) {
    const mainPromptAnswers = await promptUser(MAIN_PROPERTY_PARAMETERS_PROMPT);

    const fieldTypePromptAnswer = await promptUser({
      type: 'rawlist',
      loop: false,
      name: 'fieldType',
      pageSize: 20,
      message: 'Select field type of the property',
      choices: AVAILABLE_SCHEMA_FIELD_TYPES[mainPromptAnswers.type],
      validate: listValidator,
    });

    const options = [];
    if (mainPromptAnswers.type === AVAILABLE_SCHEMA_TYPES.enumeration) {
      await notificationPrompt(
        `Since you've chosen ${AVAILABLE_SCHEMA_TYPES.enumeration} type of property, you need to add several options (at least one) for the new property`
      );
      let moreOptions = true;
      while (moreOptions) {
        const { label, value } = await promptUser(
          ENUMERATED_PROPERTY_OPTIONS_PROMPT
        );
        options.push({ label, value });

        const { more } = await continuePrompt(
          'Do you want to add more options for the property?'
        );
        moreOptions = more;
      }
    }

    properties.push({
      ...mainPromptAnswers,
      ...fieldTypePromptAnswer,
      ...(options.length && { options }),
      label: _.capitalize(mainPromptAnswers.name),
    });

    const { more } = await continuePrompt(
      'Do you want to add more properties?'
    );
    moreProperties = more;
  }

  return {
    properties,
  };
};

module.exports = {
  promptUser,
  overwritePrompt,
  schemaPropertiesPrompt,
  SCHEMA_PARAMETERS_PROMPT,
};
