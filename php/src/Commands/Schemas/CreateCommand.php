<?php

namespace Commands\Schemas;

use Doctrine\Inflector\InflectorFactory;
use Helpers\HubspotClientHelper;
use Helpers\ValidationHelper;
use HubSpot\Client\Crm\Schemas\Model\ObjectSchemaEgg;
use HubSpot\Client\Crm\Schemas\Model\ObjectTypeDefinitionLabels;
use HubSpot\Client\Crm\Schemas\Model\ObjectTypePropertyCreate;
use HubSpot\Client\Crm\Schemas\Model\OptionInput;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(name: 'schemas:create')]
class CreateCommand extends Command
{
    protected $types = [
        'enumeration' => ['booleancheckbox', 'checkbox', 'radio', 'select'],
        'date' => ['date'],
        'dateTime' => ['date'],
        'string' => ['file', 'text', 'textarea'],
        'number' => ['number'],
    ];

    protected function configure()
    {
        $this->setDescription('Create an object`s schema.');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $hubspot = HubspotClientHelper::createFactory();

        $name = $io->ask('Enter a name for the schema', null, ValidationHelper::getNamesValidator());
        $singularLabel = $io->ask('Enter a singular label for the schema', null, ValidationHelper::getNotEmptyValidator());

        $properties = $this->askForProperties($io);
        $io->writeln('Creating an object`s schema...');

        $schema = new ObjectSchemaEgg();
        $schema->setName($name);

        $labels = new ObjectTypeDefinitionLabels();
        $labels->setSingular($singularLabel);
        $labels->setPlural(InflectorFactory::create()->build()->pluralize($singularLabel));
        $schema->setLabels($labels);

        $schema->setProperties($properties['all']);
        $schema->setPrimaryDisplayProperty($properties['all'][0]->getName());
        $schema->setRequiredProperties($properties['required']);

        $response = $hubspot->crm()->schemas()->CoreApi()->create($schema);

        $io->info($response);

        return Command::SUCCESS;
    }

    protected function askForProperties(SymfonyStyle $io): array
    {
        $io->note('You need to add several properties (at least one) for the new schema.');
        $more = true;
        $properties = [];
        $requiredProperties = [];
        do {
            $property = new ObjectTypePropertyCreate();
            $property->setName($io->ask('Enter a name for the property', null, ValidationHelper::getNamesValidator()));
            $property->setLabel(ucfirst($property->getName()));
            if ($io->confirm('Is this property required when creating an object of this type?')) {
                $requiredProperties[] = $property->getName();
            }
            $property->setType($io->choice('Select a type of the property', array_keys($this->types), 'string'));

            $fieldTypes = $this->types[$property->getType()];
            if (count($fieldTypes) > 1) {
                $property->setFieldType($io->choice('Select field type of the property', $fieldTypes, $fieldTypes[0]));
            } else {
                $property->setFieldType($fieldTypes[0]);
            }

            if ('enumeration' == $property->getType()) {
                $property->setOptions($this->askForOptions($io));
            }

            $properties[] = $property;

            $more = $io->confirm('Do you want to add more properties?', false);
        } while ($more);

        return [
            'all' => $properties,
            'required' => $requiredProperties,
        ];
    }

    protected function askForOptions(SymfonyStyle $io): array
    {
        $io->note("Since you've chosen enumeration type of property, you need to add several options (at least one) for the new property.");

        $more = true;
        $options = [];

        do {
            $option = new OptionInput();
            $option->setLabel($io->ask('Enter a label for the option', null, ValidationHelper::getNotEmptyValidator()));
            $option->setValue($io->ask('Enter a value for the option', null, ValidationHelper::getNotEmptyValidator()));

            $options[] = $option;

            $more = $io->confirm('Do you want to add more options for the property?', false);
        } while ($more);

        return $options;
    }
}
