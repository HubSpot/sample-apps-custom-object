<?php

namespace Commands\Schemas;

use Helpers\HubspotClientHelper;
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
                'objectTypeId',
                null,
                InputOption::VALUE_REQUIRED,
                'Get schema by objectTypeId (Fully qualified name or object type ID of the target schema).'
            )
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $hubspot = HubspotClientHelper::createFactory();

        if (!empty($input->getOption('objectTypeId'))) {
            $objectTypeId = $input->getOption('objectTypeId');
            $io->writeln("Getting a schema by objectTypeId: {$objectTypeId}");

            $response = $hubspot->crm()->schemas()->CoreApi()->getById($objectTypeId);

            $io->info($response);
        } else {
            $io->writeln('Getting all schemas...');

            $response = $hubspot->crm()->schemas()->CoreApi()->getAll();

            if (count($response->getResults()) > 0) {
                $io->listing($response->getResults());
            } else {
                $io->writeln('No object schemas.');
            }
        }

        return Command::SUCCESS;
    }
}
