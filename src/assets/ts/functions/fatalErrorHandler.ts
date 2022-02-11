import { okCollectErrorHandler } from './errorHandler';

export const handleFatalError = function (error: any) {
    if (error && error.code === 'invalid_phone') {
        // this is not fatal
        okCollectErrorHandler(error);

        return;
    }
    jQuery.each(
        [
            // '#billing_country_field',
            // '#billing_address_1_field',
            // '#billing_postcode_field',
            // '.woocommerce-additional-fields',
            '#billing_okhi_location_data_field' //given this is required
        ],
        function (_, item) {
            jQuery(item).show();
        }
    );
};
