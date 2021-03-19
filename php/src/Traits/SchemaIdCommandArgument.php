<?php

namespace Traits;

use Symfony\Component\Console\Input\InputArgument;

trait SchemaIdCommandArgument
{
    protected function addSchemaIdArgument(): void
    {
        $this
            ->addArgument(
                'schemaId',
                InputArgument::REQUIRED,
                'Schema`s Id.'
            )
        ;
    }
}
