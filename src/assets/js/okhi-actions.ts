// declare const jQuery: any;
declare const okcollect: any;
declare const wcOkHiJson: {
    app: {
        name: string;
        version: string;
        build: number;
    };
    config: {
        appBar: {
            color: string;
        };
        streetView: boolean;
    };
    styles: {
        color: string;
        logo: string;
        name: string;
        classes: {
            'lc-container': string;
            'lc-title': string;
            'lc-button': string;
            'lc-top': string;
            'lc-bottom': string;
            'block-button': string;
            'up-container': string;
            'up-message': string;
            'lc-information': string;
        };
    };
    countryCallingCode: string;
    key: string;
};
interface Copy {
    createOtherInformation: string;
    updateOtherInformation: string;
    createLocation: string;
    selectLocation: string;
    upsellMessage: string;
}
interface Location {
    street_name: string;
    property_name: string;
    property_number: string;
    geo_point: { lat: string; lon: string };
    directions: string;
    id: string;
    url: string;
    other_information: string;
    place_id: string;
    plus_code: string;
    token: string;
}
interface User {
    phone: string;
    firstName: string;
    lastName: string;
}
function okhi_init() {
    const okhiBillingPhoneField = document.getElementById(
        'billing_phone'
    ) as HTMLInputElement;
    const okhiBillingLastNameField = document.getElementById(
        'billing_last_name'
    ) as HTMLInputElement;
    const okhiBillingFirstNameField = document.getElementById(
        'billing_first_name'
    ) as HTMLInputElement;
    const okhiRequiredAddressField = document.getElementById(
        'billing_address_1'
    ) as HTMLInputElement;
    const okhiBillingPostcodeField = document.getElementById(
        'billing_postcode'
    ) as HTMLInputElement;
    const okhiBillingOtherInformationField = document.getElementById(
        'order_comments'
    ) as HTMLInputElement;

    const okhiBillingStreetNameField = document.getElementById(
        'billing_okhi_street_name'
    ) as HTMLInputElement;
    const okhiBillingPropertyNameField = document.getElementById(
        'billing_okhi_property_name'
    ) as HTMLInputElement;
    const okhiBillingPropertyNumberField = document.getElementById(
        'billing_okhi_property_number'
    ) as HTMLInputElement;
    const okhiBillingOkHiLatField = document.getElementById(
        'billing_okhi_lat'
    ) as HTMLInputElement;
    const okhiBillingOkHiLonField = document.getElementById(
        'billing_okhi_lon'
    ) as HTMLInputElement;
    const okhiBillingOkHiPlaceIdField = document.getElementById(
        'billing_okhi_place_id'
    ) as HTMLInputElement;
    const okhiBillingOkHiIdField = document.getElementById(
        'billing_okhi_id'
    ) as HTMLInputElement;
    const okhiBillingOkHiTokenField = document.getElementById(
        'billing_okhi_token'
    ) as HTMLInputElement;
    const okhiBillingOkHiURLField = document.getElementById(
        'billing_okhi_url'
    ) as HTMLInputElement;

    const okhiLocationCardContainerElement = document.getElementById(
        'selected-location-card'
    );

    const errorElement = document.getElementById('okhi-errors');

    /**
     * Handle data received from OkHi
     * @param {Object} data
     * @param {function} isCallBackCard
     */
    const okhiHandleOnSuccess = (data: Location) => {
        // handle your success here with the data you get back
        if (!data) {
            return;
        }
        const {
            street_name: streetName,
            property_name: propertyName,
            property_number: propertyNumber,
            geo_point: geoPoint,
            directions,
            id,
            url,
            other_information: otherInformation,
            plus_code: plusCode,
            place_id,
            token
        } = data;

        const addressTextData = [];
        if (propertyName) {
            addressTextData.push(propertyName);
        }
        if (propertyNumber) {
            addressTextData.push(propertyNumber);
        }
        if (directions) {
            addressTextData.push(directions);
        }
        if (streetName) {
            addressTextData.push(streetName);
        }
        if (typeof okhiRequiredAddressField !== 'undefined') {
            okhiRequiredAddressField.value = addressTextData.join(', ').trim();
        }
        if (
            typeof okhiBillingOtherInformationField !== 'undefined' &&
            otherInformation
        ) {
            okhiBillingOtherInformationField.value = otherInformation;
        }
        if (typeof okhiBillingPostcodeField !== 'undefined' && plusCode) {
            okhiBillingPostcodeField.value = plusCode;
        }
        if (typeof okhiBillingStreetNameField !== 'undefined' && streetName) {
            okhiBillingStreetNameField.value = streetName;
        }
        if (
            typeof okhiBillingPropertyNameField !== 'undefined' &&
            propertyName
        ) {
            okhiBillingPropertyNameField.value = propertyName;
        }
        if (
            typeof okhiBillingPropertyNumberField !== 'undefined' &&
            propertyNumber
        ) {
            okhiBillingPropertyNumberField.value = propertyNumber;
        }
        if (
            typeof okhiBillingOkHiLatField !== 'undefined' &&
            geoPoint &&
            geoPoint.lat
        ) {
            okhiBillingOkHiLatField.value = geoPoint.lat;
        }
        if (
            typeof okhiBillingOkHiLonField !== 'undefined' &&
            geoPoint &&
            geoPoint.lon
        ) {
            okhiBillingOkHiLonField.value = geoPoint.lon;
        }
        if (typeof okhiBillingOkHiPlaceIdField !== 'undefined') {
            okhiBillingOkHiPlaceIdField.value = place_id || '';
        }
        if (typeof okhiBillingOkHiIdField !== 'undefined') {
            okhiBillingOkHiIdField.value = id || '';
        }
        if (typeof okhiBillingOkHiTokenField !== 'undefined') {
            okhiBillingOkHiTokenField.value = token || '';
        }
        if (typeof okhiBillingOkHiURLField !== 'undefined') {
            okhiBillingOkHiURLField.value = url || '';
        }

        // trigger calculation of shipping costs
        jQuery(document.body).trigger('update_checkout');
    };

    /**
     * Handle errors from OkHi
     * @param {Object} error
     */
    const okhiHandleError = function (error) {
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
            errorElement.innerHTML = '';
            return;
        }
        // handle errors here e.g fallback to your own way of collecting a location information
        errorElement.innerHTML = error.message
            ? error.message
            : 'Something went wrong please try again';
    };

    const locationCard = new okcollect({
        target: okhiLocationCardContainerElement,
        props: {
            API_KEY: wcOkHiJson.key,
            userFirstName: okhiBillingFirstNameField.value,
            userLastName: okhiBillingLastNameField.value,
            userPhoneNumber: autoPrefixPhone(okhiBillingPhoneField.value),
            onAddressSelected: okhiHandleOnSuccess,
            onError: console.log,
            streetviewEnabled: true,
            toTheDoorEnabled: true,
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

    // const okhiCopy: Copy = {
    //     updateOtherInformation: 'Change your delivery notes',
    //     createLocation: 'Create a delivery location',
    //     selectLocation: 'Select a delivery location',
    //     upsellMessage: 'Create your first delivery location with OkHi!',
    //     createOtherInformation: 'Delivery notes'
    // };

    /**
     * event handler with compat setup
     * @param {*} obj
     * @param {*} type
     * @param {*} fn
     */
    const okhiAddEvent = function (obj, type, fn) {
        if (obj.addEventListener) {
            obj.addEventListener(type, fn, false);
        } else if (obj.attachEvent) {
            obj['e' + type + fn] = fn;
            obj[type + fn] = function () {
                obj['e' + type + fn](event);
            };
            obj.attachEvent('on' + type, obj[type + fn]);
        } else {
            obj['on' + type] = obj['e' + type + fn];
        }
    };

    const handleFatalError = function (error) {
        if (error && error.code === 'invalid_phone') {
            // this is not fatal
            okhiHandleError(error);

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
    /**
     * handle user changing phone number
     * to ensure we always have the right location for the user phone
     * changes to phone would result in re-init of the card
     */

    /**
     * Add listeners
     */
    // listen for changes in the phone field
    okhiBillingFirstNameField.addEventListener('input', (ev: any) => {
        locationCard.$set({
            userFirstName: ev.target.value,
        })
    });
    okhiBillingLastNameField.addEventListener('input', (ev: any) => {
        locationCard.$set({
            userLastName: ev.target.value,
        })
    });
    okhiBillingPhoneField.addEventListener('input', (ev: any) => {
        locationCard.$set({
            userPhoneNumber: autoPrefixPhone(ev.target.value)
        });
    });

    // try to auto fix phone number
    function autoPrefixPhone(phone: string) {
        if (phone.indexOf('0') === 0) {
            return wcOkHiJson.countryCallingCode + phone.slice(1);
        }
        return phone;
    }

    /**
     * reset fields set by OkHi
     */
    const okhiResetFields = function () {
        const fields = [
            okhiRequiredAddressField,
            okhiBillingPostcodeField,
            okhiBillingOtherInformationField,
            okhiBillingStreetNameField,
            okhiBillingPropertyNameField,
            okhiBillingPropertyNumberField,
            okhiBillingOkHiLatField,
            okhiBillingOkHiLonField,
            okhiBillingOkHiPlaceIdField,
            okhiBillingOkHiIdField,
            okhiBillingOkHiURLField
        ];
        for (let field of fields) {
            field.value = '';
        }
    };
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
