<?php

namespace Traits;

use Symfony\Component\Console\Input\InputArgument;

trait PropertiesCommandArgument
{
    protected function addPropertiesArgument(): void
    {
        $this
            ->addArgument(
                'properties',
                InputArgument::IS_ARRAY | InputArgument::REQUIRED,
                'Enter Properties (separate multiple names with a space), for example firstname=Josh lastname=Green.'
            )
        ;
    }
}
