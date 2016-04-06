<?php

class Installfest_Form_Search extends Zend_Form
{
    function __construct()
    {
        parent::__construct();

        return $this->buildForm();
    }

    private function buildForm()
    {
        $search_by = new Zend_Form_Element_Select('search_by');
        $search_by->setLabel('Search by:');
        $search_by->setMultiOptions(array('name' => 'Name', 'helper_name' => 'Helper Name', 'email' => 'Email', 'computer_make' => 'Computer Make', 'computer_model_number' => 'Computer Model Number', 'wifi_model_number' => 'Wifi Model Number', 'ethernet_model_number' => 'Ethernet Model Number', 'cpu_model_number' => 'CPU Model Number', 'gpu_model_number' => 'GPU Model Number', 'installed_os' => 'Installed OS', 'notes' => 'Notes'));
        $search_by->setAttribs(
            array(
                'class' => 'form-control',
                'placeholder' => ''
            )
        );
        $search_query = new Zend_Form_Element_Text('search_query');
        $search_query->addValidator('StringLength', false, array(3, 200));
        $search_query->setErrorMessages(array('Your search should be between 3 and 200 characters long'));
        $search_query->setRequired(true);
        $search_query->setAttribs(
            array(
                'class' => 'form-control',
                'placeholder' => ''
            )
        );

        $submit = new Zend_Form_Element_Submit('submit');
        $submit->setAttrib('id', 'submit-button')
               ->setAttrib('class', 'button')
               ->setLabel('Form Lookup');

        $this->addElements(array($search_by, $search_query, $submit));

        return $this;
    }
}
