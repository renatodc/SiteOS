<?php

$input_keys = preg_replace('/[^a-z0-9_-]+/i','',array_keys($input));
$input_vals = array_values($input);