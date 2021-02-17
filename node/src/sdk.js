require('dotenv').config({ path: '.env' });
const _ = require('lodash');
const hubspot = require('@hubspot/api-client');

const {
  logResponse,
  handleError,
  convertToObjectTypeId,
} = require('./helpers/common');
const { logger } = require('./helpers/logger');

const hubspotClient = new hubspot.Client({
  apiKey: process.env.HUBSPOT_API_KEY,
});

const OBJECTS_LIMIT = 100;

const getAllSchemas = async () => {
  try {
    // Get CRM schemas
    // GET /crm/v3/schemas
    // https://developers.hubspot.com/docs/api/crm/crm-custom-objects
    logger.log(`Calling crm.schemas.coreApi.getAll API method.`);
    const schemasResponse = await hubspotClient.crm.schemas.coreApi.getAll();
    logResponse(schemasResponse);
    return _.get(schemasResponse, 'body.results', []);
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

    return _.get(schemaResponse, 'body');
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

    const schemaId = _.get(createResponse, 'body.id');
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

const createObject = async ({ objectType, properties }) => {
  try {
    // Create a new object instance
    // POST /crm/v3/objects/${objectType}
    // https://developers.hubspot.com/docs/api/crm/crm-custom-objects
    logger.log(
      `Calling crm.objects.basicApi.create API method. Create new object instance`
    );
    logger.log(`Properties: ${JSON.stringify(properties)}`);
    const createResponse = await hubspotClient.crm.objects.basicApi.create(
      convertToObjectTypeId(objectType),
      { properties }
    );
    logResponse(createResponse);

    const objectId = _.get(createResponse, 'body.id');
    logger.log(`Created object with id ${objectId}`);
    return objectId;
  } catch (e) {
    handleError(e);
  }
};

const getAllObjects = async ({ objectType, properties, query }) => {
  try {
    const objects = [];
    let objectsResponse;
    let after;
    do {
      if (_.isNil(query) || _.isEmpty(query)) {
        // Get a list of CRM object instances of {objectType}
        // GET /crm/v3/objects/{objectType}
        // https://developers.hubspot.com/docs/api/crm/crm-custom-objects
        logger.log(
          `Calling crm.objects.basicApi.getPage API method. Retrieve ${objectType} objects`
        );
        objectsResponse = await hubspotClient.crm.objects.basicApi.getPage(
          convertToObjectTypeId(objectType),
          OBJECTS_LIMIT,
          after,
          properties
        );
      } else {
        // Search for CRM object instance
        // POST /crm/v3/objects/{objectType}/search
        // https://developers.hubspot.com/docs/api/crm/{objectType}
        logger.log(
          `Calling crm.objects.searchApi.doSearch API method. Retrieve ${objectType} objects with search query:`,
          query
        );
        objectsResponse = await hubspotClient.crm.objects.searchApi.search(
          convertToObjectTypeId(objectType),
          {
            query,
            limit: OBJECTS_LIMIT,
            properties,
            filterGroups: [],
            after,
          }
        );
      }
      logResponse(objectsResponse);
      after = _.get(objectsResponse, 'body.paging.next.after');
      objects.push(...objectsResponse.body.results);
    } while (!_.isNil(after));

    return objects;
  } catch (e) {
    handleError(e);
  }
};

const getObject = async ({ objectId, objectType }) => {
  try {
    if (_.isNil(objectId)) {
      logger.error('Missed objectId');
      return;
    }

    // Get All {objectType} Properties
    // GET /crm/v3/properties/:objectType
    // https://developers.hubspot.com/docs/api/crm/properties
    logger.log(
      `Calling crm.properties.coreApi.getAll API method. Retrieve all ${objectType} properties`
    );
    const propertiesResponse = await hubspotClient.crm.properties.coreApi.getAll(
      convertToObjectTypeId(objectType)
    );
    logResponse(propertiesResponse);

    const objectPropertiesNames = _.map(
      propertiesResponse.body.results,
      'name'
    );

    // Get object identified by objectId and objectType
    // GET /crm/v3/objects/{objectType}/{objectId}
    // https://developers.hubspot.com/docs/api/crm/crm-custom-objects
    logger.log(
      `Calling crm.objects.basicApi.getById API method. Retrieve ${objectType} object by id:`,
      objectId
    );
    const objectResponse = await hubspotClient.crm.objects.basicApi.getById(
      convertToObjectTypeId(objectType),
      objectId,
      objectPropertiesNames
    );
    logResponse(objectResponse);

    return objectResponse;
  } catch (e) {
    handleError(e);
  }
};

const archiveObject = async ({ objectId, objectType }) => {
  try {
    // Archive an object instance
    // DELETE /crm/v3/objects/{objectType}/{objectId}
    // https://developers.hubspot.com/docs/api/crm/crm-custom-objects
    logger.log(
      `Calling crm.objects.basicApi.archive API method. Arсhive ${objectType} object with id:`,
      objectId
    );
    const archiveResponse = await hubspotClient.crm.objects.basicApi.archive(
      convertToObjectTypeId(objectType),
      objectId
    );
    logResponse(archiveResponse);
    logger.log(`Archived ${objectType} object with id ${objectId}`);
    return objectId;
  } catch (e) {
    handleError(e);
  }
};

const updateObject = async ({ objectId, objectType, properties }) => {
  try {
    // Update an object
    // PATCH /crm/v3/objects/{objectType}/{objectId}
    // https://developers.hubspot.com/docs/api/crm/crm-custom-objects
    logger.log(
      `Calling crm.objects.basicApi.update API method. Update ${objectType} object with id:`,
      objectId
    );
    logger.log(`Properties: ${JSON.stringify(properties)}`);
    const updateResponse = await hubspotClient.crm.objects.basicApi.update(
      convertToObjectTypeId(objectType),
      objectId,
      { properties }
    );
    logResponse(updateResponse);
    logger.log(`Updated ${objectType} object with id ${objectId}`);
    return objectId;
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
    const propertiesResponse = await hubspotClient.crm.properties.coreApi.getAll(
      convertToObjectTypeId(objectType)
    );
    logResponse(propertiesResponse);

    return propertiesResponse.body.results;
  } catch (e) {
    handleError(e);
  }
};

module.exports = {
  //schemas api
  getAllSchemas,
  getSchema,
  createSchema,
  deleteSchema,
  updateSchema,
  // objects api
  getAllObjects,
  getObject,
  getProperties,
  createObject,
  updateObject,
  archiveObject,
};
