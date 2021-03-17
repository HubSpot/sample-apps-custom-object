<?php

namespace Traits;

use Symfony\Component\Console\Input\InputArgument;

trait PropertiesToCommand
{
    protected $keyValueCount = 2;

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

    protected function getProperties(array $elements): array
    {
        $properties = [];
        foreach ($elements as $element) {
            $array = explode('=', $element);
            if ($this->keyValueCount != count($array)) {
                throw new \RuntimeException('Invalid Element "'.$element.'".');
            }
            $properties[$array[0]] = $array[1];
        }

        return $properties;
    }
}
