<?php

class Installfest_Entity_Page extends Installfest_Entity_Abstract
{
    private $code = '';
    private $title = '';
    private $content = '';
    private $create_date;

    public function __construct() {
        $this->create_date = new DateTime();
    }

    /**
     * @param string $code
     */
    public function setCode($code) {
        $this->code = (string)$code;
    }

    /**
     * @return string
     */
    public function getCode() {
        return $this->code;
    }

    /**
     * @param string $value
     */
    public function setTitle($title) {
        $this->title = (string)$title;
    }

    /**
     * @return string
     */
    public function getTitle() {
        return $this->title;
    }

    /**
     * @param string $content
     */
    public function setContent($content) {
        $this->content = (string)$content;
    }

    /**
     * @return string
     */
    public function getContent() {
        return $this->content;
    }

    /**
     * @param DateTime $create_date
     */
    public function setCreateDate(DateTime $create_date) {
        $this->create_date = $create_date;
    }

    /**
     * @return DateTime
     */
    public function getCreateDate() {
        return $this->create_date;
    }
}
