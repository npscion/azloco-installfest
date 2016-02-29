<?php
/**
 * Installfest Default module ErrorController
 *
 * @package     Installfest
 * @subpackage  Controller
 * @copyright   Copyright (c) 2007, 2008 Zobmo Oy - <http://www.zobmo.com>
 * @license     http://license.rightbrainsolution.com/source/php
 */

/**
 * Zobmo Default module ErrorController
 *
 * @category    Zobmo
 * @copyright   Copyright (c) 2007, 2008 Zobmo - <http://www.zobmo.com>
 * @license     http://license.zobmo.com/source/php
 */
class ErrorController extends Zend_Controller_Action
{
     /**
     * This action handles
     *    - Application errors
     *    - Errors in the controller chain arising from missing
     *      controller classes and/or action methods
     */
    public function init()
    {
        $this->view->title = 'Error' ;
        $this->view->javascripts = array();
        $this->view->stylesheets = array();
        $this->logger = new Installfest_Helper_LogWriter();
    }


    public function errorAction()
    {
        $errors = $this->_getParam('error_handler');
        switch ($errors->type) {
            case Zend_Controller_Plugin_ErrorHandler::EXCEPTION_NO_CONTROLLER:
            case Zend_Controller_Plugin_ErrorHandler::EXCEPTION_NO_ACTION:
                // 404 error -- controller or action not found
                $this->getResponse()->setRawHeader('HTTP/1.1 404 Not Found');
                $this->getHelper('viewRenderer')->setNoRender(true);
                $this->getResponse()->clearBody();
                $this->render('error');
                break;
            default:
                // Application error - send 500 headers with the html document.
                $this->getResponse()->setRawHeader('HTTP/1.1 500 Internal Server Error');

                $this->getHelper('viewRenderer')->setNoRender(true);
                $this->getResponse()->clearBody();
                $this->render('application_error');


                if(Zend_Registry::get('config')->admintools->webmaster->enable_stream)
                {
                    $log = new Zend_Log(new Zend_Log_Writer_Stream(ROOT_DIR . Zend_Registry::get('config')->admintools->webmaster->logpath));
                    $log->debug($errors->exception->getMessage() . PHP_EOL . $errors->exception->getTraceAsString());
                }

                // Write to firebug as well (if debug is on)
                $this->logger->write('Following error occured : ', Zend_Log::ERR);
                $this->logger->write($errors->exception->getMessage());

                break;
        }
    }
}
