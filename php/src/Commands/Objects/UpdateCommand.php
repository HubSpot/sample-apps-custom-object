<?php

namespace Commands\Objects;

use Helpers\HubspotClientHelper;
use Helpers\PropertiesHelper;
use HubSpot\Client\Crm\Objects\Model\SimplePublicObjectInput;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Traits\ObjectIdCommandArgument;
use Traits\ObjectTypeIdCommandArgument;
use Traits\PropertiesCommandArgument;

class UpdateCommand extends Command
{
    use ObjectIdCommandArgument;
    use ObjectTypeIdCommandArgument;
    use PropertiesCommandArgument;

    protected static $defaultName = 'objects:update';

    protected function configure()
    {
        $this->setDescription('Update CRM object instance from schema.');
        $this->addObjectTypeIdArgument();
        $this->addObjectIdArgument();
        $this->addPropertiesArgument();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $hubspot = HubspotClientHelper::createFactory();
        $objectTypeId = $input->getArgument('objectTypeId');
        $id = $input->getArgument('id');

        $io->writeln('Updating CRM object instance from schema...');

        $object = new SimplePublicObjectInput();
        $object->setProperties(PropertiesHelper::parseProperties($input->getArgument('properties')));

        $response = $hubspot->crm()->objects()->basicApi()
            ->update($objectTypeId, $id, $object)
        ;

        $io->info($response);

        return Command::SUCCESS;
    }
}
