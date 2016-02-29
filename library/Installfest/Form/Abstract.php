<?php
/**
 * Installfest_Form_Abstract
 * Provide common filtering and decoration facilities for Installfest forms
 *
 * @package     Auction
 * @category    Model
 * @author      Tarek Mahmud Apu <apu.eee@gmail.com>
 */
abstract class Installfest_Form_Abstract extends Zend_Form
{
    /**
    * Add Options of a select box from two-dimentional array.
    * Each elements of 1st level array will be added as an '<option>' of select box.
    * The $valueField index of 2nd level array will be used as value attribute of option
    * and $captionField will be displayed as option text.
    *
    * @author  Tarek Mahmud Apu <apu.eee@gmail.com>
    * @access  protected
    * @param   Zend_Form_Element $field         the select field
    * @param   array             $options       options array
    * @param   string|null       $blankOption   first and empty element of selectbox
    * @param   string            $valueField    select box's value attribute.
    * @param   string            $captionField  select box's value.
    * @example $form->_addOptions($mySelect, $resultArray, 'Choose a Country', 'country_code', 'country_name');
    * @return  void
    */
    protected function _addOptions(Zend_Form_Element_Select $field, array $options, $blankOption = null, $valueField = 'id', $captionField = 'name')
    {
        if($blankOption)
        {
            $field->addMultiOption('', $blankOption );
        }
        if($valueField == NULL)
        {
           foreach($options as $key => $value)
           {
                $field->addMultiOption($value, $value);
           }
        }
        else
        {
            foreach($options as $option)
            {
                $field->addMultiOption($option[$valueField], $option[$captionField]);
            }
        }
    }

    /**
    * Add common filters, classes and setRequired(if needed)
    *
    * @author  Tarek Mahmud Apu <apu.eee@gmail.com>
    * @access  protected
    * @param   Zend_Form_Element  $field the form field
    * @param   boolean            $required  if true, the field will be set as required
    * @param   boolean            $filter    if true, StripTags and StringTrim filters will be applied
    * @return  void
    */
    protected function _addCommonFilters(
        Zend_Form_Element $field,
        $required = false,
        $filter = true
    ) {
        if($required) {
            $field->setRequired(true);
        }

        $field->setAttrib('class', 'form-control');

        if($filter) {
            $field->addFilter('StripTags');
            $field->addFilter('StringTrim');
        }
    }

    /**
    * Add a submit button with required classes and attributes for Auction
    *
    * @author  Tarek Mahmud Apu <apu.eee@gmail.com>
    * @access  protected
    * @return  void
    */
    protected function _addSubmit()
    {
        $submit = new Zend_Form_Element_Submit('submit', array('disableLoadDefaultDecorators' => true) );
        $submit->setAttrib('class', 'button-go-signup')
               ->setLabel(' ');

        $this->addElement($submit);
        return $this;
    }

    protected function changeMarkUp( $tag = 'dl')
    {
       if($tag == 'div')
       {
            // Clear default decorators
            $this->clearDecorators();

            $this->addDecorator('FormElements')
                 ->setAttrib('id', 'form')
                 ->addDecorator('HtmlTag', array('tag' => '<div>', 'class' => 'form'))
                 ->addDecorator('Form');


            $this->setElementDecorators(array(
                array('ViewHelper'),
                array('Errors'),
                array('Description', array('tag' => 'p', 'class'=>'zend-hint')),
                array('HtmlTag', array('tag' => 'div', 'class'=>'value')),
                array('Label', array('tag'=>'null')),
                array(array('row' => 'HtmlTag'), array('tag' => 'div', 'class'=>'row')),
            ));
       }
       else
       {
            // Clear default decorators
            $this->clearDecorators();

            $this->setElementDecorators(array(
                array('ViewHelper'),
                array('Errors'),
                array('Description', array('tag' => 'p', 'class'=>'zend-hint')),
                array('Label', array('tag' => null))
            ));
       }

        return $this;
    }

    public function setElementValue($element, $value)
    {
        $this->getElement($element)->setValue($value);
    }
}
