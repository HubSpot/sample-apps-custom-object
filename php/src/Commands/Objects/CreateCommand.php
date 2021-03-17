<?php

namespace Commands\Objects;

use Helpers\HubspotClientHelper;
use HubSpot\Client\Crm\Objects\Model\SimplePublicObjectInput;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class CreateCommand extends ObjectCommand
{
    protected static $defaultName = 'objects:create';

    protected function configure()
    {
        $this->setDescription('Create CRM object instance from schema.');
        $this->addObjectTypeIdToCommand();
        $this->addPropertiesToCommand();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $hubspot = HubspotClientHelper::createFactory();
        $objectTypeId = $input->getArgument('objectTypeId');

        $io->writeln('Creating CRM object instance from schema...');

        $object = new SimplePublicObjectInput();
        $object->setProperties($this->getProperties($input->getArgument('properties')));

        $response = $hubspot->crm()->objects()->basicApi()
            ->create($objectTypeId, $object)
        ;

        $io->info($response);

        return ObjectCommand::SUCCESS;
    }
}
