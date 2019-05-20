<?php

/**
 * @package OkHi_WooCommerce_Plugin
 * @version 1.0.0
 */

/**
 * Plugin Name: OkHi WooCommerce Plugin
 * Plugin URI: https://www.okhi.com/business
 * Description: OkHi Integration to enable WooCommerce checkout with OkHi.
 * Author:  OkHi
 * Author URI: https://okhi.com/
 * Version: 1.0.0
 */
/**
 * Check if WooCommerce is active
 **/
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

if (!in_array('woocommerce/woocommerce.php', apply_filters('active_plugins', get_option('active_plugins')))) {
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
                add_filter('woocommerce_integrations', array($this, 'add_integration'));
                // Set the plugin slug
                define('OkHi_integration_slug', 'wc-settings');
                // Setting action for plugin
                add_filter('plugin_action_links_' . plugin_basename(__FILE__), 'WC_OkHi_integration_plugin_action_links');
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
        $links[] = '<a href="' . menu_page_url(OkHi_integration_slug, false) . '&tab=integration&section=okhi-integration">Settings</a>';
        return $links;
    }
endif;
define('OKHI_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('OKHI_SETTINGS', get_option('woocommerce_okhi-integration_settings'));
define('OKHI_ENV', isset(OKHI_SETTINGS['okhi_is_production_ready']) && OKHI_SETTINGS['okhi_is_production_ready'] !== 'no' ? 'prod' : 'dev');
define('OKHI_API_KEY', OKHI_ENV === 'prod' ? OKHI_SETTINGS['okhi_api_key'] : OKHI_SETTINGS['okhi_dev_api_key']);
define('OKHI_HEADER_BACKGROUND_COLOR', OKHI_SETTINGS['okhi_header_background_color']);
define('OKHI_CUSTOMER_LOGO', OKHI_SETTINGS['okhi_logo']);
// $my_settings = get_option('woocommerce_okhi-integration_settings');
// $env = isset($my_settings['okhi_is_production_ready']) && $my_settings['okhi_is_production_ready'] !== 'no' ? 'prod' : 'dev';
// $api_key = $env === 'prod' ? $my_settings['okhi_api_key'] : $my_settings['okhi_dev_api_key'];

// register styles
wp_register_style('okhi-style', plugins_url( '/assets/css/styles.css', __FILE__ ));
wp_register_script('okhi-lib', 'https://cdn.okhi.io/'.OKHI_ENV.'/web/v4/okhi.min.js');
wp_register_script('okhi-common-functions', plugins_url('/assets/js/common-functions.js', __FILE__));
wp_register_script('okhi-new-user', plugins_url( '/assets/js/okhi-new-user.js', __FILE__ ));
wp_register_script('okhi-repeat-user', plugins_url( '/assets/js/okhi-repeat-user.js', __FILE__ ));
// Remove all fields but names and phone
add_filter('woocommerce_checkout_fields', 'okhi_override_checkout_fields');

/**
 * Remove: billing_company, billing_address_2, billing_city, billing_email, billing_state
 * Add: billing_okhi_location_data, billing_okhi_id, billing_okhi_url
 * change: wc error to state a value is required and not a field
 * Make optional: billing_postcode
 */
function okhi_override_checkout_fields($fields)
{
    $fields['billing']['billing_first_name'] = array(
        'label' => __('First name', 'woocommerce'),
        'required' => true,
        'class' => array('form-row-wide'),
        'clear' => true,
    );
    $fields['billing']['billing_last_name'] = array(
        'label' => __('Last name', 'woocommerce'),
        'required' => false,
        'class' => array('form-row-wide'),
        'clear' => true,
    );

    $fields['billing']['billing_okhi_location_data'] = array(
        'label' => __('Your OkHi', 'woocommerce'),
        'required' => true,
        'class' => array('form-row-wide'),
        'clear' => true,
    );
    $fields['billing']['billing_address_1'] = array(
        'label' => __('Delivery location', 'woocommerce'),
        'required' => true,
        'class' => array('form-row-wide'),
        'clear' => true,
    );
    $fields['billing']['billing_okhi_id'] = array(
        'label' => __('OkHiId', 'woocommerce'),
        'required' => false,
        'class' => array('form-row-wide'),
        'clear' => true,
    );
    $fields['billing']['billing_okhi_url'] = array(
        'label' => __('OkHi URL', 'woocommerce'),
        'required' => false,
        'class' => array('form-row-wide'),
        'clear' => true,
    );
    $fields['billing']['billing_okhi_location_data'] = array(
        'label' => __('Your OkHi', 'woocommerce'),
        'required' => false,
        'class' => array('form-row-wide'),
        'clear' => true,
    );
    $fields['billing']['billing_postcode'] = array(
        'label' => __('Plus code', 'woocommerce'),
        'required' => false,
        'class' => array('form-row-wide'),
        'clear' => true,
    );
    // remove irrelevant fields
    unset($fields['billing']['billing_company']);
    unset($fields['billing']['billing_address_2']);
    unset($fields['billing']['billing_city']);
    // unset($fields['billing']['billing_email']);
    unset($fields['billing']['billing_state']);
    return $fields;
}

/**
 * Update the order meta with field value
 */
add_action('woocommerce_checkout_update_order_meta', 'okhi_checkout_field_update_order_meta');

function okhi_checkout_field_update_order_meta($order_id)
{
    if (!empty($_POST['billing_okhi_id'])) {
        update_post_meta($order_id, 'billing_okhi_id', sanitize_text_field($_POST['billing_okhi_id']));
    }
    if (!empty($_POST['billing_okhi_url'])) {
        update_post_meta($order_id, 'billing_okhi_url', sanitize_text_field($_POST['billing_okhi_url']));
    }
    if (!empty($_POST['billing_okhi_location_data'])) {
        update_post_meta($order_id, 'billing_okhi_location_data', sanitize_text_field($_POST['billing_okhi_location_data']));
    }
}

/**
 * Display field value on the order edit page
 */
add_action('woocommerce_admin_order_data_after_billing_address', 'okhi_checkout_field_display_admin_order_meta', 10, 1);

function okhi_checkout_field_display_admin_order_meta($order)
{
    echo '<p><strong>' . __('OkHi ID') . ':</strong> <br/>' . get_post_meta($order->get_id(), 'billing_okhi_id', true) . '</p>';
    echo '<p><strong>' . __('OkHi URL') . ':</strong> <br/><a href="' . get_post_meta($order->get_id(), 'billing_okhi_url', true) . '" target="_blank">' . get_post_meta($order->get_id(), 'billing_okhi_url', true) . '</a></p>';
    echo '<p><strong>' . __('OkHi Data') . ':</strong> <br/>' . get_post_meta($order->get_id(), 'billing_okhi_location_data', true) . '</p>';
}

/**
 * Remove the word billing from billing field errors
 */
add_filter('woocommerce_add_error', 'okhi_customize_wc_errors');
function okhi_customize_wc_errors($error)
{
    if (strpos($error, 'Billing ') !== false) {
        $error = str_replace("Billing ", "", $error);
    }
    if (strpos($error, 'is a required field.') !== false) {
        $error = str_replace("is a required field.", "is required.", $error);
    }
    return $error;
}

add_action('woocommerce_after_checkout_billing_form', 'add_okhi_form', 10);

/**
 * Display okhi form
 */
function initialise_okhi_js()
{
    wp_enqueue_script('okhi-lib');
    wp_enqueue_script('okhi-common-functions');
    wp_add_inline_script('okhi-lib', 'try{var okhi = new OkHi({ apiKey: \''.OKHI_API_KEY.'\' });}catch(e){console.error(e)}');
    $customerStyles = array('base' => array(
        'color' => OKHI_HEADER_BACKGROUND_COLOR,
        'logo' => OKHI_CUSTOMER_LOGO
      ));
    wp_add_inline_script('okhi-lib','var okhi_widget_styles ='.json_encode($customerStyles));
}
add_action('wp_enqueue_scripts', 'initialise_okhi_js');

function add_okhi_form()
{
  
    $my_settings = get_option('woocommerce_okhi-integration_settings');
    $env = isset($my_settings['okhi_is_production_ready']) && $my_settings['okhi_is_production_ready'] !== 'no' ? 'prod' : 'dev';
    $api_key = $env === 'prod' ? $my_settings['okhi_api_key'] : $my_settings['okhi_dev_api_key'];
    wp_enqueue_style('okhi-style');
    // wp_enqueue_script('okhi-lib');
    

?>
  <div id="okhi-errors"></div>
  <script type="text/javascript">
    
    
  </script>
  <div
    id="selected-location-card"
    style="height:200px"
    data-firstname="<?=WC()->customer->get_first_name()?>"
    data-lastname="<?=WC()->customer->get_last_name()?>"
    data-phone="<?=WC()->customer->get_billing_phone()?>"
  ></div>
  
<?php
/**
 * returning user flow
 * render card
 */
  if (WC()->customer->get_billing_phone()):
?>
<?php
    wp_enqueue_script('okhi-repeat-user');
  else:
/**
 * new user flow
 * render button
 */
?>
    <button class="button alt" id="lets-okhi">
      Delivery location
    </button>
<?php
    wp_enqueue_script('okhi-new-user');
  endif;
}
/**
 * change checkout page titles
 */
function okhi_wc_billing_field_strings($translated_text, $text, $domain)
{
    switch ($translated_text) {
        case 'Billing details':
            $translated_text = __('Account details', 'woocommerce');
            break;
        case 'Billing &amp; Shipping':
            $translated_text = __('Account details', 'woocommerce');
            break;
    }
    return $translated_text;
}
add_filter('gettext', 'okhi_wc_billing_field_strings', 20, 3);

/**
 * remove shipping cost in cart
 */

function okhi_disable_shipping_calc_on_cart($show_shipping)
{
    if (is_cart()) {
        return false;
    }
    return $show_shipping;
}
add_filter('woocommerce_cart_ready_to_calc_shipping', 'okhi_disable_shipping_calc_on_cart', 99);

/**
 * send the checkout to okhi
 */
function post_without_wait($url, $data, $api_key)
{
    // TODO
}
include_once 'includes/send-checkout.php';

