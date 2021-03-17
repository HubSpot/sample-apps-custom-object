<?php

namespace Commands\Objects;

use Commands\BaseCommand;
use Symfony\Component\Console\Input\InputArgument;

class ObjectCommand extends BaseCommand
{
    const KEY_VALUE_COUNT = 2;

    protected function addPropertiesToCommand(): void
    {
        $this
            ->addArgument(
                'properties',
                InputArgument::IS_ARRAY | InputArgument::REQUIRED,
                'Enter Properties (separate multiple names with a space), for example firstname=Josh lastname=Green.'
            )
        ;
    }
    
    protected function addIdToCommand(): void
    {   
        $this
            ->addArgument(
                'id',
                InputArgument::REQUIRED,
                'Enter Object Id.'
            )
        ;
    }

    protected function getProperties(array $elements): array
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
