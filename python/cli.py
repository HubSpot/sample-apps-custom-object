import os
import argparse
import json
from dotenv import load_dotenv
from hubspot import HubSpot
from hubspot.crm.objects.models import SimplePublicObjectInput
from hubspot.crm.schemas.models import ObjectSchemaEgg
from hubspot.crm.schemas.models import ObjectTypeDefinitionPatch


def access_token():
    load_dotenv()
    return os.environ['ACCESS_TOKEN']


parser = argparse.ArgumentParser(description='Parse Hubspot API arguments')
parser.add_argument('-a', '--api', help='Can be "schema" or "object"')
parser.add_argument('-m', '--method', help='Method to run')
parser.add_argument('-t', '--object_type', help='Object type')
parser.add_argument('-i', '--object_id', help='Object id')
parser.add_argument('-p', '--properties', help='Properties of object')
parser.add_argument('-k', '--kwargs', help='kwargs to pass')
args = parser.parse_args()

if args.api is None:
    raise Exception('Please, provide api with -a or --api. See --help to get more info.')

if args.method is None:
    raise Exception('Please, provide method with -m or --method. See --help to get more info.')

api_client = HubSpot(access_token=access_token())
api = api_client.crm.objects.basic_api if args.api == 'object' else api_client.crm.schemas.core_api

kwargs = vars(args)
filtered_kwargs = {
  k: v for k, v in kwargs.items() if v is not None and k != 'api' and k != 'method' and k != 'properties'
}
if args.properties is not None:
    properties = json.loads(args.properties)
    if args.api == 'object':
        filtered_kwargs['simple_public_object_input'] = SimplePublicObjectInput(properties=properties)
    elif args.method == 'create':
        filtered_kwargs['object_schema_egg'] = ObjectSchemaEgg(**properties)
    else:
        filtered_kwargs['object_type_definition_patch'] = ObjectTypeDefinitionPatch(**properties)

result = getattr(api, args.method)(**filtered_kwargs)
print(result)
