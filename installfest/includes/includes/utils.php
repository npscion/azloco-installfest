<?php
/* *
 *
 * Global utility functions
 *
 * Created by Aaron Kavlie and Tom Haws 2012
 * 
 * The better place for these functions would be in a library or a model. 
 * I've reduced the calls to them to only inside the AuctionImage view helper.
 * Tom Haws 2013-04-02
 *
 * To be included as follows:
 * require_once('utils.php');
 *
 * */


$working_dir = dirname(__FILE__).'/';
include_once $working_dir."../bin/config/s3.config.php";

// Return directory name for auction images
// Bumps to a new directory every 10,000 images, to avoid ext3 32,000-directory limit

/**
 * Created by Tom Buck tom@tbuck.com 2012-08
 * From function by Tom Haws tom.haws@gmail.com and Aaron Kavlie akavlie@gmail.com early 2012.
 * */
 function pa_image_dir_tmp($auction_id, $return_full_path = FALSE, $mkdir = FALSE) {
    // Check for retail image
    if(substr($auction_id, 0, 1) == 'r')
    {
        $auction_id = substr($auction_id, 1);
        $image_bucket = substr($auction_id, 0, -4);
        // Retails under 10,000
        if (!$image_bucket) $image_bucket = 0;
        $web_image_dir = '/images/retails/r' . $image_bucket . '/' . $auction_id;
    }
    else
    {
        $image_bucket = substr($auction_id, 0, -4);
        // Auctions under 10,000
        if (!$image_bucket) $image_bucket = 0;
        $web_image_dir = '/images/auctions/' . $image_bucket . '/' . $auction_id;
    }
    $full_image_dir = $_SERVER['DOCUMENT_ROOT'] . $web_image_dir;
    if ($mkdir and !file_exists($full_image_dir)) {
        mkdir($full_image_dir, 0777, true);
    }

    return $return_full_path ? $full_image_dir : $web_image_dir;
}

/**
 * Created by Tom Buck tom@tbuck.com 2012-08
 * */
 function pa_image_dir($auction_id) {
        // Check for retail image
        if(substr($auction_id, 0, 1) == 'r')
        {
            $image_bucket = substr($auction_id, 1, -4);
            $auction_id = substr($auction_id, 1);
            if (!$image_bucket) $image_bucket = 0;
            $image_bucket = 'r' . $image_bucket;
        }
        else
        {
            $image_bucket = substr($auction_id, 0, -4);
            if (!$image_bucket) $image_bucket = 0;
        }
        return PRISTINE_AUCTION_S3_HTTPS_ADDRESS.$image_bucket.'/'.$auction_id;
}
