<?php
/**
 * for insights
 * post the location interaction to OkHi
 */
add_action('woocommerce_thankyou', 'okhi_send_order_details');

// function post_without_wait($url, $data, $api_key)
// {
// TODO implement async post
// }

function okhi_send_order_details($order_id)
{
    $curl = curl_init();
    $order = wc_get_order($order_id);
    $order_meta = get_post_meta($order_id);
    // $basket = okhi_compose_basket_data($order);
    $user_id = $order->get_user_id();
    $data = array(
        "user" => array(
            "firstName" => $order->billing_first_name,
            "lastName" => $order->billing_last_name,
            "phone" => $order->billing_phone,
        ),
        "id" => (string) $order->get_id(),
        "location" => isset($order_meta['billing_okhi_location_data']) ? json_decode($order_meta['billing_okhi_location_data'][0]) : '',
        "locationId" => isset($order_meta['_billing_okhi_id']) ? $order_meta['_billing_okhi_id'][0] : '',
        "value" => floatval($order->get_total()),
        "type" => "e-commerce",
        "properties" => array(
            "sendToQueue" => OKHI_SEND_TO_QUEUE,
            "paymentMethod" => $order->payment_method,
        
            // "basket" => $basket,
            "userId" => isset($user_id) ? $user_id : "",
            "shipping" => array(
                "cost" => $order->get_shipping_total(),
                "method" => $order->get_shipping_method(),
                // TODO add zone
            ),

        ),
    );
    $url = OKHI_ENV === "prod" ? "https://server.okhi.co/v1" : "https: //sandbox-server.okhi.dev/v1";
    $args = array(
        'body' => json_encode($data),
        // 'timeout' => '5',
        // 'redirection' => '5',
        'httpversion' => '1.0',
        'blocking' => false,
        'data_format' => 'body',
        'headers' => array(
            'Content-Type' => 'application/json; charset=utf-8',
            'api-key' => OKHI_SERVER_API_KEY,
        ),
    );
    $response = wp_remote_post($url . "/interactions", $args);
}
/*
function okhi_compose_basket_data($order)
{
    // $total_weight = 0;
    $itemsArray = array();
    $totalItemsCount = count($order->get_items());
    foreach ($order->get_items() as $item_id => $product_item) {
        $quantity = $product_item->get_quantity(); // get quantity
        $product = $product_item->get_product(); // get the WC_Product object
        $product_weight = $product->get_weight() ? $product->get_weight() : 0; // get the product weight
        $categories = array();
        foreach ($product->get_category_ids() as $key => $id) {
            if ($term = get_term_by('id', $id, 'product_cat')) {
                array_push($categories, $term->name);
            }
        }
        ;
        // Add the line item weight to the total weight calculation
        // $total_weight += floatval($product_weight * $quantity);
        array_push($itemsArray, array(
            "itemId" => $item_id,
            "sku" => $product->get_sku(),
            "value" => floatval($product->get_price()),
            "categories" => $categories,
            "quantity" => $quantity,
            "weight" => $product_weight,
            "length" => $product->get_length(),
            "width" => $product->get_width(),
            "height" => $product->get_height(),
        ));
    }
    return $itemsArray;
}
*/