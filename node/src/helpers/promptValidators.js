const { STRING_WITH_NO_SPACES_REGEX } = require('./constants');

const stringValidator = (val) => {
  if (typeof val !== 'string') {
    return 'You entered an invalid value. Please try again.';
  } else if (!val.length) {
    return 'The value may not be blank. Please try again.';
  } else if (!STRING_WITH_NO_SPACES_REGEX.test(val)) {
    return 'The value may not contain spaces. Please try again.';
  }
  return true;
};

const listValidator = (val) => {
  return new Promise((resolve, reject) => {
    if (val.length > 0) {
      resolve(true);
    }
    reject('Please select value from the list');
  });
};

module.exports = {
  stringValidator,
  listValidator,
};
