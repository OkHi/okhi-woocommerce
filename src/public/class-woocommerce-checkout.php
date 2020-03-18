<?php

class WC_OkHi_Checkout
{
    public function __construct()
    {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_css'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_js'));

        add_action(
            'woocommerce_after_checkout_billing_form',
            array($this, 'add_okhi_elements_to_checkout'),
            10
        );
        // Remove all fields but names and phone
        add_filter(
            'woocommerce_checkout_fields',
            array($this, 'okhi_override_checkout_fields'),
            20,
            1
        );
        add_filter('woocommerce_default_address_fields', array(
            $this,
            'okhi_override_default_address_fields'
        ));

        /**
         * Update the order meta with field value
         */
        add_action('woocommerce_checkout_update_order_meta', array(
            $this,
            'okhi_checkout_field_update_order_meta'
        ));

        /**
         * Remove the word billing from billing field errors
         */
        add_filter('woocommerce_add_error', array(
            $this,
            'okhi_customize_wc_errors'
        ));
        /**
         * Display field value on the order edit page
         */
        add_action(
            'woocommerce_admin_order_data_after_billing_address',
            array($this, 'okhi_checkout_field_display_admin_order_meta'),
            10,
            1
        );

        add_filter(
            'gettext',
            array($this, 'okhi_wc_billing_field_strings'),
            20,
            3
        );
        add_filter(
            'woocommerce_cart_ready_to_calc_shipping',
            array($this, 'okhi_disable_shipping_calc_on_cart'),
            99
        );

        /**
         * remove postcode and country from formatted billing address
         */
        add_filter('woocommerce_order_formatted_billing_address', array(
            $this,
            'okhi_woo_custom_order_formatted_billing_address'
        ));

        add_filter(
            'clean_url',
            array($this, 'okhi_add_async_forscript'),
            11,
            1
        );
    }
    public function enqueue_css()
    {
        if (
            is_checkout() &&
            !(
                is_wc_endpoint_url('order-pay') ||
                is_wc_endpoint_url('order-received')
            )
        ) {
            wp_register_style(
                'wc_okhi-styles',
                wc_okhi()->plugin_url() . '/assets/css/okhi-styles.css'
            );
            wp_enqueue_style('wc_okhi-styles');
        }
    }
    public function enqueue_js()
    {
        if (
            is_checkout() &&
            !(
                is_wc_endpoint_url('order-pay') ||
                is_wc_endpoint_url('order-received')
            )
        ) {
            $url =
                wc_okhi()->okhi_base_url() .
                '/okweb' .
                '?clientKey=' .
                WC_OKHI_CLIENT_API_KEY .
                '&branchId=' .
                WC_OKHI_BRANCH_ID .
                '&callback=okhi_init#asyncload';
            $script_dep = array('jquery', 'wc-checkout');
            wp_register_script(
                'wc_okhi_js-script',
                wc_okhi()->plugin_url() . '/assets/js/okhi-actions.js',
                $script_dep,
                WC_OKHI_PLUGIN_VERSION,
                true
            );
            wp_register_script('wc_okhi-lib', $url, array('wc_okhi_js-script'));
            $customerStyles = array(
                'color' => WC_OKHI_PRIMARY_COLOR,
                'logo' => WC_OKHI_CUSTOMER_LOGO
            );
            $customerConfig = array(
                'appBar' => array(
                    'color' => WC_OKHI_HEADER_BACKGROUND_COLOR
                ),
                'streetView' => WC_OKHI_SHOW_STREETVIEW
            );
            $app = array(
                'name' => WC_OKHI_TEXT_DOMAIN,
                'version' => WC_OKHI_PLUGIN_VERSION,
                'build' => WC_OKHI_PLUGIN_BUILD
            );
            $wcjson = array(
                'config' => $customerConfig,
                'styles' => $customerStyles,
                'app' => $app,
                'countryCallingCode' => WC_OKHI_COUNTRY_CALLING_CODE
            );
            wp_localize_script('wc_okhi_js-script', 'wcOkHiJson', $wcjson);
            wp_enqueue_script('wc_okhi_js-script');
            wp_enqueue_script('wc_okhi-lib');
        }
    }
    public function okhi_override_default_address_fields($address_fields)
    {
        $address_fields['last_name']['required'] = false;
        $address_fields['postcode']['required'] = false;
        $address_fields['address_1']['required'] = false;
        unset($address_fields['postcode']['validate']);
        unset($address_fields['company']);
        unset($address_fields['address_2']);
        unset($address_fields['city']);
        unset($address_fields['email']);
        unset($address_fields['state']);
        return $address_fields;
    }
    public function okhi_override_checkout_fields($fields)
    {
        $fields['billing']['billing_email']['required'] = false;
        // $fields['billing']['billing_address_1']
        // add okhi fields
        $fields['billing']['billing_okhi_street_name'] = array(
            'label' => __('Delivery location', 'woocommerce'),
            'required' => true,
            'class' => array('form-row-wide', 'hidden'),
            'clear' => true
        );
        $fields['billing']['billing_okhi_property_name'] = array(
            'label' => __('Building name', 'woocommerce'),
            'required' => false,
            'class' => array('form-row-wide', 'hidden'),
            'clear' => true
        );
        $fields['billing']['billing_okhi_property_number'] = array(
            'label' => __('Property number', 'woocommerce'),
            'required' => false,
            'class' => array('form-row-wide', 'hidden'),
            'clear' => true
        );
        $fields['billing']['billing_okhi_lat'] = array(
            'label' => __('Latitude', 'woocommerce'),
            'required' => false,
            'class' => array('form-row-wide', 'hidden'),
            'clear' => true
        );
        $fields['billing']['billing_okhi_lon'] = array(
            'label' => __('Longitude', 'woocommerce'),
            'required' => false,
            'class' => array('form-row-wide', 'hidden'),
            'clear' => true
        );
        $fields['billing']['billing_okhi_place_id'] = array(
            'label' => __('OkHi Place ID', 'woocommerce'),
            'required' => false,
            'class' => array('form-row-wide', 'hidden'),
            'clear' => true
        );
        $fields['billing']['billing_okhi_id'] = array(
            'label' => __('OkHi ID', 'woocommerce'),
            'required' => false,
            'class' => array('form-row-wide', 'hidden'),
            'clear' => true
        );
        $fields['billing']['billing_okhi_url'] = array(
            'label' => __('OkHi URL', 'woocommerce'),
            'required' => false,
            'class' => array('form-row-wide', 'hidden'),
            'clear' => true
        );
        // remove irrelevant fields
        unset($fields['billing']['billing_company']);
        unset($fields['billing']['billing_address_2']);
        unset($fields['billing']['billing_city']);
        unset($fields['billing']['billing_email']);
        unset($fields['billing']['billing_state']);
        return $fields;
    }

    public function okhi_checkout_field_update_order_meta($order_id)
    {
        if (!empty($_POST['billing_okhi_street_name'])) {
            update_post_meta(
                $order_id,
                'billing_okhi_street_name',
                sanitize_text_field($_POST['billing_okhi_street_name'])
            );
        }
        if (!empty($_POST['billing_okhi_property_name'])) {
            update_post_meta(
                $order_id,
                'billing_okhi_property_name',
                sanitize_text_field($_POST['billing_okhi_property_name'])
            );
        }
        if (!empty($_POST['billing_okhi_property_number'])) {
            update_post_meta(
                $order_id,
                'billing_okhi_property_number',
                sanitize_text_field($_POST['billing_okhi_property_number'])
            );
        }
        if (!empty($_POST['billing_okhi_lat'])) {
            update_post_meta(
                $order_id,
                'billing_okhi_lat',
                sanitize_text_field($_POST['billing_okhi_lat'])
            );
        }
        if (!empty($_POST['billing_okhi_lon'])) {
            update_post_meta(
                $order_id,
                'billing_okhi_lon',
                sanitize_text_field($_POST['billing_okhi_lon'])
            );
        }
        if (!empty($_POST['billing_okhi_place_id'])) {
            update_post_meta(
                $order_id,
                'billing_okhi_place_id',
                sanitize_text_field($_POST['billing_okhi_place_id'])
            );
        }
        if (!empty($_POST['billing_okhi_id'])) {
            update_post_meta(
                $order_id,
                'billing_okhi_id',
                sanitize_text_field($_POST['billing_okhi_id'])
            );
        }
        if (!empty($_POST['billing_okhi_url'])) {
            update_post_meta(
                $order_id,
                'billing_okhi_url',
                sanitize_text_field($_POST['billing_okhi_url'])
            );
        }
    }

    public function okhi_customize_wc_errors($error)
    {
        if (strpos($error, 'Billing ') !== false) {
            $error = str_replace('Billing ', '', $error);
        }
        if (strpos($error, 'is a required field.') !== false) {
            $error = str_replace(
                'is a required field.',
                'is required.',
                $error
            );
        }
        return $error;
    }

    public function okhi_checkout_field_display_admin_order_meta($order)
    {
        echo '<p><strong>' .
            __('OkHi URL') .
            ':</strong> <br/><a href="' .
            get_post_meta($order->get_id(), 'billing_okhi_url', true) .
            '" target="_blank">' .
            get_post_meta($order->get_id(), 'billing_okhi_url', true) .
            '</a></p>';
    }
    /**
     * change checkout page titles
     */
    public function okhi_wc_billing_field_strings(
        $translated_text,
        $text,
        $domain
    ) {
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

    /**
     * remove shipping cost in cart
     */

    public function okhi_disable_shipping_calc_on_cart($show_shipping)
    {
        if (is_cart()) {
            return false;
        }
        return $show_shipping;
    }

    public function okhi_woo_custom_order_formatted_billing_address($address)
    {
        unset($address['postcode']);
        unset($address['country']);
        return $address;
    }

    /**
     * add async defer to scripts with #asyncload
     */
    public function okhi_add_async_forscript($url)
    {
        if (strpos($url, '#asyncload') === false) {
            return $url;
        } elseif (is_admin()) {
            return str_replace('#asyncload', '', $url);
        } else {
            return str_replace('#asyncload', '', $url) . "' defer async='async";
        }
    }

    public function add_okhi_elements_to_checkout()
    {
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
}
new WC_OkHi_Checkout();
