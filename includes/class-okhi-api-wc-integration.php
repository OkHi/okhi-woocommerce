<?php
/**
 * OkHi Integration.
 *
 * @package   Woocommerce OkHi Integration
 * @category Integration
 * @author   Evans Mutai
 */
if (!class_exists('WC_OkHi_Integration')):
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
            $this->method_description = __('OkHi Integration to enable WooCommerce checkout with OkHi.');
            // Load the settings.
            $this->init_form_fields();
            $this->init_settings();
            // Define user set variables.
            $this->okhi_is_production_ready = $this->get_option('okhi_is_production_ready');
            $this->okhi_api_key = $this->get_option('okhi_api_key');
            $this->okhi_dev_api_key = $this->get_option('okhi_dev_api_key');

            // Actions.
            add_action('woocommerce_update_options_integration_' . $this->id, array($this, 'process_admin_options'));
        }
        /**
         * Initialize integration settings form fields.
         */
        public function init_form_fields()
    {
            $this->form_fields = array(
                'okhi_is_production_ready' => array(
                    'title' => __('Production Mode'),
                    'type' => 'checkbox',
                    'description' => __('Done testing?'),
                    'desc_tip' => true,
                ),
                'okhi_dev_api_key' => array(
                    'title' => __('Developement API Key'),
                    'type' => 'text',
                    'description' => __('Enter your development API Key'),
                    'desc_tip' => true,
                    'default' => '',
                    'css' => 'width:300px;',
                ),
                'okhi_api_key' => array(
                    'title' => __('Production API Key'),
                    'type' => 'text',
                    'description' => __('Enter API Key'),
                    'desc_tip' => true,
                    'default' => '',
                    'css' => 'width:300px;',
                ),
            );
        }
    }
endif;
