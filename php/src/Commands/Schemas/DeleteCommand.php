<?php

namespace Commands\Schemas;

use Helpers\HubspotClientHelper;
use Helpers\SchemaIdConverter;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Traits\SchemaIdCommandArgument;

#[AsCommand(name: 'schemas:delete')]
class DeleteCommand extends Command
{
    use SchemaIdCommandArgument;

    protected function configure(): void
    {
        $this->setDescription('Delete CRM schema by schemaId.');

        $this->addSchemaIdArgument();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $hubspot = HubspotClientHelper::createFactory();
        $schemaId = $input->getArgument('schemaId');
        $io->writeln("Deleting a schema by schemaId: {$schemaId}");

        $hubspot->crm()->schemas()->CoreApi()
            ->archive(SchemaIdConverter::toObjectTypeId($schemaId))
        ;

        $io->writeln('Schema was successfully deleted.');

        return Command::SUCCESS;
    }
}
