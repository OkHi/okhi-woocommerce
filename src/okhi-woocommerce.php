<?php
/**
 * @package OkHi_WooCommerce
 * @version 1.3.9
 *
 */

/**
 * Plugin Name: OkHi WooCommerce
 * Plugin URI: https://www.okhi.com/business
 * Description: OkHi Integration to enable WooCommerce checkout with OkHi.
 * Author:  OkHi
 * Author URI: https://okhi.com/
 * Version: 1.3.9
 * WC requires at least: 3.0.0
 * WC tested up to: 6.2.0
 */

if (!defined('ABSPATH')) {
    exit();
}

define('WC_OKHI_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('WC_OKHI_PLUGIN_FILE', __FILE__);
define('WC_OKHI_TEXT_DOMAIN', get_bloginfo('name'));
define('WC_OKHI_PLUGIN_VERSION', get_bloginfo('version'));
define('WC_OKHI_PLUGIN_BUILD', 16);

if (!class_exists('WC_OkHi_Dependancies')) {
    include_once dirname(__FILE__) . '/includes/class-wc-okhi-dependancies.php';
}

if (!class_exists('WC_OkHi')) {
    include_once dirname(__FILE__) . '/includes/class-wc-okhi.php';
}

if (!class_exists('WC_OkHi_Send_Checkout')) {
    include_once dirname(__FILE__) .
        '/includes/class-wc-okhi-send-checkouts.php';
    new WC_OkHi_Send_Checkout();
}

function wc_okhi()
{
    return WC_OkHi::instance();
}

$GLOBALS['wc_okhi'] = wc_okhi();

if (!class_exists('WC_Add_OkHi_Integration')):
    class WC_Add_OkHi_Integration
    {
        public function __construct()
        {
            add_action('plugins_loaded', [$this, 'init']);
        }
        public function init()
        {
            if (class_exists('WC_Countries')) {
                $countries = new WC_Countries();
                $baseCountry = $countries->get_base_country();
                define(
                    'WC_OKHI_COUNTRY_CALLING_CODE',
                    $baseCountry
                        ? $countries->get_country_calling_code($baseCountry)
                        : '+254'
                );
            }

            // Include our integration class.
            if (!class_exists('WC_OkHi_Integration')) {
                include_once dirname(__FILE__) .
                    '/includes/class-wc-okhi-wc-integration.php';
            }
            // Register the integration.
            add_filter('woocommerce_integrations', [$this, 'add_integration']);
            // Set the plugin slug
            define('OkHi_integration_slug', 'wc-settings');
            // Setting action for plugin
            add_filter(
                'plugin_action_links',
                [$this, 'WC_OkHi_integration_plugin_action_links'],
                10,
                5
            );
        }
        public function add_integration($integrations)
        {
            $integrations[] = 'WC_OkHi_Integration';
            return $integrations;
        }
        public function WC_OkHi_integration_plugin_action_links(
            $actions,
            $plugin_file
        ) {
            static $plugin;

            if (!isset($plugin)) {
                $plugin = plugin_basename(__FILE__);
            }
            if ($plugin == $plugin_file) {
                $settings = [
                    'settings' =>
                        '<a href="' .
                        menu_page_url(OkHi_integration_slug, false) .
                        '&tab=integration&section=okhi-integration">' .
                        __('Settings', 'General') .
                        '</a>',
                ];

                $actions = array_merge($settings, $actions);
            }

            return $actions;
        }
    }
    $WC_Add_OkHi_Integration = new WC_Add_OkHi_Integration(__FILE__);
endif;
