require('dotenv').config({ path: '.env' });
const hubspot = require('@hubspot/api-client');

const hubspotClient = new hubspot.Client({
  apiKey: process.env.HUBSPOT_API_KEY,
});

module.exports = {
  hubspotClient,
};
