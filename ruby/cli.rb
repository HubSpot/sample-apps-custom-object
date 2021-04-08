require_relative 'config'
require 'optparse'
require 'ostruct'
require 'json'

class Cli
  REQUIRED_PARAMS = {
    object: {
      archive: %i(object_type object_id),
      create: %i(object_type simple_public_object_input),
      get_by_id: %i(object_type object_id),
      get_page: %i(object_type),
      update: %i(object_type object_id simple_public_object_input)
    },
    schema: {
      archive: %i(object_type),
      create: %i(object_schema_egg),
      get_by_id: %i(object_type),
      get_all: %i(),
      update: %i(object_type object_type_definition_patch)
    }
  }.freeze

  API = {
    schema: Hubspot::Crm::Schemas::CoreApi.new,
    object: Hubspot::Crm::Objects::BasicApi.new
  }.freeze

  def initialize(options)
    @options = options_with_properties(options)
    @api_type = options[:api]&.to_sym
    @method = options[:method]&.to_sym
  end

  def run
    validate
    call_api
  end

  private

  attr_reader :options, :api_type, :method

  def validate
    raise(ArgumentError, 'Please, provide api to call with -a or --api') unless api_type
    raise(ArgumentError, 'Please, provide method to call with -m or --method') unless method
    missing_params = REQUIRED_PARAMS[api_type][method] - options.to_h.keys
    raise(ArgumentError, "Please, provide missing params #{missing_params} for the method. Use help (-h) if you need.") if missing_params.any?
  end

  def call_api
    API[api_type].public_send(method, *params)
  end

  def params
    required_params = REQUIRED_PARAMS[api_type][method]
    mapped_params = required_params.map { |param| options[param] }
    opts = options[:opts] || {}
    opts[:auth_names] = 'hapikey'
    mapped_params << opts
    mapped_params
  end

  def options_with_properties(options)
    return options if options[:properties].nil? || options[:api].nil? || options[:method].nil?

    properties = options[:properties]
    options[:simple_public_object_input] = Hubspot::Crm::Objects::SimplePublicObjectInput.new(properties: properties) if options[:api] == 'object'
    options[:object_schema_egg] = Hubspot::Crm::Schemas::ObjectSchemaEgg.new(properties) if options[:api] == 'schema' && options[:method] == 'create'
    options[:object_type_definition_patch] = Hubspot::Crm::Schemas::ObjectTypeDefinitionPatch.new(properties) if options[:api] == 'schema' && options[:method] == 'update'
    options
  end
end

options = OpenStruct.new
OptionParser.new do |opt|
  opt.on('-a', '--api API', 'Can be "schema" or "object"') { |o| options.api = o }
  opt.on('-m', '--method METHOD', 'Method to run') { |o| options.method = o }
  opt.on('-t', '--type TYPE', 'The type of object') { |o| options.object_type = o }
  opt.on('-i', '--id ID', 'The id of object') { |o| options.object_id = o }
  opt.on('-p', '--properties PROPERTIES', 'Properties of object') { |o| options.properties = JSON.parse(o) }
  opt.on('-o', '--options OPTIONS', 'Options to pass') { |o| options.opts = JSON.parse(o) }
end.parse!

p Cli.new(options).run
