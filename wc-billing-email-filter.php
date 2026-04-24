<?php
/**
 * Plugin Name: WC REST: Orders by Billing Email
 * Description: Adds ?billing_email= to wc/v3/orders REST query for precise guest order matching.
 * Version: 1.0
 * Author: GlamUp
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Add billing_email parameter support to WooCommerce REST API orders endpoint
 * This allows filtering orders by exact billing email match instead of fuzzy search
 */
add_filter('woocommerce_rest_orders_prepare_object_query', function($args, $request) {
    $billing_email = $request->get_param('billing_email');
    if ($billing_email) {
        // Initialize meta_query if it doesn't exist
        $args['meta_query'] = isset($args['meta_query']) && is_array($args['meta_query']) ? $args['meta_query'] : [];
        
        // Add billing email filter
        $args['meta_query'][] = [
            'key'     => '_billing_email',
            'value'   => sanitize_email($billing_email),
            'compare' => '=',
        ];
    }
    return $args;
}, 10, 2);

/**
 * Register the billing_email parameter in the REST API schema
 */
add_filter('woocommerce_rest_orders_collection_params', function($params) {
    $params['billing_email'] = [
        'description' => 'Filter orders by billing email address.',
        'type'        => 'string',
        'format'      => 'email',
    ];
    return $params;
});
