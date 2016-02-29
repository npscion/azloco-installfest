<?php
class IndexController extends Zend_Controller_Action
{
    public function init()
    {
      //Layout
      $this->layout = Zend_Layout::getMvcInstance();
      $this->install_form_service = new Installfest_Service_Form_Install();
    }

    public function indexAction()
    {
      echo "test";
      //$form = $this->install_form_service->generateForm();
      //$this->view->form = $form;
        $this->view->title = 'Installfest Main Page';
    }

    public function installAction()
    {
        $form = $this->install_form_service->generateForm();

        if ($this->getRequest()->isPost()) {
            if ($form->isValid($_POST)) {
                try {
                    $install = $this->install_form_service->processForm($form);
                    $form = $this->install_form_service->generateForm();

                } catch (Exception $e) {
                    echo '<b>Error</b> Submission failed.';
                    $Zend_Debug::dump($e->getMessage());
                }
            } else {
                echo 'Input errors detected. Please verify fields.';
            }
        }
        //Zend_Debug::dump("there");die;
        $this->view->form = $form;
        $this->view->title = 'Installfest Form Submission';

    }
    public function searchAction()
    {
    }
}
