<?php

/**
 * @package OkHi_WooCommerce
 * @version 1.3.0
 */

/**
 * Plugin Name: OkHi WooCommerce
 * Plugin URI: https://www.okhi.com/business
 * Description: OkHi Integration to enable WooCommerce checkout with OkHi.
 * Author:  OkHi
 * Author URI: https://okhi.com/
 * Version: 1.3.0
 */
/**
 * Check if WooCommerce is active
 **/
if (!defined('ABSPATH')) {
    exit(); // Exit if accessed directly
}

if (
    !in_array(
        'woocommerce/woocommerce.php',
        apply_filters('active_plugins', get_option('active_plugins'))
    )
) {
    return; // Stop right there if woocommerce is inactive
}

if (!class_exists('WC_OkHi_integration_plugin')):
    class WC_OkHi_integration_plugin
    {
        /**
         * Construct the plugin.
         */
        public function __construct()
        {
            add_action('plugins_loaded', array($this, 'init'));
        }
        /**
         * Initialize the plugin.
         */
        public function init()
        {
            // Checks if WooCommerce is installed.
            if (class_exists('WC_Integration')) {
                // Include our integration class.
                include_once 'includes/class-okhi-api-wc-integration.php';
                // Register the integration.
                add_filter('woocommerce_integrations', array(
                    $this,
                    'add_integration'
                ));
                // Set the plugin slug
                define('OkHi_integration_slug', 'wc-settings');
                // Setting action for plugin
                add_filter(
                    'plugin_action_links_' . plugin_basename(__FILE__),
                    'WC_OkHi_integration_plugin_action_links'
                );
            }
        }
        /**
         * Add a new integration to WooCommerce.
         */
        public function add_integration($integrations)
        {
            $integrations[] = 'WC_OkHi_Integration';
            return $integrations;
        }
    }
    $WC_OkHi_integration_plugin = new WC_OkHi_integration_plugin(__FILE__);
    function WC_OkHi_integration_plugin_action_links($links)
    {
        $links[] =
            '<a href="' .
            menu_page_url(OkHi_integration_slug, false) .
            '&tab=integration&section=okhi-integration">Settings</a>';
        return $links;
    }
    define('OKHI_PLUGIN_PATH', plugin_dir_path(__FILE__));
    $OKHI_SETTINGS = get_option('woocommerce_okhi-integration_settings');
    define(
        'OKHI_ENV',
        isset($OKHI_SETTINGS['okhi_is_production_ready']) &&
        $OKHI_SETTINGS['okhi_is_production_ready'] !== 'no'
            ? 'prod'
            : 'sandbox'
    );
    define(
        'OKHI_SHOW_STREETVIEW',
        isset($OKHI_SETTINGS['okhi_show_streetview']) &&
        $OKHI_SETTINGS['okhi_show_streetview'] !== 'no'
            ? true
            : false
    );
    define('OKHI_PRIMARY_COLOR', $OKHI_SETTINGS['okhi_primary_color']);
    define('OKHI_CLIENT_API_KEY', $OKHI_SETTINGS['okhi_client_api_key']);
    define('OKHI_SERVER_API_KEY', $OKHI_SETTINGS['okhi_server_api_key']);
    define('OKHI_JS_LIB_URL', OKHI_ENV === 'prod' ? 'https://api.okhi.io/v5/okweb' : 'https://dev-api.okhi.io/v5/okweb');
    define('OKHI_BRANCH_ID', $OKHI_SETTINGS['okhi_branch_id']);
    define('OKHI_MODE', OKHI_ENV === 'prod' ? 'production' : 'development');
    define(
        'OKHI_HEADER_BACKGROUND_COLOR',
        $OKHI_SETTINGS['okhi_header_background_color']
    );
    define('OKHI_CUSTOMER_LOGO', $OKHI_SETTINGS['okhi_logo']);
    define(
        'OKHI_SEND_TO_QUEUE',
        isset($OKHI_SETTINGS['okhi_send_to_queue']) &&
            $OKHI_SETTINGS['okhi_send_to_queue'] !== 'no'
    );

    // wp_register_script('okhi-lib', 'https://cdn.okhi.io/lib/web/okhi.v5.dev.js.gz');
    // wp_register_script('okhi-actions', plugins_url('/assets/js/okhi-actions.js', __FILE__));
    

    add_action('woocommerce_after_checkout_billing_form', 'add_okhi_elements_to_checkout', 10);

    /**
     * Display okhi form
     */

    function add_okhi_elements_to_checkout()
    {
        // $my_settings = get_option('woocommerce_okhi-integration_settings');
        // $env = isset($my_settings['okhi_is_production_ready']) && $my_settings['okhi_is_production_ready'] !== 'no' ? 'prod' : 'dev';
        // $api_key = OKHI_CLIENT_API_KEY;
        // wp_enqueue_script('okhi-lib');
        ?>
            <div id="okhi-errors"></div>
            <!-- OkHi location card -->
            <div
                id="selected-location-card"
                style="height:200px; display: none;"
            ></div>

            <!-- button to launch OkHi -->
            <button class="button alt" id="lets-okhi" style="display:none;">
                Delivery location
            </button>
            
            <!-- loading placeholder -->
            <div
                id="okhi-loader">
                <!-- Delivery location -->
            </div>
        <?php
            
    }
    

    

    function okhi_load_okhi_js_sdk()
    {
        if (is_checkout() && ! ( is_wc_endpoint_url( 'order-pay' ) || is_wc_endpoint_url( 'order-received' ) ) ) {
            $customerStyles = array(
                'color' => OKHI_PRIMARY_COLOR,
                'logo' => OKHI_CUSTOMER_LOGO
            );
            $customerConfig = array(
                'appBar' => array(
                    'color' => OKHI_HEADER_BACKGROUND_COLOR
                ),
                'streetView' => OKHI_SHOW_STREETVIEW
            );

            $url =
                OKHI_JS_LIB_URL .'?clientKey=' .
                OKHI_CLIENT_API_KEY .
                '&branchId=' .
                OKHI_BRANCH_ID .
                '&callback=okhi_init#asyncload';
            // setup styles
            
            wp_enqueue_style('okhi-style',
                plugins_url('/assets/css/styles.css', __FILE__));
            
            wp_enqueue_script('okhi-actions',
                plugins_url('/assets/js/okhi-actions.js', __FILE__));

            wp_add_inline_script('okhi-actions','window.okhi_styles='. json_encode($customerStyles, JSON_UNESCAPED_SLASHES). ';');
            wp_add_inline_script('okhi-actions','window.okhi_config='. json_encode($customerConfig) .';');
            wp_enqueue_script('okhi-lib', $url, ['okhi-actions']);
            
            // wp_add_inline_script(
            //     'okhi-lib',
            //     'var okhi_init = function() {' .
            //         'window.okhi_widget_styles = new window.okhi.OkHiStyle(' .
            //             json_encode($customerStyles, JSON_UNESCAPED_SLASHES) .
            //         ');' .
            //         'window.okhi_config = new window.okhi.OkHiConfig(' .
            //             json_encode($customerConfig) .
            //         ');' .
            //         'try{'.
            //             'okhi_attach()'.
            //         '}catch(e){'.
            //             'console.log("failing fatal",e);'.
            //         '}'.
            //     '};'
            // );
        }
    }

    add_action('wp_enqueue_scripts', 'okhi_load_okhi_js_sdk');

    /**
     * cleanup woocommerce defaults for ideal okhi experience
     */
    include_once 'includes/setup.php';
    /**
     * send the checkout to okhi
     */
    include_once 'includes/send-checkout.php';
endif;
