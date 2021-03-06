<?php

namespace Helpers;

class ValidationHelper
{
    public static function getNamesValidator(): callable
    {
        $notEmptyValidator = static::getNotEmptyValidator();

        return function ($string) use ($notEmptyValidator): string {
            $notEmptyValidator($string);

            if (strpos($string, ' ')) {
                throw new \RuntimeException('The value may not contain spaces.');
            }

            return mb_strtolower($string);
        };
    }

    public static function getNotEmptyValidator(): callable
    {
        return function ($value) {
            if (empty($value)) {
                throw new \RuntimeException('The value may not be blank.');
            }

            return $value;
        };
    }
}
