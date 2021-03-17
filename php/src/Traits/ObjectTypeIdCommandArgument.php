<?php

namespace Traits;

use Symfony\Component\Console\Input\InputArgument;

trait ObjectTypeIdCommandArgument
{
    protected function addObjectTypeIdArgument(): void
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
