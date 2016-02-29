<?php
/**
 * Zobmo View Helper _
 * 
 * @category    Zobmo
 * @package     Zobmo_View
 * @subpackage  Helper
 * @copyright   Copyright (c) 2007, 2008 Zobmo Oy - <http://www.zobmo.com>
 * @license     http://license.zobmo.com/source/php
 * @version     $Id$
 */

/**
 * Zobmo View Helper _
 *
 * Used to cleaner access to {@link Zend_View_Helper_Translate}.
 * With this helper you can just use $this->_(); in viewscripts
 * instead of $this->translate();
 *
 * @category    Zobmo
 * @package     Zobmo_View
 * @subpackage  Helper
 * @copyright   Copyright (c) 2007, 2008 Zobmo Oy - <http://www.zobmo.com>
 * @license     http://license.zobmo.com/source/php
 */
class Zobmo_View_Helper__ extends Zend_View_Helper_Translate
{
    /**
     * This method acts as redirecter to {@link Zend_View_Helper_Translate::translate()}
     * method.
     * @return return of Zend_View_Helper_Translate::translate()
     */
    public function _($messageid = null) {
        return $this->translate($messageid);
    }
}
