<?php

namespace Commands\Objects;

use Helpers\HubspotClientHelper;
use Helpers\PropertiesHelper;
use Helpers\SchemaIdConverter;
use HubSpot\Client\Crm\Objects\Model\SimplePublicObjectInput;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Traits\PropertiesCommandArgument;
use Traits\SchemaIdCommandArgument;

class CreateCommand extends Command
{
    use SchemaIdCommandArgument;
    use PropertiesCommandArgument;

    protected static $defaultName = 'objects:create';

    protected function configure()
    {
        $this->setDescription('Create CRM object instance from schema.');
        $this->addSchemaIdArgument();
        $this->addPropertiesArgument();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $hubspot = HubspotClientHelper::createFactory();
        $objectTypeId = SchemaIdConverter::toObjectTypeId($input->getArgument('schemaId'));

        $io->writeln('Creating CRM object instance from schema...');

        $object = new SimplePublicObjectInput();
        $object->setProperties(PropertiesHelper::parseProperties($input->getArgument('properties')));

        $response = $hubspot->crm()->objects()->basicApi()
            ->create($objectTypeId, $object)
        ;

        $io->info($response);

        return Command::SUCCESS;
    }
}
