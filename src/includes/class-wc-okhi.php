<?php
if (!defined('ABSPATH')) {
    exit();
} // Exit if accessed directly.

final class WC_OkHi
{
    protected static $_instance = null;

    public static function instance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    public function __construct()
    {
        if (WC_OkHi_Dependancies::is_woocommerce_active()) {
            $this->define_constants();
            $this->includes();
        } else {
            add_action('admin_notices', [$this, 'admin_notices'], 15);
        }
    }

    private function define_constants()
    {
        $this->internalDefine(
            'WC_OKHI_ABSPATH',
            dirname(WC_OKHI_PLUGIN_FILE) . '/'
        );
        $this->internalDefine(
            'WC_OKHI_PLUGIN_FILE',
            plugin_basename(WC_OKHI_PLUGIN_FILE)
        );
        $this->internalDefine(
            'WC_OKHI_ASSETS_PATH',
            plugins_url('assets/', __FILE__)
        );
        $OKHI_SETTINGS = get_option('woocommerce_okhi-integration_settings');
        $this->internalDefine(
            'WC_OKHI_ENVIRONMENT',
            isset($OKHI_SETTINGS['okhi_is_production_ready']) &&
            $OKHI_SETTINGS['okhi_is_production_ready'] !== 'no'
                ? 'production'
                : 'sandbox'
        );
        $this->internalDefine(
            'WC_OKHI_SHOW_STREETVIEW',
            isset($OKHI_SETTINGS['okhi_show_streetview']) &&
            $OKHI_SETTINGS['okhi_show_streetview'] !== 'no'
                ? true
                : false
        );

        $this->internalDefine(
            'WC_OKHI_SHOW_TO_THE_DOOR',
            isset($OKHI_SETTINGS['okhi_show_to_the_door']) &&
            $OKHI_SETTINGS['okhi_show_to_the_door'] !== 'no'
                ? true
                : false
        );

        $this->internalDefine(
            'WC_OKHI_IS_DARK_MODE',
            isset($OKHI_SETTINGS['okhi_is_dark_mode']) &&
            $OKHI_SETTINGS['okhi_is_dark_mode'] !== 'no'
                ? true
                : false
        );

        $this->internalDefine(
            'WC_OKHI_HIGHLIGHT_COLOR',
            isset($OKHI_SETTINGS['okhi_highlight_color'])
                ? $OKHI_SETTINGS['okhi_highlight_color']
                : '#FFFFFF'
        );
        $this->internalDefine(
            'WC_OKHI_PRIMARY_COLOR',
            $OKHI_SETTINGS['okhi_primary_color']
        );
        $this->internalDefine(
            'WC_OKHI_CLIENT_API_KEY',
            $OKHI_SETTINGS['okhi_client_api_key']
        );
        $this->internalDefine(
            'WC_OKHI_SERVER_API_KEY',
            $OKHI_SETTINGS['okhi_server_api_key']
        );
        $this->internalDefine(
            'WC_OKHI_BRANCH_ID',
            $OKHI_SETTINGS['okhi_branch_id']
        );
    }

    private function internalDefine($name, $value)
    {
        if (!defined($name)) {
            define($name, $value);
        }
    }

    public function includes()
    {
        // if ($this->is_request('frontend')) {
        add_action(
            'woocommerce_init',
            function () {
                include_once WC_OKHI_ABSPATH .
                    '/public/class-woocommerce-checkout.php';
                // TODO add account page handler
            },
            10
        );
        // }
    }

    public function plugin_url()
    {
        return untrailingslashit(plugins_url('/', WC_OKHI_PLUGIN_FILE));
    }

    public function okhi_base_url()
    {
        if (WC_OKHI_ENVIRONMENT == 'production') {
            return 'https://api.okhi.io/v5';
        } else {
            return 'https://dev-api.okhi.io/v5';
        }
    }

    public function admin_notices()
    {
        echo '<div class="error"><p>';
        _e(
            '<strong>OkHi Woocommerce</strong> plugin requires <a href="https://wordpress.org/plugins/woocommerce/" target="_blank">WooCommerce</a> plugin to be active',
            WC_OKHI_TEXT_DOMAIN
        );
        echo '</p></div>';
    }

    public function is_checkout()
    {
        return is_checkout() &&
            !(
                is_wc_endpoint_url('order-pay') ||
                is_wc_endpoint_url('order-received')
            );
    }
}
