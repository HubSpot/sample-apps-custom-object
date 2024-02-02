const AVAILABLE_SCHEMA_TYPES = {
  enumeration: 'enumeration',
  date: 'date',
  dateTime: 'dateTime',
  string: 'string',
  number: 'number',
};

const AVAILABLE_SCHEMA_FIELD_TYPES = {
  enumeration: ['booleancheckbox', 'checkbox', 'radio', 'select'],
  date: ['date'],
  dateTime: ['date'],
  string: ['file', 'text', 'textarea'],
  number: ['number'],
};

const UPDATE_SCHEMA_ARRAY_PROPERTIES = [
  'requiredProperties',
  'searchableProperties',
  'secondaryDisplayProperties',
];

const STRING_WITH_NO_SPACES_REGEX = /^\S*$/;

module.exports = {
  AVAILABLE_SCHEMA_TYPES,
  AVAILABLE_SCHEMA_FIELD_TYPES,
  STRING_WITH_NO_SPACES_REGEX,
  UPDATE_SCHEMA_ARRAY_PROPERTIES,
};
