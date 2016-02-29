<?php

class Installfest_Bootstrap
{
    public static $frontController;
    public static $registry;
    public static $configPath;
    public static $config;
    public static $route;
    public static $log_queries;

    public static function start($configPath)
    {
        self::$configPath = $configPath;

        self::$config = new Zend_Config_Xml(self::$configPath, APPSTAGE);

        Zend_Registry::set('config', self::$config);

        self::setupEnvironment();
        self::prepare();

        //self::setupAcl();
        self::setupGlobals();
        self::setupNavigation();
        $response = self::$frontController->dispatch();
        self::sendResponse($response);
    }

    public static function setupEnvironment()
    {
        $environment = self::$config->environment;

        date_default_timezone_set($environment->default_timezone);
        self::$log_queries = (self::$config->environment->log_queries)
            ? true
            : false;
    }

    public static function prepare()
    {
        //Installfest_StaticLocator::getInstance()->getSession();

        self::$registry = Zend_Registry::getInstance();
        self::$registry->set('siteInfo', self::$config->site);
        self::$registry->set('path', self::$config->path);
        self::$registry->set('perpage', '12');
        self::$registry->set('config', self::$config);

        self::setupFrontController();
        self::setupDatabase();
        //self::setupZendPaginatorCache();
        self::setupView();
        self::setRoutes();
    }

    public static function setupFrontController()
    {
        self::$frontController = Zend_Controller_Front::getInstance();
        //self::$frontController->registerPlugin(new Installfest_Controller_Plugin_Authorization());
        self::$frontController->returnResponse(true);
        self::$frontController->addModuleDirectory(
            ROOT_DIR.'/installfest/modules/'
        );

        self::$frontController->setBaseUrl(self::$config->site->baseurl);
    }

    public static function setupView()
    {
        $view = new Zend_View();
        $view->setEncoding('UTF-8');

        $view->addHelperPath(
            ROOT_DIR.self::$config->path->library.'/Installfest/View/Helper',
            'Installfest_View_Helper'
        );

        $view->addScriptPath('../installfest/modules/default/views/partials');

        $view->assign('appstage', APPSTAGE);

        Zend_Layout::startMvc(
            array('layoutPath' => '../installfest/modules/default/views/layouts')
        );

        $viewRenderer = new Zend_Controller_Action_Helper_ViewRenderer($view);
        Zend_Controller_Action_HelperBroker::addHelper($viewRenderer);
    }

    public static function setupDatabase()
    {
         Zend_Db::factory(self::$config->database);
    }

    public static function setRoutes()
    {
        $router = self::$frontController->getRouter();
        // Define routing roles
        $routes = array();
        $routes['search'] = new Zend_Controller_Router_Route(
            'search',
            array(
                'module'=>'default',
                'controller' => 'index',
                'action' => 'search'
            )
        );

        if(count($routes) > 0)
        {
            foreach($routes as $key => $value)
            {
                $router->addRoute($key,$value);
            }
        }
    }

    /*public static function setupAcl()
    {
        $acs = Installfest_StaticLocator::getInstance()->getAccessControlService();
        $acs->generateAcl();
    }*/

    public static function setupGlobals()
    {
        /*$setting_mapper = Installfest_StaticLocator::getInstance()->getSettingMapper();

        $setting_query = new Installfest_Model_QueryCondition();
        $setting_query->setReturnType('associative_array');
        $setting_query->setCache(true);
        $setting_query->setCacheName('global_setting');
        $settings = $setting_mapper->getResultSet($setting_query);

        foreach ($settings as $setting) {
            define(strtoupper($setting['code']), $setting['value']);
        }
        define('Installfest_default_S3_HTTPS_ADDRESS', 'https://Installfestauction.s3.amazonaws.com/');

        define('RESERVE_USER_ID', 6835);
        define('RETAIL_STORE_USER_ID', 2);
        define('SYSTEM_USER_ID', 0);
        define('SYSTEM_ADDRESS_ID', 0);

        define('RESET_PASSWORD_MINS', 30);

        // Auction constants
        define('AUCTION_END_HOUR', 20);
        define('AUCTION_END_MIN', 0);
        define('DAILY_START_HOUR', 22);
        define('DAILY_START_MIN', 0);
        define('DAILY_END_HOUR', AUCTION_END_HOUR);
        define('DAILY_END_MIN', AUCTION_END_MIN);
        define('WEEKLY_START_HOUR', 20);
        define('WEEKLY_START_MIN', 30);
        define('WEEKLY_END_HOUR', AUCTION_END_HOUR);
        define('WEEKLY_END_MIN', AUCTION_END_MIN);
        define('MONTHLY_START_HOUR', 20);
        define('MONTHLY_START_MIN', 30);
        define('MONTHLY_END_HOUR', AUCTION_END_HOUR);
        define('MONTHLY_END_MIN', AUCTION_END_MIN);
        define('DAILY_START_PRICE', 1.00);
        define('WEEKLY_RESERVE_ACTIVATION_DAYS', 3);
        define('MONTHLY_RESERVE_ACTIVATION_DAYS', 7);
        define('RESERVE_ACTIVATION_HOUR', 9);
        define('RESERVE_ACTIVATION_MIN', 0);
        define('MAX_RETAIL_ID', 662);

        define("AUTHORIZENET_API_LOGIN_ID", self::$config->authorize->api_id);
        define("AUTHORIZENET_TRANSACTION_KEY", self::$config->authorize->transaction_key);
        define("AUTHORIZENET_SANDBOX", self::$config->authorize->sandbox);

        define("MAILCHIMP_API_KEY", self::$config->mailchimp->api_key);
        define("MAILCHIMP_TEST_LIST_ID", self::$config->mailchimp->test_list_id);
        define("MAILCHIMP_Installfest_LIST_ID", self::$config->mailchimp->Installfest_list_id);
        define("MAILCHIMP_NATIONALS_LIST_ID", self::$config->mailchimp->nationals_list_id);

        define("TROPO_TEXT", "text");
        define("TROPO_VOICE", "voice");
        define("TROPO_API_URL", self::$config->tropo->api_url);
        define("TROPO_TEXT_TOKEN", self::$config->tropo->token->text);
        define("TROPO_VOICE_TOKEN", self::$config->tropo->token->voice);

        define("MANDRILL_API_KEY", self::$config->mandrill->api_key);*/
        define("INSTALLFEST_ROOT_URL", self::$config->site->url);
    }

    public static function setupNavigation()
    {
        $container = new Zend_Navigation();
        $container->addPage(
            array(
                'label'      => 'Installfest',
                'module'     => 'default',
                'controller' => 'index',
                'action'     => 'index',
                'order'      => -100, // make sure home is the first page
                'pages'      => array(
                      array(
                        'label'      => 'Search',
                        'module'     => 'default',
                        'controller' => 'index',
                        'action'     => 'search',
                        'route'      => 'search'
                    )
                )
            )
        );

        Zend_Registry::set('Zend_Navigation', $container);
    }

    public static function sendResponse(Zend_Controller_Response_Http $response)
    {
            $response->sendResponse();
    }
}
