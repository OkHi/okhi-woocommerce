<?php
class WC_OkHi_Send_Checkout
{
    public function __construct()
    {
        /**
         * for insights
         * post the location interaction to OkHi
         */
        add_action('woocommerce_thankyou', array(
            $this,
            'okhi_send_order_details'
        ));
    }

    // function post_without_wait($url, $data, $api_key)
    // {
    // TODO implement async post
    // }

    public function okhi_send_order_details($order_id)
    {
        $curl = curl_init();
        $order = wc_get_order($order_id);
        $order_meta = get_post_meta($order_id);
        // $basket = okhi_compose_basket_data($order);
        $user_id = $order->get_user_id();
        $data = array(
            'user' => array(
                'first_name' => $order->get_billing_first_name(),
                'last_name' => $order->get_billing_last_name(),
                'phone' => $order->get_billing_phone()
            ),
            'id' => (string) $order->get_id(),
            'location' => isset($order_meta['billing_okhi_location_data'])
                ? json_decode($order_meta['billing_okhi_location_data'][0])
                : '',
            'location_id' => isset($order_meta['_billing_okhi_id'])
                ? $order_meta['_billing_okhi_id'][0]
                : '',
            'value' => floatval($order->get_total()),
            'use_case' => 'e-commerce',
            'properties' => array(
                'send_to_queue' => WC_OKHI_SEND_TO_QUEUE,
                'payment_method' => $order->get_payment_method(),

                // "basket" => $basket,
                'user_id' => isset($user_id) ? $user_id : '',
                'shipping' => array(
                    'cost' => $order->get_shipping_total(),
                    'method' => $order->get_shipping_method()
                    // TODO add zone
                )
            )
        );
        $url =
            WC_OKHI_ENVIRONMENT === 'production'
                ? 'https://api.okhi.io/v5'
                : 'https://dev-api.okhi.io/v5';
        $args = array(
            'body' => json_encode($data),
            // 'timeout' => '5',
            // 'redirection' => '5',
            'httpversion' => '1.0',
            'blocking' => false,
            'data_format' => 'body',
            'headers' => array(
                'Content-Type' => 'application/json; charset=utf-8',
                'authorization' =>
                    'Token ' .
                    base64_encode(
                        WC_OKHI_BRANCH_ID . ':' . WC_OKHI_SERVER_API_KEY
                    )
            )
        );
        $response = wp_remote_post($url . '/interactions', $args);
    }
}
