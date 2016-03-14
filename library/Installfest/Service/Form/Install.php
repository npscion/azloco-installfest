<?php

class Installfest_Service_Form_Install implements Installfest_Interface_FormServiceInterface
{
    public function generateForm($identifier = null)
    {
        $form = new Installfest_Form_Install();
        return $form;
    }

    public function processForm($form)
    {
        try {
            $form_values = $form->getValues();
            //TODO Real authentication
            $connect=mysqli_connect('localhost', 'root', '', 'installfest');
            $name = $form_values['name'];
            $date = date("Y-m-d H:i:s");
            $helper_name = $form_values['helper_name'];
            $email = $form_values['email'];
            $computer_make = $form_values['computer_make'];
            $computer_model_number = $form_values['computer_model_number'];
            $memory_size = $form_values['memory_amount'] . " " . $form_values['size_unit'];
            $disk_size = $form_values['disk_size'] . " " . $form_values['size_unit_hd'];
            $disk_free_space = $form_values['disk_free_space']. " " . $form_values['size_unit_hd_free'];
            $backup = $form_values['backup'];
            $old_os = $form_values['old_os'];
            $requested_os = $form_values['requested_os'];
            $dual_boot = $form_values['dual_boot'];
            $disk_cleanup = $form_values['disk_cleanup'];
            $disk_defrag = $form_values['disk_defrag'];
            $user_confirmation = $form_values['user_confirmation'];
            $resource_list = $form_values['resource_list'];
            $cpu_model_number = $form_values['cpu_model_number'];
            $gpu_model_number = $form_values['gpu_model_number'];
            $wifi = $form_values['wifi'];
            $wifi_model_number = $form_values['wifi_model_number'];
            $ethernet = $form_values['ethernet'];
            $ethernet_model_number = $form_values['ethernet_model_number'];
            $installed_os = $form_values['installed_os'];
            $installed_os_version = $form_values['installed_os_version'];
            $notes = $form_values['notes'];
            $lightweight_linux = $form_values['lightweight_linux'];
            $updated = $form_values['updated'];

            echo "<br>";
            if($wifi == 1 && $wifi_model_number == null) {
                echo "Error: You must specify a wifi model number when selecting wifi.<br></br>";
            } else if(mysqli_connect_errno($connect)) {
                echo 'Failed to connect';
            }
            $sql = "INSERT INTO install_catalog (submit_date, name, helper_name, email, computer_make, computer_model_number, memory_size, disk_size, disk_free_space, backup, old_os, requested_os, dual_boot, disk_cleanup, disk_defrag, cpu_model_number, gpu_model_number, wifi, wifi_model_number, ethernet, ethernet_model_number, installed_os, installed_os_version, notes, lightweight_linux, updated, user_confirmation, resource_list)
            VALUES ('$date', '$name', '$helper_name', '$email', '$computer_make', '$computer_model_number', '$memory_size', '$disk_size', '$disk_free_space', '$backup', '$old_os', '$requested_os', '$dual_boot', '$disk_cleanup', '$disk_defrag', '$cpu_model_number', '$gpu_model_number', '$wifi', '$wifi_model_number', '$ethernet', '$ethernet_model_number', '$installed_os', '$installed_os_version', '$notes', '$lightweight_linux', '$updated', '$user_confirmation', '$resource_list')";

            if ($connect->query($sql) == TRUE) {
                echo "Submission was successful<br></br>";
            } else {
                echo "Error ";
                Zend_Debug::dump(mysqli_errno($connect) . ": " . mysqli_error($connect) . "\n");die;
            }

            $connect->close();

            return "Form submission succeeded.";
        } catch (Exception $e) {
            return "Form submission failed.";
        }
    }
}
