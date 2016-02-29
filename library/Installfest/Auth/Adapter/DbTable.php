<?php

class Installfest_Auth_Adapter_DbTable extends Zend_Auth_Adapter_DbTable
{
    public function __construct (
        $zend_db = null,
        $table_name = null,
        $identity_column = null,
        $credential_column = null
    ) {
        parent::__construct(
            $zend_db,
            $table_name,
            $identity_column,
            $credential_column
        );
    }

    protected function _authenticateValidateResult($resultIdentity)
    {
        //Check that hash value is correct
        $hash = new PasswordHash(10, false);
        $check = $hash->CheckPassword(
            $this->_credential,
            $resultIdentity['password_hash']
        );
        if (!$check) {
            return parent::_authenticateValidateResult($resultIdentity);
        }

        $this->_resultRow = $resultIdentity;

        $this->_authenticateResultInfo['code'] =
            Zend_Auth_Result::SUCCESS;
        $this->_authenticateResultInfo['messages'][] =
            'Authentication successful.';
        return $this->_authenticateCreateAuthResult();
    }
}
