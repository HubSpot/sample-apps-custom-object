<?php

namespace Commands\Schemas;

use Helpers\HubspotClientHelper;
use Helpers\SchemaIdConverter;
use HubSpot\Client\Crm\Schemas\ObjectSerializer;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class GetCommand extends Command
{
    protected static $defaultName = 'schemas:get';

    protected function configure()
    {
        $this->setDescription('Get CRM schema.');

        $this
            ->addOption(
                'all',
                null,
                InputOption::VALUE_NONE,
                'Get all schemas.'
            )
        ;

        $this
            ->addOption(
                'schemaId',
                null,
                InputOption::VALUE_REQUIRED,
                'Schema`s Id.'
            )
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $hubspot = HubspotClientHelper::createFactory();

        if (!empty($input->getOption('schemaId'))) {
            $schemaId = $input->getOption('schemaId');
            $io->writeln("Getting a schema by objectTypeId: {$schemaId}");

            $response = $hubspot->crm()->schemas()->CoreApi()
                ->getById(SchemaIdConverter::toObjectTypeId($schemaId))
            ;

            $io->info($response);
        } else {
            $io->writeln('Getting all schemas...');

            $response = $hubspot->crm()->schemas()->CoreApi()->getAll();

            $this->printSchemas($response->getResults(), $io);
        }

        return Command::SUCCESS;
    }

    protected function printSchemas(array $schemas, SymfonyStyle $io): void
    {
        if (count($schemas) > 0) {
            $io->listing($schemas);
            $io->table(
                ['id', 'name', 'fully_qualified_name', 'object_type_id'],
                array_map(function ($schema) {
                    return
                        ObjectSerializer::sanitizeForSerialization([
                            'id' => $schema->getId(),
                            'name' => $schema->getName(),
                            'fully_qualified_name' => $schema->getFullyQualifiedName(),
                            'object_type_id' => $schema->getObjectTypeId(),
                        ]);
                }, $schemas)
            );
        } else {
            $io->writeln('No object schemas.');
        }
    }
}
