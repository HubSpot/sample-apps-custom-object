# HubSpot-python Custom Objects sample app

### Requirements

1. Make sure you have [Python 3.8+](https://www.python.org/downloads/) installed.
2. [Configured](https://github.com/HubSpot/sample-apps-manage-crm-objects/blob/main/README.md#how-to-run-locally) .env file

### Running

1. Install dependencies

```
pip3 install -r requirements.txt
```

2. Commands

Show all commands (get help)

```
python cli.py -h
```

Get all schemas

```
python cli.py -a schema -m get_all
```

Get schema by id

```
python cli.py -a schema -m get_by_id -t [schema_id]
```

Schema id will look like ****_name_of_your_schema. Please, check "fully_qualified_name" after creation.

Create schema

```
python cli.py -a schema -m create -p [params]
```

Params is a json with schema params. Example:

```
python cli.py -a schema -m create -p '{                                                            
  "labels": {
    "singular": "My python object",
    "plural": "My python objects"
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
  "name": "my_python_object",
  "primary_display_property": "my_object_property"
}'
```

Update schema

```
python cli.py -a schema -m update -t [schema_id] -p [params]
```

Example

```
python cli.py -a schema -m update -t your_schema_id -p '{                                                            
  "labels": {
    "singular": "My updated python object",
    "plural": "My updated python objects"
  }
}'
```

Delete schema

```
python cli.py -a schema -m archive -t [schema_id]
```

Get objects

```
python cli.py -a object -m get_page -t [schema_id]
```

Get an object by id

```
python cli.py -a object -m get_by_id -t [schema_id] -i [object_id]
```

Create new object

```
python cli.py -m create -t [schema_id] -p [params]
```

Params is a json, example:

```
'{"my_object_property":"my_object_value"}'
```

Update an object

```
python cli.py -a object -m update -t [schema_id] -i [object_id] -p [params]
```

Params is a json, example:

```
'{"my_object_property":"my_updated_value"}'
```

Delete an object

```
python cli.py -m archive -t [schema_id] -i [object_id]
```
