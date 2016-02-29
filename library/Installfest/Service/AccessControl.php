<?php

class Installfest_Service_AccessControl
{
    public function generateAcl()
    {
        $acl = new Zend_Acl();

        $acl->addRole(new Zend_Acl_Role('guest'))
            ->addRole(new Zend_Acl_Role('member'), 'guest')
            ->addRole(new Zend_Acl_Role('admin'));

        Zend_Registry::set('acl', $acl);
    }
}
