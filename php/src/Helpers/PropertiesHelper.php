<?php

namespace Helpers;

class PropertiesHelper
{
    public const KEY_VALUE_COUNT = 2;

    public static function parseProperties(array $elements): array
    {
        $properties = [];
        foreach ($elements as $element) {
            $array = explode('=', $element);
            if (static::KEY_VALUE_COUNT != count($array)) {
                throw new \RuntimeException('Invalid Element "'.$element.'".');
            }
            $properties[$array[0]] = $array[1];
        }

        return $properties;
    }
}
