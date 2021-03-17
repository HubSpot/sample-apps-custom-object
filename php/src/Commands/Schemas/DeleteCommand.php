<?php

namespace Commands\Schemas;

use Helpers\HubspotClientHelper;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Traits\ObjectTypeIdCommandArgument;

class DeleteCommand extends SchemasCommand
{
    use ObjectTypeIdCommandArgument;

    protected static $defaultName = 'schemas:delete';

    protected function configure(): void
    {
        $this->setDescription('Delete CRM schema by objectTypeId (Fully qualified name or object type ID for the target schema).');

        $this->addObjectTypeIdArgument();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $hubspot = HubspotClientHelper::createFactory();

        if (!empty($input->getArgument('objectTypeId'))) {
            $objectTypeId = $input->getArgument('objectTypeId');
            $io->writeln("Deleting a schema by objectTypeId: {$objectTypeId}");

            $hubspot->crm()->schemas()->CoreApi()->archive($objectTypeId);

            $io->writeln('Schema was successfully deleted.');
        }

        return SchemasCommand::SUCCESS;
    }
}
