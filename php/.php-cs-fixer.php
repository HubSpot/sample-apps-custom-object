<?php

$finder = (new PhpCsFixer\Finder())
    ->in([__DIR__])
    ->exclude(['vendor']);

return (new PhpCsFixer\Config())
    ->setFinder($finder)
    ->setRules([
        '@PSR2' => true,
        '@PhpCsFixer' => true,
    ]);
