#!/usr/bin/env php
<?php

require __DIR__.'/../vendor/autoload.php';

use Commands\InitCommand;
use Commands\Schemas\CreateCommand;
use Commands\Schemas\DeleteCommand;
use Commands\Schemas\GetCommand;
use Commands\Schemas\UpdateCommand;
use Symfony\Component\Console\Application;

if (file_exists(__DIR__.'/../.env')) {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__.'/../');
    $dotenv->load();
}

$application = new Application();
$application->add(new InitCommand());
$application->add(new CreateCommand());
$application->add(new DeleteCommand());
$application->add(new GetCommand());
$application->add(new UpdateCommand());

$application->run();
