# HubSpot-php custom object sample app

### Requirements

1. php >=7.2.5
2. [Configured](https://github.com/HubSpot/sample-apps-manage-crm-objects/blob/main/README.md#how-to-run-locally) .env file

### Running

1. Install dependencies

```bash
composer i
```

2. Initialize

If .env config file was not configured manually there is a way to initialize the CLI and create .env file via:

```bash
./bin/cli.php app:init 
```

It will ask for your Hubspot Api Key and will save it to the new .env config file.

3. Commands

Show all commands

```bash
./bin/cli.php
```

##Schemas

Get list of available schemas

```bash
./bin/cli.php schemas:get --all
```

Get schema by Id

```bash
./bin/cli.php schemas:get --schemaId=<schemaId>
```

Create a new schema 

```bash
./bin/cli.php schemas:create
```

Update existing schema

```bash
./bin/cli.php schemas:update <schemaId>
```

Delete existing schema

```bash
./bin/cli.php schemas:delete <schemaId>
```

##Objects

Get list of objects from schema

```bash
./bin/cli.php objects:get <schemaId> --all
```

Get object from schema by Id

```bash
./bin/cli.php objects:get <schemaId> --id=<objectId>
```

Create a new object 

```bash
./bin/cli.php objects:create <schemaId> name=josh age=10   
```

Update existing object

```bash
./bin/cli.php objects:update <schemaId> <objectId> name=Ryan age=30
```

Delete existing object from schema

```bash
./bin/cli.php objects:delete <schemaId> <objectId>
```
