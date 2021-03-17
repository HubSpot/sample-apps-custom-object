<?php

namespace Commands\Schemas;

use Symfony\Component\Console\Command\Command;

class SchemasCommand extends Command
{
    protected function getNamesValidator(): callable
    {
        $notEmptyValidator = $this->getNotEmptyValidator();

        return function ($string) use ($notEmptyValidator): string {
            $notEmptyValidator($string);

            if (strpos($string, ' ')) {
                throw new \RuntimeException('The value may not contain spaces.');
            }

            return mb_strtolower($string);
        };
    }

    protected function getNotEmptyValidator(): callable
    {
        return function ($value) {
            if (empty($value)) {
                throw new \RuntimeException('The value may not be blank.');
            }

            return $value;
        };
    }
}
