<?php
/**
 * Plugin Name: WC REST: Orders by Billing Email
 * Description: Adds ?billing_email= to wc/v3/orders REST query for deterministic guest order lookups.
 * Version: 1.0.0
 * Author: Your Team
 */

add_filter('woocommerce_rest_orders_prepare_object_query', function ($args, $request) {
    $billing_email = $request->get_param('billing_email');
    if ($billing_email) {
        if (!isset($args['meta_query']) || !is_array($args['meta_query'])) {
            $args['meta_query'] = array();
        }
        $args['meta_query'][] = array(
            'key'     => '_billing_email',
            'value'   => $billing_email,
            'compare' => '=',
        );
    }
    return $args;
}, 10, 2);
