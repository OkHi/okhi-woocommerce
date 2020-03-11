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
            add_action('admin_notices', array($this, 'admin_notices'), 15);
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
        $this->internalDefine(
            'WC_OKHI_HEADER_BACKGROUND_COLOR',
            $OKHI_SETTINGS['okhi_header_background_color']
        );
        $this->internalDefine(
            'WC_OKHI_CUSTOMER_LOGO',
            $OKHI_SETTINGS['okhi_logo']
        );
        $this->internalDefine(
            'WC_OKHI_SEND_TO_QUEUE',
            isset($OKHI_SETTINGS['okhi_send_to_queue']) &&
                $OKHI_SETTINGS['okhi_send_to_queue'] !== 'no'
        );
        if (WC_OKHI_ENVIRONMENT == 'production') {
            $this->internalDefine(
                'WC_OKHI_JS_LIB_PATH',
                'https://api.okhi.io/v5/okweb'
            );
        } else {
            $this->internalDefine(
                'WC_OKHI_JS_LIB_PATH',
                'https://dev-api.okhi.io/v5/okweb'
            );
        }

        // if (trim(strtolower(WC_OKHI_ENVIRONMENT)) == 'production') {
        //     $this->internalDefine('WC_OKHI_MIN_SUFFIX', '.min');
        // } else {
        //     $this->internalDefine('WC_OKHI_MIN_SUFFIX', '');
        // }
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
