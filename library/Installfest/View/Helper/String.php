<?php

class Installfest_View_Helper_String
{
    public function String()
    {
        return $this;
    }

    public function formatDescription($str)
    {
        $out = preg_replace("/^(<br\/>|\s)+|(<br\/>|\s)+$/", "",
            // Maximum of two breaks
            preg_replace("/(<br\/>){2,}|(<br \/>){2,}/", "<br/><br/>",
                // Replace line returns with break tags
                preg_replace("/\r\n/", "<br/><br/>",
                    // Strip html tags
                    strip_tags(
                        // Replace break tags with at most one line return
                        preg_replace("/(<br\/>)+|(<br \/>)+/", "\r\n", $str)
                    )
                )
            )
        );
        return $out;
    }
}
