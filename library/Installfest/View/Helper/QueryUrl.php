<?php

/*
 * Usage:  
 * <?= $this->QueryUrl($this->url(array('param2' => 'value2'))); ?>
 * Output:  
 * http://project/controller/action/param2/value2/?param1=value1  
 * */
class Zend_View_Helper_QueryUrl  
{  
    public function QueryUrl($url, $toAdd = array())  
    {  
        $requestUri = Zend_Controller_Front::getInstance()->getRequest()->getRequestUri();  
        $query = parse_url($requestUri, PHP_URL_QUERY);  
        if($query == '')  
        {  
            return $url;  
        }  
        else if(empty($toAdd))  
        {  
            return $url . '/?' . $query;  
        }  
        else  
        {  
            $toAdd = (array)$toAdd;  
            $query = explode("&", $query);  
  
            $add = '/?';  
  
            foreach($toAdd as $addPart)  
            {  
                foreach($query as $queryPart)  
                {  
                    if(strpos($queryPart, $addPart) !== False)  
                    {  
                        $add .= '&' . $queryPart;  
                    }  
                }  
            }  
            return $url . $add;  
        }  
    }  
}