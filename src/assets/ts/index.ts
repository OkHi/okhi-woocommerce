import { OkHiFields } from './fields';
import { autoPrefixPhone } from './functions/autoprefix-phone';
import { okCollectErrorHandler } from './functions/errorHandler';
import { handleFatalError } from './functions/fatalErrorHandler';
import { resetOkHiFields } from './functions/reset-fields';
import { okCollectSuccessHandler } from './functions/successHandler';
import { PreloadedJSONData } from './interfaces/preloaded-json-data.interface';
declare const okcollect: any;
declare const wcOkHiJson: PreloadedJSONData;

function okhi_init() {
    const billingFirstNameField = jQuery(OkHiFields.billingFirstNameField);
    const billingLastNameField = jQuery(OkHiFields.billingLastNameField);
    const billingPhoneField = jQuery(OkHiFields.billingPhoneField);
    const target = document.querySelector(
        OkHiFields.locationCardContainerElement
    );
    const locationCard = new okcollect({
        target,
        props: {
            API_KEY: wcOkHiJson.key,
            userFirstName: billingFirstNameField.val(),
            userLastName: billingLastNameField.val(),
            userPhoneNumber: autoPrefixPhone(billingPhoneField.val() as string),
            onAddressSelected: okCollectSuccessHandler,
            onError: okCollectErrorHandler,
            streetviewEnabled: wcOkHiJson.config.streetviewEnabled,
            toTheDoorEnabled: wcOkHiJson.config.toTheDoorEnabled,
            name: 'OkHi',
            styleSettings: {
                primaryColor: wcOkHiJson.styles.color,
                highlightColor: '#85FFC7'
            },
            appSettings: {
                name: wcOkHiJson.app.name,
                version: wcOkHiJson.app.version
            }
        }
    });

    billingFirstNameField.on('input', (ev: any) => {
        locationCard.$set({
            userFirstName: ev.target.value
        });
    });
    billingLastNameField.on('input', (ev: any) => {
        locationCard.$set({
            userLastName: ev.target.value
        });
    });
    billingPhoneField.on('input', (ev: any) => {
        locationCard.$set({
            userPhoneNumber: autoPrefixPhone(ev.target.value)
        });
        okCollectErrorHandler(null);
        resetOkHiFields();
    });

    /**
     * reset fields set by OkHi
     */
    try {
        /**
         * show location card for repeat users
         * for a zero click user experience
         */
        jQuery('#okhi-loader').hide();
        jQuery('#selected-location-card').show();

        // hide default fields
        jQuery.each(['#billing_okhi_street_name_field'], function (_, item) {
            jQuery(item).hide();
        });
    } catch (error) {
        handleFatalError(error);
        console.error('Zero click card load erroring out:', error);
    }
}
window['okhi_init'] = okhi_init;
