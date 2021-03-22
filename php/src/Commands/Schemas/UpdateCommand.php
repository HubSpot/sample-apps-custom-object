<?php

namespace Commands\Schemas;

use Doctrine\Inflector\InflectorFactory;
use Helpers\HubspotClientHelper;
use Helpers\SchemaIdConverter;
use Helpers\ValidationHelper;
use HubSpot\Client\Crm\Schemas\Model\ObjectTypeDefinitionPatch;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Traits\SchemaIdCommandArgument;

class UpdateCommand extends Command
{
    use SchemaIdCommandArgument;

    protected static $defaultName = 'schemas:update';

    protected function configure()
    {
        $this->setDescription('Update an object`s schema by schemaId.');
        $this->addSchemaIdArgument();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $hubspot = HubspotClientHelper::createFactory();
        $schemaId = $input->getArgument('schemaId');
        $objectTypeId = SchemaIdConverter::toObjectTypeId($schemaId);

        $response = $hubspot->crm()->schemas()->CoreApi()->getById($objectTypeId);
        $labels = $response->getLabels();

        $singularLabel = $io->ask(
            'Enter a new singular label for the schema',
            $labels->getSingular(),
            ValidationHelper::getNotEmptyValidator()
        );

        $io->writeln("Updating an object with objectTypeId: {$schemaId}");

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
