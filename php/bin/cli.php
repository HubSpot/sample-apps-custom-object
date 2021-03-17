#!/usr/bin/env php
<?php

require __DIR__.'/../vendor/autoload.php';

use Commands\InitCommand;
use Commands\Objects\{
    CreateCommand as ObjectsCreateCommand
};
use Commands\Schemas\CreateCommand as SchemasCreateCommand;
use Commands\Schemas\DeleteCommand as SchemasDeleteCommand;
use Commands\Schemas\GetCommand as SchemasGetCommand;
use Commands\Schemas\UpdateCommand as SchemasUpdateCommand;
use Symfony\Component\Console\Application;

if (file_exists(__DIR__.'/../.env')) {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__.'/../');
    $dotenv->load();
}

$application = new Application();
$application->add(new InitCommand());
$application->add(new ObjectsCreateCommand());
$application->add(new SchemasCreateCommand());
$application->add(new SchemasDeleteCommand());
$application->add(new SchemasGetCommand());
$application->add(new SchemasUpdateCommand());

$application->run();
