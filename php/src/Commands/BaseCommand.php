<?php

namespace Commands;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;

class BaseCommand extends Command
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
