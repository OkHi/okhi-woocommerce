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
        'required' => false,
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
function add_okhi_form()
{
    $my_settings = get_option('woocommerce_okhi-integration_settings');
    $env = isset($my_settings['okhi_is_production_ready']) && $my_settings['okhi_is_production_ready'] !== 'no' ? 'prod' : 'dev';
    $api_key = $env === 'prod' ? $my_settings['okhi_api_key'] : $my_settings['okhi_dev_api_key'];
    ?>
  <style>
    #okhi-errors {
      color: red;
    }
    button#lets-okhi {
      font-size: 1.41575em;
      width: 100%;
    }
    #billing_country_field,
    #billing_address_1_field,
    #billing_postcode_field,
    #billing_okhi_location_data_field,
    #billing_okhi_id_field,
    #billing_okhi_url_field,
    .woocommerce-additional-fields{
      display: none!important;
    }
  </style>
  <div id="okhi-errors"></div>
  <script src="https://cdn.okhi.io/<?=$env?>/web/v4/okhi.min.js"></script>
  <script type="text/javascript">
    var okhi = new OkHi({
      apiKey: '<?=$api_key?>'
    });
    var style = {
      base: {
        // name: 'OkHi',
        color: '<?=$my_settings['okhi_header_background_color']?>',
        logo: '<?=$my_settings['okhi_logo']?>'
      }
    };
    var copy = {
      createOtherInformation: 'Create your delivery location',
      updateOtherInformation: 'Change your delivery notes',
      createLocation: 'Create a new pickup location',
      selectLocation: 'Select a delivery location',
      upsellMessage: 'Create your first delivery location with OkHi!',
    };
    var handleOnSuccessCard = function(data) {
      handleOnSuccess(data,true)
    }
    var showLocationCard = function(data) {
      var locationCard = document.getElementById('selected-location-card');
      var deliveryLocationButton = document.getElementById('lets-okhi');
      if(locationCard.innerHTML !== '') {
        return;
      }

      var currentLocationObject = data.location ? data.location : null;
      if('<?=WC()->customer->get_billing_phone()?>'){
        // this flow is valid only for new users
        return;
      }
      deliveryLocationButton.style.display = 'none';
      locationCard.innerHTML = '';
      locationCard.style.display = 'block';
      var locationCard = new okhi.LocationCard({
        element: locationCard, // required
        user: data.user, // required
        onSuccess: handleOnSuccessCard, // optional
        onError: handleOnError, // optional
        style: style, // optional
        location: currentLocationObject,
        copy: {
          createOtherInformation: 'Delivery instructions'
        } // optional
      });
    };
    var handleOnSuccess = function(data, isCallBackCard) {
      // handle your success here with the data you get back
      if (!data || !data.location) {
        return
      }
      var locationRawData = document.getElementById('billing_okhi_location_data');
      var deliveryNotes = document.getElementById('order_comments');
      var billingAddress1 = document.getElementById('billing_address_1');
      var locationOkHiId = document.getElementById('billing_okhi_id');
      var okhiURL = document.getElementById('billing_okhi_url');
      var postcode = document.getElementById('billing_postcode');

      if (locationRawData && data.location) {
        locationRawData.value = JSON.stringify(data.location);
      }
      if (deliveryNotes && data.location.otherInformation) {
        deliveryNotes.value = data.location.otherInformation;
      }
      if (billingAddress1 && data.location.streetName) {
        billingAddress1.value = data.location.streetName;
      }
      if (locationOkHiId && data.location.id) {
        locationOkHiId.value = data.location.id;
      }
      if (okhiURL && data.location.url) {
        okhiURL.value = data.location.url;
      }
      if (postcode && data.location.url) {
        postcode.value = data.location.plusCode;
      }

      // trigger calculation of shipping costs
      jQuery(document.body).trigger('update_checkout');

      if(!isCallBackCard && !'<?=WC()->customer->get_billing_phone()?>'){
        showLocationCard(data);
      }
    };

    var handleOnError = function(error) {
      var errorElement = document.getElementById('okhi-errors');
      if(!errorElement) {
        return;
      }
      if(!error) {
        errorElement.innerHTML = "";
        return;
      }
      // handle errors here e.g fallback to your own way of collecting a location information
      errorElement.innerHTML = error.message ? error.message : 'Something went wrong please try again';
    };
  </script>
<?php
/**
     * returning user flow
     * render card
     */
    if (WC()->customer->get_billing_phone()) {
        ?>
    <div
      id="lets-okhi"
      style="height:300px"
      data-firstname="<?=WC()->customer->get_first_name()?>"
      data-lastname="<?=WC()->customer->get_last_name()?>"
      data-phone="<?=WC()->customer->get_billing_phone()?>"
    >
    </div>
    <script type="text/javascript">
      var deliveryLocationCard = document.getElementById('lets-okhi');
      var user = {
        firstName: deliveryLocationCard.getAttribute('data-firstname'),
        lastName: deliveryLocationCard.getAttribute('data-lastname'),
        phone: deliveryLocationCard.getAttribute('data-phone'),
      };
      var locationCard = new okhi.LocationCard({
        element: deliveryLocationCard,
        user: user,
        onSuccess: handleOnSuccess,
        onError: handleOnError,
        style: style,
        // copy: copy,
      });
    </script>
<?php
} else {
        /**
         * new user flow
         * render button
         */
        ?>
  <button class="button alt" id="lets-okhi">
    Delivery location
  </button>
  <div id="selected-location-card" style="height:300px; display:none"></div>
  <script type="text/javascript">
    var deliveryLocationButton = document.getElementById('lets-okhi');
    var handleButtonClick = function(e) {
      if (e) {
        e.preventDefault();
      }
      // reset errors
      handleOnError(null);
      //process the data
      var firstName = document.getElementById('billing_first_name');
      var lastName = document.getElementById('billing_last_name');
      var phone = document.getElementById('billing_phone');
      if (!phone || !phone.value) {
        return handleOnError(new Error('Missing phone number'));
      }
      var user = {
        phone: phone.value,
        firstName: firstName ? firstName.value : '',
        lastName: lastName ? lastName.value : '',
      };
      var locationManager = new okhi.LocationManager({
        user: user,
        onSuccess: handleOnSuccess,
        onError: handleOnError,
        style: style
      });
      var currentLocationObject = null;
      var currentLoctionIdElement = document.getElementById('billing_okhi_id');
      if (currentLoctionIdElement && currentLoctionIdElement.value) {
        currentLocationObject = {
          id: currentLoctionIdElement.value // The OkHi location id you want manipulated in the selected mode
        }
      }
      var launchConfiguration = {
        mode: 'select_location',
        location: currentLocationObject
      };
      locationManager.launch(launchConfiguration);
    };
    deliveryLocationButton.addEventListener('click', handleButtonClick);
  </script>
<?php
}
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

// send the checkout to okhi
function post_without_wait($url, $data, $api_key)
{
    // TODO
}
add_action('woocommerce_order_status_processing', 'okhi_send_order_details');
function okhi_send_order_details($order_id)
{
    $my_settings = get_option('woocommerce_okhi-integration_settings');
    $env = isset($my_settings['okhi_is_production_ready']) && $my_settings['okhi_is_production_ready'] !== 'no' ? 'prod' : 'dev';
    $api_key = $env === 'prod' ? $my_settings['okhi_api_key'] : $my_settings['okhi_dev_api_key'];
    $curl = curl_init();
    $order = wc_get_order($order_id);
    $order_meta = get_post_meta($order_id);
    $data = array(
        "user" => array(
            "firstName" => WC()->customer->get_first_name(),
            "lastName" => WC()->customer->get_last_name(),
            "phone" => WC()->customer->get_billing_phone(),
        ),
        "id" => (string) $order->get_id(),
        "location" => isset($order_meta['billing_okhi_location_data']) ? json_decode($order_meta['billing_okhi_location_data'][0]) : '',
        "locationId" => isset($order_meta['_billing_okhi_id']) ? $order_meta['_billing_okhi_id'][0] : '',
        "paymentMethod" => $order->payment_method,
        "value" => floatval($order->get_total()),
        "type" => "checkout",
    );
    $url = $env === "prod" ? "https://server.okhi.co/v1" : "https://server.okhi.dev/v1";
    $args = array(
        'body' => json_encode($data),
        // 'timeout' => '5',
        // 'redirection' => '5',
        'httpversion' => '1.0',
        'blocking' => false,
        'data_format' => 'body',
        'headers' => array(
            'Content-Type' => 'application/json; charset=utf-8',
            'api-key' => $api_key,
        ),
    );
    $response = wp_remote_post($url . "/interactions", $args);
}
