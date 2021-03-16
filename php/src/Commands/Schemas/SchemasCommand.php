<?php

namespace Commands\Schemas;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;

class SchemasCommand extends Command
{
    protected function addObjectTypeIdToCommand(): void
    {
        $this
            ->addArgument(
                'objectTypeId',
                InputArgument::REQUIRED,
                'Fully qualified name or object type ID for the target schema.'
            )
        ;
    }

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
