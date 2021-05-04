# HubSpot-ruby Custom Objects sample app

### Requirements

1. ruby 2.6.3
2. [Configured](https://github.com/HubSpot/sample-apps-manage-crm-objects/blob/main/README.md#how-to-run-locally) .env file

### Running

1. Install dependencies

```
bundle install
```

2. Commands

Show all commands (get help)

```
ruby cli.rb -h
```

Get all schemas

```
ruby cli.rb -a schema -m get_all
```

Get schema by id

```
ruby cli.rb -a schema -m get_by_id -t [schema_id]
```

Schema id will look like ****_name_of_your_schema. Please, check "fully_qualified_name" after creation.

Create schema

```
ruby cli.rb -a schema -m create -p [params]
```

Params is a json with schema params. Example:

```
ruby cli.rb -a schema -m create -p '{                                                            
  "labels": {
    "singular": "My object",
    "plural": "My objects"
  },                               
  "required_properties": [          
    "my_object_property"               
  ],
  "properties": [           
    {                     
      "name": "my_object_property",
      "label": "My object property",
      "is_primary_display_label": true,
      "field_type": "text"
    }             
  ],
  "associated_objects": [
    "CONTACT"
  ],
  "name": "my_object",
  "primary_display_property": "my_object_property"
}'
```

Update schema

```
ruby cli.rb -a schema -m update -t [schema_id] -p [params]
```

Example

```
ruby cli.rb -a schema -m update -t your_schema_id -p '{                                                            
  "labels": {
    "singular": "My updated object",
    "plural": "My updated objects"
  }
}'
```

Delete schema

```
ruby cli.rb -a schema -m archive -t [schema_id]
```

Get objects

```
ruby cli.rb -a object -m get_page -t [schema_id]
```

Get an object by id

```
ruby cli.rb -a object -m get_by_id -t [schema_id] -i [object_id]
```

Create new object

```
ruby cli.rb -m create -t [schema_id] -p [params]
```

Params is a json, example:

```
'{"my_object_property":"my_object_value"}'
```

Update an object

```
ruby cli.rb -a object -m update -t [schema_id] -i [object_id] -p [params]
```

Params is a json, example:

```
'{"my_object_property":"my_updated_value"}'
```

Delete an object

```
ruby cli.rb -m archive -t [schema_id] -i [object_id]
```
