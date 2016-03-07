<?php

interface Installfest_Interface_FormServiceInterface
{
    public function generateForm($identifier);
    public function processForm($form);
}
