declare const jQuery: any;
declare const okhi: any;
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
};
interface Copy {
    createOtherInformation: string;
    updateOtherInformation: string;
    createLocation: string;
    selectLocation: string;
    upsellMessage: string;
}
interface Location {
    streetName: string;
    propertyName: string;
    propertyNumber: string;
    geoPoint: { lat: string; lon: string };
    placeId: string;
    directions: string;
    id: string;
    url: string;
    otherInformation: string;
    plusCode: string;
    token: string;
}
interface User {
    phone: string;
    firstName: string;
    lastName: string;
}
function okhi_init() {
    okhi.OkHiInit({
        app: {
            name: wcOkHiJson.app.name,
            version: wcOkHiJson.app.version,
            build: wcOkHiJson.app.build
        },
        platform: { name: 'web' },
        developer: { name: 'okhi' }
    });

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

    let okhiLocationCard;
    let okhiUser;
    const okhiCopy: Copy = {
        updateOtherInformation: 'Change your delivery notes',
        createLocation: 'Create a delivery location',
        selectLocation: 'Select a delivery location',
        upsellMessage: 'Create your first delivery location with OkHi!',
        createOtherInformation: 'Delivery notes'
    };

    const okhiDeliveryLocationButton = document.getElementById('lets-okhi');

    const okhiStyle = new okhi.OkHiStyle({
        color: wcOkHiJson.styles.color,
        logo: wcOkHiJson.styles.logo
    });

    const okhiConfig = new okhi.OkHiConfig({
        streetView: wcOkHiJson.config.streetView,
        appBar: wcOkHiJson.config.appBar
    });

    /**
     * event handler with compat setup
     * @param {*} obj
     * @param {*} type
     * @param {*} fn
     */
    const okhiAddEvent = function(obj, type, fn) {
        if (obj.addEventListener) {
            obj.addEventListener(type, fn, false);
        } else if (obj.attachEvent) {
            obj['e' + type + fn] = fn;
            obj[type + fn] = function() {
                obj['e' + type + fn](event);
            };
            obj.attachEvent('on' + type, obj[type + fn]);
        } else {
            obj['on' + type] = obj['e' + type + fn];
        }
    };

    /**
     * Show user's selected location
     * @param {Object} user - current user
     * @param {Object} containerElement - parent container element
     * @param {function} onSuccess
     * @param {function} onError
     * @param {Object} currentLocationObject
     */
    const okhiRenderLocationCard = function(
        user: User,
        containerElement: HTMLElement,
        onSuccess: Function, // = okhiHandleOnSuccess
        onError: Function, // = okhiHandleError
        currentLocationObject?: Location
    ) {
        // empty the container element
        // containerElement.innerHTML = '';

        if (!user.phone) {
            return okhiHandleError(
                new Error('Enter a phone number to continue')
            );
        }
        containerElement.style.display = 'block';

        return new okhi.OkHiLocationCard(
            {
                user,
                // auth: okhi_auth,
                style: okhiStyle,
                config: okhiConfig,
                copy: okhiCopy,
                location: currentLocationObject
            },
            containerElement,
            function(error, data) {
                if (error) {
                    // handle OkHiError
                    onError(error);
                } else {
                    // handle OkHiUser and OkHiLocation
                    onSuccess(data);
                }
            }
        );
    };

    /**
     * Handle data received from OkHi
     * @param {Object} data
     * @param {function} isCallBackCard
     */
    const okhiHandleOnSuccess = (data: { user: User; location: Location }) => {
        // handle your success here with the data you get back
        if (!data || !data.location) {
            return;
        }
        const { user, location } = data;
        okhiUser = new okhi.OkHiUser(user);
        const {
            streetName,
            propertyName,
            propertyNumber,
            geoPoint,
            placeId,
            directions,
            id,
            url,
            otherInformation,
            plusCode,
            token
        } = location;

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
            okhiBillingOkHiPlaceIdField.value = placeId || '';
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
        const currentLocationObject = new okhi.OkHiLocation(data.location);
        if (!okhiLocationCard) {
            okhiLocationCard = okhiRenderLocationCard(
                okhiUser,
                okhiLocationCardContainerElement,
                okhiHandleOnSuccess,
                okhiHandleError,
                currentLocationObject
            );
            return;
        }
        jQuery('#lets-okhi').hide();
        jQuery('#selected-location-card').show();
    };

    /**
     * Handle errors from OkHi
     * @param {Object} error
     */
    const okhiHandleError = function(error) {
        if (error && error.code === 'invalid_phone') {
            // how a button to launch OkHi
            jQuery('#lets-okhi').show();
            // hide card
            jQuery('#selected-location-card').hide();
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
    const handleFatalError = function(error) {
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
            function(_, item) {
                jQuery(item).show();
            }
        );
    };
    /**
     * handle user changing phone number
     * to ensure we always have the right location for the user phone
     * changes to phone would result in re-init of the card
     */

    const okhiHandlePhoneChange = function() {
        if (!okhiLocationCard) {
            // no location card so do nothing
            return;
        }

        if (okhiUser && okhiUser.phone === okhiBillingPhoneField.value) {
            return;
        }
        if (okhiBillingPhoneField.value) {
            okhiDeliveryLocationButton.style.display = 'none';
            okhiLocationCardContainerElement.style.display = 'block';
        } else {
            okhiLocationCardContainerElement.style.display = 'none';
            okhiDeliveryLocationButton.style.display = 'block';
        }
        try {
            okhiHandleError(null);
            okhiResetFields();

            okhiUser = new okhi.OkHiUser({
                firstName: okhiBillingFirstNameField.value,
                lastName: okhiBillingLastNameField.value,
                phone: okhiBillingPhoneField.value
            });
            // update current location card
            if (okhiLocationCard) {
                okhiLocationCard.user = okhiUser;
                return;
            }
            // new card
            okhiLocationCard = okhiRenderLocationCard(
                okhiUser,
                okhiLocationCardContainerElement,
                okhiHandleOnSuccess,
                okhiHandleError
            );
        } catch (error) {
            // hid
            okhiHandleError(error);
        }
    };

    /**
     * handle delivery location button click
     * to launch location manager
     */

    const okhiHandleDeliveryLocationButtonClick = function(e) {
        if (e) {
            e.preventDefault();
        }
        // reset errors
        okhiHandleError(null);

        // craete okhi user object
        if (!okhiBillingPhoneField || !okhiBillingPhoneField.value) {
            return okhiHandleError(
                new Error('Enter a phone number to continue')
            );
        }
        try {
            const user = new okhi.OkHiUser({
                phone: okhiBillingPhoneField.value,
                firstName: okhiBillingFirstNameField
                    ? okhiBillingFirstNameField.value
                    : '',
                lastName: okhiBillingLastNameField
                    ? okhiBillingLastNameField.value
                    : ''
            });

            // handle current location already selected
            let currentLocationObject = null;
            if (okhiBillingOkHiIdField && okhiBillingOkHiIdField.value) {
                currentLocationObject = new okhi.OkHiLocation({
                    id: okhiBillingOkHiIdField.value // The OkHi location id you want manipulated in the selected mode
                });
            }

            const locationManager = new okhi.OkHiLocationManager({
                user: user,
                // auth: okhi_auth,
                style: okhiStyle,
                config: okhiConfig,
                mode: okhi.OkHiLocationManagerLaunchMode.select_location,
                copy: okhiCopy,
                location: currentLocationObject
            });

            locationManager.launch(function(error, data) {
                if (error) {
                    return okhiHandleError(error);
                }
                okhiHandleOnSuccess(data);
                okhiDeliveryLocationButton.style.display = 'none';
                okhiLocationCardContainerElement.style.display = 'block';
            });
        } catch (error) {
            // something broke, allow user to proceed manually
            okhiHandleError(error);
            console.error('Launch manager errors:', error);
        }
    };
    /**
     * Add listeners
     */
    // listen for changes in the phone field
    okhiAddEvent(okhiBillingPhoneField, 'blur', okhiHandlePhoneChange);

    // Delivery location button listener
    okhiAddEvent(
        okhiDeliveryLocationButton,
        'click',
        okhiHandleDeliveryLocationButtonClick
    );

    // try to auto fix phone number
    function autoPrefixPhone() {
        if (okhiBillingPhoneField.value.indexOf('0') === 0) {
            okhiBillingPhoneField.value =
                wcOkHiJson.countryCallingCode +
                okhiBillingPhoneField.value.slice(1);
        }
    }

    /**
     * reset fields set by OkHi
     */
    const okhiResetFields = function() {
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
        if (okhiBillingPhoneField && okhiBillingPhoneField.value) {
            autoPrefixPhone();
            // create OkHi User object
            const firstName = okhiBillingFirstNameField
                ? okhiBillingFirstNameField.value
                : '';
            const lastName = okhiBillingLastNameField
                ? okhiBillingLastNameField.value
                : '';
            const phone =
                okhiBillingPhoneField && okhiBillingPhoneField.value
                    ? okhiBillingPhoneField.value
                    : '';
            okhiUser = new okhi.OkHiUser({ firstName, lastName, phone });

            // show location card
            okhiLocationCard = okhiRenderLocationCard(
                okhiUser,
                okhiLocationCardContainerElement,
                okhiHandleOnSuccess,
                okhiHandleError
            );
        } else {
            /**
             * otherwise show a button to launch OkHi
             * location manager
             */
            jQuery('#lets-okhi').show();
        }
        // hide default fields
        jQuery.each(['#billing_okhi_street_name_field'], function(_, item) {
            jQuery(item).hide();
        });
    } catch (error) {
        handleFatalError(error);
        console.error('Zero click card load erroring out:', error);
    }
}
