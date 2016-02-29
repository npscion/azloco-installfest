<?php

abstract class Installfest_Entity_Abstract
{
    protected $tracked_properties = array();
    protected $entity_name = null;

    public function toEntity()
    {
        // Create new Entity
        $entity_class_name = $this->getEntityClassName();
        $entity = new $entity_class_name();
        // Copy values
        foreach ($entity as $attribute => $value) {
            $entity->$attribute = $this->$attribute;
        }
        return $entity;
    }

    public function clearTrackedProperties()
    {
        $this->tracked_properties = array();
    }

    public function getTrackedProperties()
    {
        return $this->tracked_properties;
    }

    public function getEntityName()
    {
        return $this->entity_name;
    }

    public function getEntityClassName()
    {
        $entity_name = $this->getEntityName();
        $entity_class = str_replace(' ', '', ucwords(str_replace('_', ' ', $entity_name)));
        return "Installfest_Entity_" . $entity_class;
    }

    public function toArray()
    {
        foreach ($this as $key => $value) {
            if (gettype($value) == "object" && get_class($value) == "DateTime") {
                $array[$key] = $value->format('Y-m-d H:i:s');
            } else if (gettype($value) == "boolean") {
                $array[$key] = ($value) ? 1 : 0;
            } else if (gettype($value) != "object" && gettype($value) != "array" && $key != "tracked_properties" && $key != "entity_name") {
                $array[$key] = $value;
            }
        }
        return $array;
    }
}
