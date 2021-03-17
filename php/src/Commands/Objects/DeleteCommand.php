<?php

namespace Commands\Objects;

use Helpers\HubspotClientHelper;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class DeleteCommand extends ObjectCommand
{
    protected static $defaultName = 'objects:delete';

    protected function configure()
    {
        $this->setDescription('Delete CRM object instance(s) from schema.');
        
        $this->addObjectTypeIdToCommand();
        $this->addIdToCommand();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $hubspot = HubspotClientHelper::createFactory();
        $objectTypeId = $input->getArgument('objectTypeId');
        $id = $input->getArgument('id');
        
        $io->writeln("Deleting CRM object instance from schema by id: {$id}");

        $response = $hubspot->crm()->objects()->basicApi()->archive($objectTypeId, $id);

        $io->writeln('Object was successfully deleted.');

        return ObjectCommand::SUCCESS;
    }
}
