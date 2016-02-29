<?php

class Installfest_Service_Form_Install implements Installfest_Interface_FormServiceInterface
{
    public function generateForm($identifier = null)
    {
        $form = new Installfest_Form_Install();
        Zend_Debug::dump("here");
        return $form;
    }

    public function processForm()
    {
        $form_values = $form->getValues();
Zend_Debug::dump("there");
        return true;
    }
}
