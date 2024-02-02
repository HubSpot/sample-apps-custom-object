<?php

namespace Helpers;

use HubSpot\Discovery\Discovery;
use HubSpot\Factory;

class HubspotClientHelper
{
    public static function createFactory(): Discovery
    {
        if (!empty($_ENV['HUBSPOT_PRIVATE_APP_ACCESS_TOKEN'])) {
            return Factory::createWithAccessToken($_ENV['HUBSPOT_PRIVATE_APP_ACCESS_TOKEN']);
        }

        throw new \Exception('Please specify Access token.');
    }
}
