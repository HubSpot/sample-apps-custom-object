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
php ./bin/cli.php app:init 
```

It will ask for your Hubspot Api Key and will save it to new .env config file.

3. Commands

Show all commands

```bash
php ./bin/cli.php
```
