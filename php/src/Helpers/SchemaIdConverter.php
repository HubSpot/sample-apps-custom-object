<?php

namespace Helpers;

class SchemaIdConverter
{
    public static function toObjectTypeId(string $schemaId): string
    {
        return "2-{$schemaId}";
    }
}
