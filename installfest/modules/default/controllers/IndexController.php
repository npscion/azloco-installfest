<?php
class IndexController extends Zend_Controller_Action
{
    public function init()
    {
      //Layout
      $this->layout = Zend_Layout::getMvcInstance();
      $this->install_form_service = new Installfest_Service_Form_Install();
      $this->search_form_service = new Installfest_Service_Form_Search();
    }

    public function indexAction()
    {
        $this->view->title = 'Installfest Main Page';
    }

    public function installAction()
    {
        $form = $this->install_form_service->generateForm();
        if ($this->getRequest()->isPost()) {
            if ($form->isValid($_POST)) {
                try {
                    $install = $this->install_form_service->processForm($form);
                    $this->_redirect('/default/index/submit/?install='.$install);
                } catch (Exception $e) {
                    echo '<b>Error</b> Submission failed.';
                    $Zend_Debug::dump($e->getMessage());
                }
            }
        }
        $this->view->form = $form;
        $this->view->title = 'Installfest Form Submission';

    }
    public function searchAction()
    {
        $form = $this->search_form_service->generateForm();
        if ($this->getRequest()->isPost()) {
            if ($form->isValid($_POST)) {
                try {
                    $search = $this->search_form_service->processForm($form);
                } catch (Exception $e) {
                    echo '<b>Error</b> Submission failed.';
                    $Zend_Debug::dump($e->getMessage());
                }
            }
        }
        $this->view->form = $form;
        $this->view->result = $search;
    }
    public function submitAction()
    {
          if($this->getRequest()->getParam('install') == 1) {
              echo "Form submission was successful";
          } else {
              echo "Form submission was unsuccessful";
          }
    }
    public function resultAction()
    {

    }
}
