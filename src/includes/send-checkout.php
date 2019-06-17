<?php
/**
 * for insights
 * post the location interaction to OkHi
 */
add_action('woocommerce_thankyou', 'okhi_send_order_details');
function okhi_send_order_details($order_id)
{
    $curl = curl_init();
    $order = wc_get_order($order_id);
    $order_meta = get_post_meta($order_id);

    $data = array(
        "user" => array(
            "firstName" => $order->billing_first_name,
            "lastName" => $order->billing_last_name,
            "phone" => $order->billing_phone,
        ),
        "id" => (string) $order->get_id(),
        "location" => isset($order_meta['billing_okhi_location_data']) ? json_decode($order_meta['billing_okhi_location_data'][0]) : '',
        "locationId" => isset($order_meta['_billing_okhi_id']) ? $order_meta['_billing_okhi_id'][0] : '',
        "paymentMethod" => $order->payment_method,
        "value" => floatval($order->get_total()),
        "type" => "e-commerce",
    );
    $url = OKHI_ENV === "prod" ? "https://server.okhi.co/v1" : "https://server.okhi.dev/v1";
    $args = array(
        'body' => json_encode($data),
        // 'timeout' => '5',
        // 'redirection' => '5',
        'httpversion' => '1.0',
        'blocking' => false,
        'data_format' => 'body',
        'headers' => array(
            'Content-Type' => 'application/json; charset=utf-8',
            'api-key' => OKHI_API_KEY,
        ),
    );
    $response = wp_remote_post($url . "/interactions", $args);
}
