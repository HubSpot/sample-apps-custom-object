<?php

namespace Commands\Objects;

use Helpers\HubspotClientHelper;
use Helpers\PropertiesHelper;
use Helpers\SchemaIdConverter;
use HubSpot\Client\Crm\Objects\Model\SimplePublicObjectInput;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Traits\ObjectIdCommandArgument;
use Traits\PropertiesCommandArgument;
use Traits\SchemaIdCommandArgument;

#[AsCommand(name: 'objects:update')]
class UpdateCommand extends Command
{
    use ObjectIdCommandArgument;
    use SchemaIdCommandArgument;
    use PropertiesCommandArgument;

    protected function configure()
    {
        $this->setDescription('Update CRM object instance from schema by id.');
        $this->addSchemaIdArgument();
        $this->addObjectIdArgument();
        $this->addPropertiesArgument();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $hubspot = HubspotClientHelper::createFactory();
        $objectTypeId = SchemaIdConverter::toObjectTypeId($input->getArgument('schemaId'));
        $id = $input->getArgument('id');

        $io->writeln("Updating CRM object instance from schema by id: {$id}");

        $object = new SimplePublicObjectInput();
        $object->setProperties(PropertiesHelper::parseProperties($input->getArgument('properties')));

        $response = $hubspot->crm()->objects()->basicApi()
            ->update($objectTypeId, $id, $object)
        ;

        $io->info($response);

        return Command::SUCCESS;
    }
}
