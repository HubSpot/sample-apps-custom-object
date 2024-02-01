const _ = require('lodash');
const { hubspotClient } = require('./index');

const {
  logResponse,
  handleError,
  convertToObjectTypeId,
} = require('../helpers/common');
const { logger } = require('../helpers/logger');

const getAllSchemas = async () => {
  try {
    // Get CRM schemas
    // GET /crm/v3/schemas
    // https://developers.hubspot.com/docs/api/crm/crm-custom-objects
    logger.log(`Calling crm.schemas.coreApi.getAll API method.`);
    const schemasResponse = await hubspotClient.crm.schemas.coreApi.getAll();
    logResponse(schemasResponse);
    return _.get(schemasResponse, 'results', []);
  } catch (e) {
    handleError(e);
  }
};

const getSchema = async ({ schemaId }) => {
  try {
    if (_.isNil(schemaId)) {
      logger.error(`Missed schema id`);
      return;
    }

    // Get schema by id
    // GET /crm/v3/schemas/{objectType}
    // https://developers.hubspot.com/docs/api/crm/crm-custom-objects
    logger.log(
      `Calling crm.schemas.coreApi.getById API method. Retrieve schema by id: ${schemaId}`
    );
    const schemaResponse = await hubspotClient.crm.schemas.coreApi.getById(
      convertToObjectTypeId(schemaId)
    );
    logResponse(schemaResponse);

    return schemaResponse;
  } catch (e) {
    handleError(e);
  }
};

const createSchema = async (schema) => {
  try {
    // Create a new schema
    // POST /crm/v3/schemas
    // https://developers.hubspot.com/docs/api/crm/crm-custom-objects
    logger.log(
      `Calling crm.schemas.coreApi.create API method. Create new schema`
    );
    const createResponse = await hubspotClient.crm.schemas.coreApi.create(
      schema
    );
    logResponse(createResponse);

    const schemaId = _.get(createResponse, 'id');
    logger.log(`Created schema with id ${schemaId}`);
    return schemaId;
  } catch (e) {
    handleError(e);
  }
};

const updateSchema = async ({ schemaId, properties }) => {
  try {
    // Update a schema
    // POST /crm/v3/schemas/{objectType}
    // https://developers.hubspot.com/docs/api/crm/crm-custom-objects
    logger.log(
      `Calling crm.schemas.coreApi.update API method. Update a schema with id ${schemaId}`
    );
    logger.log(`Properties: ${JSON.stringify(properties)}`);
    const updateResponse = await hubspotClient.crm.schemas.coreApi.update(
      convertToObjectTypeId(schemaId),
      properties
    );
    logResponse(updateResponse);

    logger.log(`Updated schema with id ${schemaId}`);
    return schemaId;
  } catch (e) {
    handleError(e);
  }
};

const deleteSchema = async ({ schemaId, purge }) => {
  try {
    // Archive schema
    // DELETE /crm/v3/schemas/{objectType}
    // https://developers.hubspot.com/docs/api/crm/crm-custom-objects
    logger.log(
      `Calling crm.schemas.coreApi.archive API method. Archive schema with id:`,
      schemaId
    );
    const archiveResponse = await hubspotClient.crm.schemas.coreApi.archive(
      convertToObjectTypeId(schemaId)
    );
    logResponse(archiveResponse);
    logger.log(`Archived schema with id ${schemaId}`);
    if (purge) {
      // Purge schema
      // DELETE /crm/v3/schemas/{objectType}/purge
      // https://developers.hubspot.com/docs/api/crm/crm-custom-objects
      logger.log(
        `Calling crm.schemas.defaultApi.purge API method. Purge schema with id: ${schemaId}`
      );
      const purgeResponse = await hubspotClient.crm.schemas.defaultApi.purge(
        convertToObjectTypeId(schemaId)
      );
      logResponse(purgeResponse);
    }
    return schemaId;
  } catch (e) {
    handleError(e);
  }
};

const getProperties = async ({ objectType }) => {
  try {
    // Get All {ObjectType} Properties
    // GET /crm/v3/properties/:objectType
    // https://developers.hubspot.com/docs/api/crm/properties
    logger.log(
      'Calling crm.properties.coreApi.getAll API method. Retrieve all contacts properties'
    );
    const propertiesResponse =
      await hubspotClient.crm.properties.coreApi.getAll(
        convertToObjectTypeId(objectType)
      );
    logResponse(propertiesResponse);

    return propertiesResponse.results;
  } catch (e) {
    handleError(e);
  }
};

module.exports = {
  getAllSchemas,
  getSchema,
  createSchema,
  deleteSchema,
  updateSchema,
  getProperties,
};
