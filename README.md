# HubSpot Custom Object sample app

This is a sample app for the HubSpot [client libraries](https://developers.hubspot.com/docs/api/overview). This sample app demonstrates how to make CRUD API calls to CRM custom objects [API](https://developers.hubspot.com/docs/api/crm/crm-custom-objects).

## Reference

- [CRM Objects API ](https://developers.hubspot.com/docs/api/crm/understanding-the-crm)
- [CRM Custom objects API ](https://developers.hubspot.com/docs/api/crm/crm-custom-objects)

## How to run locally

1. Copy the .env.template file into a file named .env in the folder of the language you want to use. For example:

```bash
cp node/.env.template node/.env
```

2. You'll need to create a [private app](https://developers.hubspot.com/docs/api/private-apps) to get your access token
> **_NOTE:_** choose necessary scopes (if you don't choose the sample won't work)

3. Paste your access token as the value for ACCESS_TOKEN in .env

4. Follow the language instructions on how to run. For example, if you want to run the Node server:

```
cd node # there's a README in this folder with instructions
npm install
./bin/cli.js
```

## Supported languages

* [JavaScript (Node)](node/README.md)
* [Php](php/README.md)
* [Ruby](ruby/README.md)
* [Python](python/README.md)
