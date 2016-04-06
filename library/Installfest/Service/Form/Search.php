<?php

class Installfest_Service_Form_Search implements Installfest_Interface_FormServiceInterface
{
    public function generateForm($identifier = null)
    {
        $form = new Installfest_Form_Search();
        return $form;
    }

    public function processForm($form)
    {
        $form_values = $form->getValues();
        $connect=mysqli_connect('localhost', 'root', '', 'installfest');

        if(mysqli_connect_errno($connect)) {
            echo 'Failed to connect';
        }
        $result = $connect->query("SELECT * FROM install_catalog where $form_values[search_by] = '$form_values[search_query]'");
        $connect->close();
        return $result;
    }
}

?>
