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
        $this->setDescription('Get CRM object instance(s) by objectTypeId.');

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
            $io->writeln("Getting CRM object instance by objectTypeId: {$objectTypeId} and object's id: {$id}");

            $response = $hubspot->crm()->objects()->basicApi()->getById($objectTypeId, $id);

            $io->info($response);
        } else {
            $io->writeln("Getting all object instances by objectTypeId: {$objectTypeId}");

            $response = $hubspot->crm()->objects()->basicApi()->getPage($objectTypeId);

            if (count($response->getResults()) > 0) {
                $io->listing($response->getResults());
            } else {
                $io->writeln('No object objects.');
            }
        }

        return ObjectCommand::SUCCESS;
    }
}
