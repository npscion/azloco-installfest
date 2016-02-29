<?php

class Installfest_Service_Authentication implements Zend_Auth_Adapter_Interface
{
    private $dbAdapter = new Zend_Db_Adapter_Pdo_Sqlite(array('installfest' =>
                                                  'user'));
    public function __construct($username, $password)
    {
        $this->username = $username;
        $this->password = $password;
    }

    public function authenticate()
    {
        $this->adapter->setIdentityColumn('username');
        $this->adapter->setCredentialColumn('password');

        $this->adapter->setIdentity($username);
        $this->adapter->setCredential($password);

        $auth_result = $this->auth->authenticate($this->adapter);

        if ($auth_result->isValid()) {
            $response_message->setResult(true);
            $response_message->setMessage('Login successful');
            $response_message->setMessageType('success');
        }
    }
}
