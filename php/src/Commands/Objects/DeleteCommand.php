<?php

namespace Commands\Objects;

use Helpers\HubspotClientHelper;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Traits\ObjectIdCommandArgument;
use Traits\ObjectTypeIdCommandArgument;

class DeleteCommand extends Command
{
    use ObjectTypeIdCommandArgument;
    use ObjectIdCommandArgument;

    protected static $defaultName = 'objects:delete';

    protected function configure()
    {
        $this->setDescription('Delete CRM object instance from schema by id.');

        $this->addObjectTypeIdArgument();

        $this->addObjectIdArgument();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $hubspot = HubspotClientHelper::createFactory();
        $objectTypeId = $input->getArgument('objectTypeId');
        $id = $input->getArgument('id');

        $io->writeln("Deleting CRM object instance from schema by id: {$id}");

        $hubspot->crm()->objects()->basicApi()->archive($objectTypeId, $id);

        $io->writeln('Object was successfully deleted.');

        return Command::SUCCESS;
    }
}
