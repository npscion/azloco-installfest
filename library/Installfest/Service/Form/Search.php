<?php  $connect=mysqli_connect('localhost', 'root', '', 'installfest');

  if(mysqli_connect_errno($connect)) {
      echo 'Failed to connect';
  }
  $sql = "SELECT * FROM install_catalog where $_POST[search_by] = '$_POST[search_query]'";


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
        $sql = "SELECT * FROM install_catalog where $form_values[search_by] = '$form_values[search_query]'";
        $connect->close();

        return $sql;
    }
}
