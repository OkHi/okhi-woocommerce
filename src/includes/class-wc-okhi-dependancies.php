<?php
if (!defined('ABSPATH')) {
    exit(); // Exit if accessed directly.
}

class WC_OkHi_Dependancies
{
    private static $active_plugins;

    public static function init()
    {
        self::$active_plugins = (array) get_option('active_plugins', array());
        if (is_multisite()) {
            self::$active_plugins = array_merge(
                self::$active_plugins,
                get_site_option('active_sitewide_plugins', array())
            );
        }

        if (class_exists('WC_Integration')) {
            // // Include our integration class.
            // if (!class_exists('WC_OkHi_Integration')) {
            //     include_once dirname(__FILE__) .
            //         '/class-wc-okhi-wc-integration.php';
            // }
            // // Register the integration.
            // add_filter('woocommerce_integrations', array(
            //     $this,
            //     'add_integration'
            // ));
            // // Set the plugin slug
            // define('OkHi_integration_slug', 'wc-settings');
            // // Setting action for plugin
            // add_filter(
            //     'plugin_action_links_' . plugin_basename(__FILE__),
            //     'WC_OkHi_integration_plugin_action_links'
            // );
        }
    }

    // public function add_integration($integrations)
    // {
    //     $integrations[] = 'WC_OkHi_Integration';
    //     return $integrations;
    // }
    // public function WC_OkHi_integration_plugin_action_links($links)
    // {
    //     $links[] =
    //         '<a href="' .
    //         menu_page_url(OkHi_integration_slug, false) .
    //         '&tab=integration&section=okhi-integration">Settings</a>';
    //     return $links;
    // }

    public static function woocommerce_in_active_plugins()
    {
        if (!self::$active_plugins) {
            self::init();
        }
        return in_array('woocommerce/woocommerce.php', self::$active_plugins) ||
            array_key_exists(
                'woocommerce/woocommerce.php',
                self::$active_plugins
            );
    }

    public static function is_woocommerce_active()
    {
        return self::woocommerce_in_active_plugins();
    }
}
