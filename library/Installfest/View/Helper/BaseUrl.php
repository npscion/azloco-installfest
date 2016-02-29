<?php
/**
 * Installfest View Helper BaseUrl returns baseurl, $file is appended if given.
 *
 * @category    Installfest
 * @package     Installfest_View_Helper
 * @subpackage  Helper
 * @copyright   Copyright (c) 2007, 2008 Zobmo Oy - <http://www.zobmo.com>
 * @license     http://license.rightbrainsolution.com/source/php
 */

/**
 * BaseUrl helper
 *
 * @category    Zobmo
 * @package		Zobmo_View
 * @subpackage 	Helper
 * @copyright   Copyright (c) 2007, 2008 Zobmo Oy - <http://www.zobmo.com>
 * @license     http://license.zobmo.com/source/php
 * @uses Zend_Controller_Front
 */
class Zobmo_View_Helper_BaseUrl
{
    /**
     * @var string BaseUrl
     */
    protected $baseUrl;

    /**
     * Returns baseurl, $file is appended if given for convenience.
     *
     * @param string $file
     * @return string
     */
    public function baseUrl($file = FALSE) {
        if(!$this->baseUrl)
            $this->baseUrl = Zend_Controller_Front::getInstance()->getRequest()->getBaseUrl();
        return $this->baseUrl.($file ? ('/' . ltrim((string) $file, '/\\')) : '');
    }
}
