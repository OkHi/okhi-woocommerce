<?php
/**
 * OkHi Integration.
 *
 * @package   Woocommerce OkHi Integration
 * @category Integration
 * @author   OkHi
 */
class WC_OkHi_Integration extends WC_Integration
{
    /**
     * Init and hook in the integration.
     */
    public function __construct()
    {
        global $woocommerce;
        $this->id = 'okhi-integration';
        $this->method_title = __('OkHi Integration');
        $this->method_description = __(
            'OkHi Integration to enable WooCommerce checkout with OkHi.'
        );
        // Load the settings.
        $this->init_form_fields();
        $this->init_settings();
        // Define user set variables.
        $this->okhi_client_api_key = $this->get_option('okhi_client_api_key');
        $this->okhi_server_api_key = $this->get_option('okhi_server_api_key');

        // Actions.
        add_action('woocommerce_update_options_integration_' . $this->id, array(
            $this,
            'process_admin_options'
        ));
    }
    /**
     * Initialize integration settings form fields.
     */
    public function init_form_fields()
    {
        $this->form_fields = array(
            'okhi_client_api_key' => array(
                'title' => __('Client API key'),
                'type' => 'text',
                'description' => __('Enter client API key'),
                'desc_tip' => true,
                'default' => '',
                'css' => 'width:270px;'
            ),
            'okhi_server_api_key' => array(
                'title' => __('Server API Key'),
                'type' => 'text',
                'description' => __('Enter your server API Key'),
                'desc_tip' => true,
                'default' => '',
                'css' => 'width:270px;'
            ),
            'okhi_branch_id' => array(
                'title' => __('Branch ID'),
                'type' => 'text',
                'description' => __('ID for the given branch'),
                'desc_tip' => true,
                'default' => '',
                'css' => 'width:270px;'
            ),
            'okhi_send_to_queue' => array(
                'title' => __('Send to OkQueue'),
                'type' => 'checkbox',
                'description' => __(
                    'Check this box only if you are using OkQueue App'
                ),
                'desc_tip' => true
            ),
            'okhi_logo' => array(
                'title' => __('Path to your logo'),
                'type' => 'text',
                'description' => __(
                    'eg. https://cdn.okhi.co/okhi-logo-white.svg'
                ),
                'desc_tip' => true,
                'default' => 'https://cdn.okhi.co/okhi-logo-white.svg',
                'css' => 'width:270px;'
            ),
            'okhi_header_background_color' => array(
                'title' => __('Header background color'),
                'type' => 'text',
                'description' => __(' eg. #00838F'),
                'desc_tip' => true,
                'default' => '#00838F',
                'css' => 'width:270px;'
            ),
            'okhi_primary_color' => array(
                'title' => __('Primary color'),
                'type' => 'text',
                'description' => __(' eg. #00838F'),
                'desc_tip' => true,
                'default' => '#00838F',
                'css' => 'width:270px;'
            ),
            'okhi_show_streetview' => array(
                'title' => __('Show streetview'),
                'type' => 'checkbox',
                'description' => __(
                    'Allow users to use streetview to select their gate'
                ),
                'desc_tip' => true
            )
        );
    }
}
?>
