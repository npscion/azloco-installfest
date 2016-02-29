<?php

require_once('appstage.php');
date_default_timezone_set('America/Phoenix');

error_reporting(E_ALL ^ E_NOTICE);

set_include_path(realpath(__DIR__ . '/../library') . PATH_SEPARATOR . get_include_path());

// Composer autoloader for vendor dependencies
require_once(__DIR__ . '/../vendor/autoload.php');

Installfest_Bootstrap::start('../installfest/config/config.xml');
