<?php
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
            'clear' => true
        );
        $fields['billing']['billing_last_name'] = array(
            'label' => __('Last name', 'woocommerce'),
            'required' => false,
            'class' => array('form-row-wide'),
            'clear' => true
        );

        $fields['billing']['billing_okhi_location_data'] = array(
            'label' => __('Your OkHi', 'woocommerce'),
            'required' => true,
            'class' => array('form-row-wide'),
            'clear' => true
        );
        $fields['billing']['billing_address_1'] = array(
            'label' => __('Delivery location 1', 'woocommerce'),
            'required' => true,
            'class' => array('form-row-wide'),
            'clear' => true
        );
        $fields['billing']['billing_okhi_id'] = array(
            'label' => __('OkHiId', 'woocommerce'),
            'required' => false,
            'class' => array('form-row-wide'),
            'clear' => true
        );
        $fields['billing']['billing_okhi_url'] = array(
            'label' => __('OkHi URL', 'woocommerce'),
            'required' => false,
            'class' => array('form-row-wide'),
            'clear' => true
        );
        $fields['billing']['billing_okhi_location_data'] = array(
            'label' => __('Delivery location', 'woocommerce'),
            'required' => true,
            'class' => array('form-row-wide'),
            'clear' => true
        );
        $fields['billing']['billing_postcode'] = array(
            'label' => __('Plus code', 'woocommerce'),
            'required' => false,
            'class' => array('form-row-wide'),
            'clear' => true
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
    add_action(
        'woocommerce_checkout_update_order_meta',
        'okhi_checkout_field_update_order_meta'
    );

    function okhi_checkout_field_update_order_meta($order_id)
    {
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
        if (!empty($_POST['billing_okhi_location_data'])) {
            update_post_meta(
                $order_id,
                'billing_okhi_location_data',
                sanitize_text_field($_POST['billing_okhi_location_data'])
            );
        }
    }
    /**
     * Remove the word billing from billing field errors
     */
    add_filter('woocommerce_add_error', 'okhi_customize_wc_errors');
    function okhi_customize_wc_errors($error)
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

    /**
     * Display field value on the order edit page
     */
    add_action(
        'woocommerce_admin_order_data_after_billing_address',
        'okhi_checkout_field_display_admin_order_meta',
        10,
        1
    );

    function okhi_checkout_field_display_admin_order_meta($order)
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
    add_filter(
        'woocommerce_cart_ready_to_calc_shipping',
        'okhi_disable_shipping_calc_on_cart',
        99
    );

    /**
     * remove postcode and country from formatted billing address
     */
    add_filter(
        'woocommerce_order_formatted_billing_address',
        'okhi_woo_custom_order_formatted_billing_address'
    );

    function okhi_woo_custom_order_formatted_billing_address($address)
    {
        unset($address['postcode']);
        unset($address['country']);
        return $address;
    }


    /**
     * add async defer to scripts with #asyncload
     */
    function okhi_add_async_forscript($url)
    {
        if (strpos($url, '#asyncload') === false) {
            return $url;
        } elseif (is_admin()) {
            return str_replace('#asyncload', '', $url);
        } else {
            return str_replace('#asyncload', '', $url) . "' defer async='async";
        }
    }

    add_filter('clean_url', 'okhi_add_async_forscript', 11, 1);