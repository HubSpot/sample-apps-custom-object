// eslint-disable-next-line node/no-unpublished-require
require('dotenv').config({ path: '.env' });
const { logger } = require('./helpers/logger');

const checkConfig = () => {
  if (!process.env.HUBSPOT_PRIVATE_APP_ACCESS_TOKEN) {
    logger.error(
      'Please, set .env file with authorize private app access token, or use init command to authorize'
    );
    return false;
  }
  return true;
};

module.exports = {
  checkConfig,
};
