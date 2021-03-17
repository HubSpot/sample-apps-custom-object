<?php

namespace Commands\Schemas;

use Doctrine\Inflector\InflectorFactory;
use Helpers\HubspotClientHelper;
use Helpers\ValidationHelper;
use Symfony\Component\Console\Command\Command;
use HubSpot\Client\Crm\Schemas\Model\ObjectTypeDefinitionPatch;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Traits\ObjectTypeIdCommandArgument;

class UpdateCommand extends Command
{
    use ObjectTypeIdCommandArgument;

    protected static $defaultName = 'schemas:update';

    protected function configure()
    {
        $this->setDescription('Update an object`s schema by objectTypeId (Fully qualified name or object type ID for the target schema).');
        $this->addObjectTypeIdArgument();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $hubspot = HubspotClientHelper::createFactory();

        $objectTypeId = $input->getArgument('objectTypeId');
        $response = $hubspot->crm()->schemas()->CoreApi()->getById($objectTypeId);
        $labels = $response->getLabels();

        $singularLabel = $io->ask(
            'Enter a new singular label for the schema',
            $labels->getSingular(),
            ValidationHelper::getNotEmptyValidator()
        );

        $io->writeln("Updating an object with objectTypeId: {$objectTypeId}");

        $labels->setSingular($singularLabel);
        $labels->setPlural(InflectorFactory::create()->build()->pluralize($singularLabel));
        $schema = new ObjectTypeDefinitionPatch();

        $schema->setLabels($labels);
        $schema->setRequiredProperties($response->getRequiredProperties());

        $updateResponse = $hubspot->crm()->schemas()->CoreApi()->update($objectTypeId, $schema);

        $io->info($updateResponse);

        return Command::SUCCESS;
    }
}
