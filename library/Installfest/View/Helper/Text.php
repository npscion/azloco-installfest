<?php
/**
 * Installfest View Helper Text
 *
 * Used to cleaner access to {@link Zend_View_Helper_Translate}.
 * With this helper you can just use $this->_(); in viewscripts
 * instead of $this->translate();
 *
 * @category    Installfest
 * @package     Installfest_View
 * @subpackage  Helper
 * @copyright   Copyright (c) 2007, 2008 Zobmo Oy - <http://www.zobmo.com>
 * @license     http://license.rightbrainsolution.com/source/php
 */
class Installfest_View_Helper_Text extends Zend_View_Helper_Translate
{
    /**
     * This method acts as redirecter to {@link Zend_View_Helper_Translate::translate()}
     * method.
     * @return return of Zend_View_Helper_Translate::translate()
     */
    public function Text($messageid = null) {

        return $this->translate($messageid);
    }
    public function pluralize($count, $singular, $plural = false) {
        if (!$plural) $plural = $singular . 's';
        return ($count == 1 ? $singular : $plural);
    }

}
