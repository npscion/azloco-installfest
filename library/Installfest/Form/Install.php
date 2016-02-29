<?php

class Installfest_Form_Install extends Installfest_Form_Abstract
{
    function __construct()
    {
        return $this->buildForm();
    }

    private function buildForm()
    {
        $name = new Zend_Form_Element_Text('name');
        $name->setLabel('Name');
        $name->addValidator('StringLength', false, array(3, 200));
        $name->setErrorMessages(array('Your name should be between 3 and 200 characters long'));
        $name->setRequired(false);
        $name->setAttribs(
            array(
                'class' => 'form-control',
                'placeholder' => ''
            )
        );
        $helper_name = new Zend_Form_Element_Text('helper_name');
        $helper_name->setLabel('helper_name');
        $helper_name->addValidator('StringLength', false, array(3, 200));
        $helper_name->setErrorMessages(array('Your name should be between 3 and 200 characters long'));
        $helper_name->setRequired(true);
        $helper_name->setAttribs(
            array(
                'class' => 'form-control',
                'placeholder' => ''
            )
        );
        $email = new Zend_Form_Element_Text('email');
        $email->setLabel('Email');
        $email->addValidator(new Zend_Validate_EmailAddress);
        $email->setRequired(false);
        $email->setAttribs(
            array(
                'class' => 'form-control',
                'placeholder' => ''
            )
        );
        $computer_make = new Zend_Form_Element_Text('computer_make');
        $computer_make->setLabel('computer_make');
        $computer_make->addValidator('StringLength', false, array(3, 200));
        $computer_make->setErrorMessages(array('Computer make should be between 3 and 200 characters long'));
        $computer_make->setRequired(true);
        $computer_make->setAttribs(
            array(
                'class' => 'form-control',
                'placeholder' => ''
            )
        );
        $computer_model = new Zend_Form_Element_Text('computer_model');
        $computer_model->setLabel('computer_model');
        $computer_model->addValidator('StringLength', false, array(5, 200));
        $computer_model->setErrorMessages(array('Computer model should be between 3 and 200 characters long'));
        $computer_model->setRequired(true);
        $computer_model->setAttribs(
            array(
                'class' => 'form-control',
                'placeholder' => ''
            )
        );
        $memory_amount = new Zend_Form_Element_Text('memory_amount');
        $memory_amount->setLabel('memory_amount');
        $memory_amount->addValidator(new Zend_Validate_Between(array('min' => 0, 'max' => 1024)));
        $memory_amount->setRequired(true);
        $memory_amount->setAttribs(
            array(
                'class' => 'form-control',
                'placeholder' => ''
            )
        );
        $size_unit = new Zend_Form_Element_Select('size_unit');
        $size_unit->setLabel('GB/MB');
        $size_unit->setMultiOptions(array('gb'=>'GB', 'mb'=>'MB'));
        $size_unit->setRequired(true);
        $size_unit->addValidator('NotEmpty', true);
        $size_unit->setAttribs(
            array(
                'class' => 'form-control',
                'placeholder' => ''
            )
        );
        $disk_size = new Zend_Form_Element_Text('disk_size');
        $disk_size->setLabel('disk_size');
        $disk_size->addValidator(new Zend_Validate_Between(array('min' => 0, 'max' => 1000)));
        $disk_size->setRequired(true);
        $disk_size->setAttribs(
            array(
                'class' => 'form-control',
                'placeholder' => ''
            )
        );
        $disk_free_space = new Zend_Form_Element_Text('disk_free_space');
        $disk_free_space->setLabel('disk_free_space');
        $disk_free_space->addValidator(new Zend_Validate_Between(array('min' => 0, 'max' => $disk_size)));
        $disk_free_space->setErrorMessages(array('Disk free space cannot be less than 1 or greater than disk size.'));
        $disk_free_space->setRequired(true);
        $disk_free_space->setAttribs(
            array(
                'class' => 'form-control',
                'placeholder' => ''
            )
        );
        $backup = new Zend_Form_Element_Radio('backup', array('value' => 'none'));
        $backup->setLabel('backup');
        $backup->setMultiOptions(array(
            'none' => 'No Backup',
            'partial' => 'Partial Backup (Critical Files)',
            'full' => 'Full Backup'
        ));
        $backup->setRequired(true);
        $backup->addValidator('NotEmpty', true);
        $backup->setAttribs(
            array(
                'class' => 'form-control',
                'placeholder' => ''
            )
        );
        $disk_cleanup = new Zend_Form_Element_Checkbox('disk_cleanup');
        $disk_cleanup->setLabel('Disk Cleanup');
        $disk_cleanup->setRequired(false);
        $disk_cleanup->setAttribs(
            array(
                'class' => 'form-control',
                'placeholder' => ''
            )
        );
        $disk_defrag = new Zend_Form_Element_Checkbox('disk_defrag');
        $disk_defrag->setLabel('Disk Defragmented');
        $disk_defrag->setRequired(false);
        $disk_defrag->setAttribs(
            array(
                'class' => 'form-control',
                'placeholder' => ''
            )
        );
        $old_os = new Zend_Form_Element_Text('old_os');
        $old_os->setLabel('Current operating system');
        $old_os->addValidator('StringLength', false, array(3, 200));
        $old_os->setErrorMessages(array('Current operating system should be between 3 and 200 characters long'));
        $old_os->setRequired(true);
        $old_os->setAttribs(
            array(
                'class' => 'form-control',
                'placeholder' => ''
            )
        );
        $requested_os = new Zend_Form_Element_Text('requested_os');
        $requested_os->setLabel('Requested operating system');
        $requested_os->addValidator('StringLength', false, array(3, 200));
        $requested_os->setErrorMessages(array('Requested operating system should be between 3 and 200 characters long'));
        $requested_os->setRequired(false);
        $requested_os->setAttribs(
            array(
                'class' => 'form-control',
                'placeholder' => ''
            )
        );
        $dual_boot = new Zend_Form_Element_Radio('dual_boot', array('value' => 'no'));
        $dual_boot->setLabel('Dual Boot Linux and Windows');
        $dual_boot->setMultiOptions(array(
            'no' => 'Remove Windows',
            'yes' => 'Dual Boot Windows and Linux'
        ));
        $dual_boot->setRequired(true);
        $dual_boot->addValidator('NotEmpty', true);
        $dual_boot->setAttribs(
            array(
                'class' => 'form-control',
                'placeholder' => ''
            )
        );
        $wifi = new Zend_Form_Element_Checkbox('wifi');
        $wifi->setLabel('Wifi');
        $wifi->setRequired(false);
        $wifi->setAttribs(
            array(
                'class' => 'form-control',
                'placeholder' => ''
            )
        );
        $wifi_model_number = new Zend_Form_Element_Text('wifi_model_number');
        $wifi_model_number->setLabel('Wifi model number');
        if($wifi->isChecked()) {
            $wifi_model_number->addValidator('StringLength', false, array(5, 200));
            $wifi_model_number->setErrorMessages(array('Wifi model number should be between 3 and 200 characters long'));
            $wifi_model_number->setRequired(true);
        } else {
            $wifi_model_number->addValidator('NotEmpty', false);
            $wifi_model_number->setErrorMessages(array('Wifi must be checked to submit a wifi model number'));
            $wifi_model_number->setRequired(false);
        }
        $wifi_model_number->setAttribs(
            array(
                'class' => 'form-control',
                'placeholder' => ''
            )
        );
        $ethernet = new Zend_Form_Element_Checkbox('ethernet');
        $ethernet->setLabel('Ethernet');
        $ethernet->setRequired(false);
        $ethernet->setAttribs(
            array(
                'class' => 'form-control',
                'placeholder' => ''
            )
        );
        $ethernet_model_number = new Zend_Form_Element_Text('ethernet_model_number');
        $ethernet_model_number->setLabel('Ethernet model number');
        if($ethernet->isChecked()) {
            $ethernet_model_number->addValidator('StringLength', false, array(5, 200));
            $ethernet_model_number->setErrorMessages(array('Ethernet model number should be between 3 and 200 characters long'));
            $ethernet_model_number->setRequired(true);
        } else {
            $ethernet_model_number->addValidator('NotEmpty', false);
            $ethernet_model_number->setErrorMessages(array('Ethernet must be checked to submit a ethernet model number'));
            $ethernet_model_number->setRequired(false);
        }
        $ethernet_model_number->setAttribs(
            array(
                'class' => 'form-control',
                'placeholder' => ''
            )
        );
        $cpu_model_number = new Zend_Form_Element_Text('cpu_model_number');
        $cpu_model_number->setLabel('CPU model number');
        $cpu_model_number->addValidator('StringLength', false, array(5, 200));
        $cpu_model_number->setErrorMessages(array('CPU model number should be between 5 and 200 characters long'));
        $cpu_model_number->setRequired(true);
        $cpu_model_number->setAttribs(
            array(
                'class' => 'form-control',
                'placeholder' => ''
            )
        );
        $gpu_model_number = new Zend_Form_Element_Text('gpu_model_number');
        $gpu_model_number->setLabel('GPU model number');
        $gpu_model_number->addValidator('StringLength', false, array(5, 200));
        $gpu_model_number->setErrorMessages(array('GPU model number should be between 5 and 200 characters long'));
        $gpu_model_number->setRequired(true);
        $gpu_model_number->setAttribs(
            array(
                'class' => 'form-control',
                'placeholder' => ''
            )
        );
        $installed_os = new Zend_Form_Element_Text('installed_os');
        $installed_os->setLabel('Installed operating system');
        $installed_os->addValidator('StringLength', false, array(3, 200));
        $installed_os->setErrorMessages(array('Linux distro installed should be between 3 and 200 characters long'));
        $installed_os->setRequired(true);
        $installed_os->setAttribs(
            array(
                'class' => 'form-control',
                'placeholder' => ''
            )
        );
        $installed_os_version = new Zend_Form_Element_Text('installed_os_version');
        $installed_os_version->setLabel('Installed operating system version');
        $installed_os_version->addValidator('StringLength', false, array(1, 200));
        $installed_os_version->setErrorMessages(array('Version should be between 1 and 200 characters long'));
        $installed_os_version->setRequired(true);
        $installed_os_version->setAttribs(
            array(
                'class' => 'form-control',
                'placeholder' => ''
            )
        );
        $notes = new Zend_Form_Element_Textarea('notes');
        $notes->setLabel('notes');
        $notes->setAttribs(array('rows' => 3, 'cols' => 42));
        $notes->addValidator('StringLength', false, array(0, 400));
        $notes->setErrorMessages(
            array(
                'Notes may not exceed 400 character limit.',
            )
        );
        $notes->setAttribs(
            array(
                'class' => 'form-control',
                'placeholder' => ''
            )
        );
        $lightweight_linux = new Zend_Form_Element_Checkbox('lightweight_linux');
        $lightweight_linux->setLabel('Lightweight Linux');
        $lightweight_linux->setRequired(false);
        $lightweight_linux->setAttribs(
            array(
                'class' => 'form-control',
                'placeholder' => ''
            )
        );
        $updated = new Zend_Form_Element_Checkbox('updated');
        $updated->setLabel('Updated');
        $updated->setRequired(false);
        $updated->setAttribs(
            array(
                'class' => 'form-control',
                'placeholder' => ''
            )
        );
        $resource_list = new Zend_Form_Element_Checkbox('resource_list');
        $resource_list->setLabel('Provided Resource List');
        $resource_list->setRequired(false);
        $resource_list->setAttribs(
            array(
                'class' => 'form-control',
                'placeholder' => ''
            )
        );
        $ethernet = new Zend_Form_Element_Checkbox('user_confirmation');
        $ethernet->setLabel('User able to reboot and log into each operating system');
        $ethernet->setRequired(false);
        $ethernet->setAttribs(
            array(
                'class' => 'form-control',
                'placeholder' => ''
            )
        );
        $submit = new Zend_Form_Element_Submit('submit');
        $submit->setAttrib('id', 'submit-button')
               ->setAttrib('class', 'button')
               ->setLabel('SUBMIT');

        $this->addElements(array($name, $helper_name, $email, $computer_make, $computer_model,
            $memory_amount, $size_unit, $disk_size, $disk_free_space, $backup, $disk_cleanup,
            $disk_defrag, $old_os, $requested_os, $dual_boot, $wifi, $wifi_model_number, $ethernet,
            $ethernet_model_number, $cpu_model_number, $gpu_model_number, $installed_os,
            $installed_os_version, $notes, $lightweight_linux, $updated, $resource_list, $ethernet,
            $notes, $submit));

        return $this;
    }
}
