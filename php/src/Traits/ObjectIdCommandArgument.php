<?php

namespace Traits;

use Symfony\Component\Console\Input\InputArgument;

trait ObjectIdCommandArgument
{
    protected function addObjectIdArgument(): void
    {
        $this
            ->addArgument(
                'id',
                InputArgument::REQUIRED,
                'Object Id.'
            )
        ;
    }
}
