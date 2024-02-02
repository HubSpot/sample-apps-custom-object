# HubSpot-nodejs custom object sample app

### Requirements

1. Node v10+
2. [Configured](https://github.com/HubSpot/sample-apps-manage-crm-objects/blob/main/README.md#how-to-run-locally) .env file

### Running

1. Install dependencies

```bash
npm install
```

2. Initialize

If .env config file was not configured manually there is a way to initialize the CLI and create .env file via:

```bash
./bin/cli.js init
```

It will ask for your Hubspot Api Key and will save it to the new .env config file.

3. Commands

Show all commands

```bash
./bin/cli.js --help
```

Get list of available schemas or object instances of the schema

```bash
./bin/cli.js get <schema|object> [schemaId] -a --query='test'
```

Create a new schema or object instance

```bash
./bin/cli.js create <schema|object> [schemaId]
```

> [!NOTE]
> Please notice when you create object instance, some of them require mandatory properties, that you can provide in the following way:

```bash
./bin/cli.js create object [schemaId] --email='Brian.Halligan@test.com' --firstname='Brian' --lastname='Halligan'
```

Update existing schema or object instance

```bash
./bin/cli.js update <schema|object> [schemaId] [objectId] --property1='New property value'
./bin/cli.js update schema 23164357 --requiredProperties='name,age'
./bin/cli.js update object 23164357 11980985487 --age=41
```

> [!NOTE]
> Please note that it’s possible to update only `requiredProperties`, `searchableProperties` and `secondaryDisplayProperties` via `update schema`.

Delete existing schema or object instance

```bash
./bin/cli.js delete <schema|object> [schemaId] [objectId]
./bin/cli.js get object 23164357 11980985487
./bin/cli.js delete schema 7895273
```

> [!NOTE]
> Please note that object shema cannot be deleted until all object records are deleted.

Get list of available properties for a schema

```bash
./bin/cli.js properties [schemaId]
```
