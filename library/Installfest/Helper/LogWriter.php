<?php
/**
 * Installfest_Helper_LogWriter
 *
 * This is a wrapper model to write messages to Zend_Log_Write_Firebug.
 * This model ensures that,  log will be written  to firebug only when 'logger' is registered with Zend_Registry.
 * Otherwise nothing will happend.
 *
 * @author	Anis uddin Ahmad <anisniit@gmail.com>
 * @version  1.0
 */
class Installfest_Helper_LogWriter
{
	/**
	* @var Zend_Log_Writer_Firebug 	The logger object
	*/
	protected $logger;

	/**
	 * The constructor
	 * NOTE : You must have a reference of Zend_Log in 'logger' index of Zend_Registry to initializ this class
	 * @return	void
	 */
	function __construct()
	{
		if(Zend_Registry::isRegistered('logger'))
		{
			$this->logger = Zend_Registry::get('logger');
		}
		else
		{
			$this->logger = false;
		}
	}

	/*
	* Write the informations using Zend_Log_Friter_Firebug
	*
	*@param	   mixed	The message to log
	*@param	   Zend_Log constant	log priority, default is Zend_Log::INFO
	*@param	   string	The function name of logger to use
	*@return   void
	*/
    public function write($info, $priority = Zend_Log::INFO, $function = 'log')
    {
		if($this->logger)
		{
			// Write the information to log using logger's function
			$this->logger->$function($info, $priority);
		}
		//else do nothing
    }
}
