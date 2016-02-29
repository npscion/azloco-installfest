<?php
/**
 * String Filter
 * Manipulate strings mainly in view files
 *
 * @category    Installfest
 * @package     Installfest_View
 * @subpackage  Helper
 * @copyright   Copyright (c) 2007, 2008 Zobmo Oy - <http://www.zobmo.com>
 * @license     http://license.rightbrainsolution.com/source/php
 * @author      Anis uddin Ahmad <anisniit@gmail.com>
 */
class Installfest_View_Helper_StringFilter
{
   /**
	* Return current classes
	*
	* @author  Anis uddin Ahmad <anisniit@gmail.com>
	* @access  public
	* @return  Zobmo_View_Helper_StringFilter
	*/
	public function StringFilter()
	{
        return $this;
	}

	/**
	* Get specific chars of a string with additional suffix
	*
	* @author  Anis uddin Ahmad <anisniit@gmail.com>
	* @access  public
	* @param   srting  $string
	* @param   integer $limit
	* @param   string  $suffix
	* @return  srting
	*/
	public function limitCharacter($string, $limit, $suffix = ' ...')
	{
        $string = strip_tags($string);

		if(strlen($string) > $limit)
		{
			$str2       = substr($suffix, 0, $limit);
			$str2Length = strlen($str2);

			$str1 = substr($string, 0, ($limit - $str2Length));
			return $str1 . $str2;
		}
		else
		{
			return $string;
		}
	}

	/**
	* Escapes a string with allowing some tags
	*
	* @author  Anis uddin Ahmad <anisniit@gmail.com>
	* @access  public
	* @param   srting  $string
	* @param   srting  $tags
	* @param   int     $quot       Qutation handling style [ENT_COMPAT|ENT_QUOTES|ENT_NOQUOTES(default)]
	* @param   string  $charset    default 'UTF-8'
	* @return  string
	*/
	public function printWithTag($string, $tags="<a><p><b><i><u><div><font><hr><img><br>", $quot = ENT_NOQUOTES, $charset = 'UTF-8')
	{
		$string = htmlentities($string, $quot, $charset);
		return nl2br(stripcslashes(strip_tags($string, $tags)));
	}

	/**
    * Escapes a string
    *
    * @author  Anis uddin Ahmad <anisniit@gmail.com>
    * @access  public
    * @param   srting  $string
    * @param   int     $quot       Qutation handling style [ENT_COMPAT|ENT_QUOTES|ENT_NOQUOTES(default)]
    * @param   string  $charset    default 'UTF-8'
    * @return  string
    */
	public function printWithoutTag($string, $quot = ENT_NOQUOTES, $charset = 'UTF-8')
	{
		$string = htmlentities($string, $quot, $charset);
		return nl2br(stripcslashes(strip_tags(($string))));
	}

	/**
	* Add 'http://' at first with an url if needs
	*
	* @author  Anis uddin Ahmad <anisniit@gmail.com>
	* @access  public
	* @param   srting  $str
	* @return  string
	*/
	public function prep_url($str = '')
	{
		if ($str == 'http://' OR $str == '')
		{
			return '';
		}

		if (substr($str, 0, 7) != 'http://' && substr($str, 0, 8) != 'https://')
		{
			$str = 'http://'.$str;
		}

		return $str;
	}

    /**
     * Codeigniter url_title function. Convert a title to url friendly string
     *
     * @modified Anis uddin Ahmad <anisniit@gmail.com>
     * @param   string  The title
     * @param   string  (optional) separator
     * @return  string  formated string to use in url
     */
    function toUrl($str, $separator = 'dash')
    {
        if ($separator == 'dash')
        {
            $search     = '_';
            $replace    = '-';
        }
        else
        {
            $search     = '-';
            $replace    = '_';
        }

        $trans = array(
                        '&\#\d+?;'              => '',
                        '&\S+?;'                => '',
                        '\s+'                   => $replace,
                        '[^a-z0-9\-\._]'        => '',
                        $replace . '+'          => $replace,
                        $replace . '$'          => $replace,
                        '\.'                    => '',
                        '^' . $replace          => $replace
                      );

        $str = strip_tags($str);

        foreach ($trans as $key => $val)
        {
            $str = preg_replace("#".$key."#i", $val, $str);
        }

        return trim(stripslashes($str));
    }

}
