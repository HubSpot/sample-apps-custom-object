<?php

namespace Commands\Schemas;

use Helpers\HubspotClientHelper;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class DeleteCommand extends SchemasCommand {
    
    protected static $defaultName = 'schemas:delete';
    
    protected function configure(): void
    {
        $this->setDescription('Delete CRM schema by objectTypeId (Fully qualified name or object type ID for the target schema).');
        
        $this->addObjectTypeIdToCommand();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $hubspot = HubspotClientHelper::createFactory();
        
        if (!empty($input->getArgument('objectTypeId'))) {
            $io->writeln('Deleting a schema by objectTypeId...');
            
            $hubspot->crm()->schemas()->CoreApi()->archive($input->getArgument('objectTypeId'));
            
            $io->writeln('Schema was successfully deleted.');
        }
        
        return Command::SUCCESS;
    }
}
