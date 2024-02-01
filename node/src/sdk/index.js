require('dotenv').config({ path: '.env' });
const hubspot = require('@hubspot/api-client');

const hubspotClient = new hubspot.Client({
  accessToken: process.env.HUBSPOT_PRIVATE_APP_ACCESS_TOKEN,
});

module.exports = {
  hubspotClient,
};
