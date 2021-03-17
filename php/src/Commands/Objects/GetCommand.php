<?php

namespace Commands\Objects;

use Helpers\HubspotClientHelper;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Traits\ObjectTypeIdCommandArgument;

class GetCommand extends Command
{
    use ObjectTypeIdCommandArgument;
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

        $this->addObjectTypeIdArgument();

        $this
            ->addOption(
                'id',
                null,
                InputOption::VALUE_REQUIRED,
                'Enter CRM object instance Id.'
            )
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $hubspot = HubspotClientHelper::createFactory();
        $objectTypeId = $input->getArgument('objectTypeId');
        $schema = $hubspot->crm()->schemas()->CoreApi()->getById($objectTypeId);

        if (!empty($input->getOption('id'))) {
            $id = $input->getOption('id');

            $io->writeln("Getting CRM object instance from schema by id: {$id}");

            $response = $hubspot->crm()->objects()->basicApi()->getById(
                $objectTypeId,
                $id,
                $this->propertiesNamesToString($schema->getProperties())
            );

            $io->info($response);
        } else {
            $io->writeln('Getting all object instances from schema...');

            $response = $hubspot->crm()->objects()->basicApi()
                ->getPage($objectTypeId, 10, null, implode(',', $schema->getRequiredProperties()))
            ;

            if (count($response->getResults()) > 0) {
                $io->listing($response->getResults());
            } else {
                $io->writeln('No objects in this scheme.');
            }
        }

        return Command::SUCCESS;
    }

    protected function propertiesNamesToString(array $properties)
    {
        $names = array_map(
            function ($property) {
                return $property->getName();
            },
            $properties
        );

        return implode(',', $names);
    }
}
