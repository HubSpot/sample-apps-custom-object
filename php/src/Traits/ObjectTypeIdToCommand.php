<?php

namespace Traits;

use Symfony\Component\Console\Input\InputArgument;

trait ObjectTypeIdToCommand
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
}
