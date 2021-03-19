<?php

namespace Commands\Objects;

use Helpers\HubspotClientHelper;
use Helpers\SchemaIdConverter;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Traits\ObjectIdCommandArgument;
use Traits\SchemaIdCommandArgument;

class DeleteCommand extends Command
{
    use ObjectIdCommandArgument;
    use SchemaIdCommandArgument;

    protected static $defaultName = 'objects:delete';

    protected function configure()
    {
        $this->setDescription('Delete CRM object instance from schema by id.');

        $this->addSchemaIdArgument();

        $this->addObjectIdArgument();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $hubspot = HubspotClientHelper::createFactory();
        $objectTypeId = SchemaIdConverter::toObjectTypeId($input->getArgument('schemaId'));
        $id = $input->getArgument('id');

        $io->writeln("Deleting CRM object instance from schema by id: {$id}");

        $hubspot->crm()->objects()->basicApi()->archive($objectTypeId, $id);

        $io->writeln('Object was successfully deleted.');

        return Command::SUCCESS;
    }
}
