<?php

namespace Commands\Objects;

use Helpers\HubspotClientHelper;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class GetCommand extends ObjectCommand
{
    protected static $defaultName = 'objects:get';

    protected function configure()
    {
        $this->setDescription('Get CRM object instance(s) from schema.');

        $this
            ->addOption(
                'all',
                null,
                InputOption::VALUE_NONE,
                'Get all objects.'
            )
        ;

        $this->addObjectTypeIdToCommand();

        $this
            ->addOption(
                'id',
                null,
                InputOption::VALUE_REQUIRED,
                'Get CRM object instance by Id.'
            )
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $hubspot = HubspotClientHelper::createFactory();
        $objectTypeId = $input->getArgument('objectTypeId');

        if (!empty($input->getOption('id'))) {
            $id = $input->getOption('id');
            $io->writeln("Getting CRM object instance from schema by id: {$id}");

            $response = $hubspot->crm()->objects()->basicApi()->getById($objectTypeId, $id);

            $io->info($response);
        } else {
            $io->writeln("Getting all object instances from schema...");

            $response = $hubspot->crm()->objects()->basicApi()->getPage($objectTypeId);

            if (count($response->getResults()) > 0) {
                $io->listing($response->getResults());
            } else {
                $io->writeln('No objects in this scheme.');
            }
        }

        return ObjectCommand::SUCCESS;
    }
}
