import { OkHiFields } from '../fields';

export const okCollectErrorHandler = function (error: any) {
    const errorElement = jQuery(OkHiFields.errorElement);
    if (error && error.code === 'invalid_phone') {
        jQuery('#billing_phone_field')
            .removeClass('woocommerce-validated')
            .addClass('woocommerce-invalid woocommerce-invalid-phone');
    }
    if (error && error.code && error.code == 'exit_app') {
        return;
    }
    if (!errorElement) {
        return;
    }
    if (!error) {
        errorElement.html('');
        return;
    }
    // handle errors here e.g fallback to your own way of collecting a location information
    errorElement.html(
        error.message ? error.message : 'Something went wrong please try again'
    );
};
