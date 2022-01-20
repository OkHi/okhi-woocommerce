function okhi_init() {
    var okhiBillingPhoneField = document.getElementById('billing_phone');
    var okhiBillingLastNameField = document.getElementById('billing_last_name');
    var okhiBillingFirstNameField = document.getElementById('billing_first_name');
    var okhiRequiredAddressField = document.getElementById('billing_address_1');
    var okhiBillingPostcodeField = document.getElementById('billing_postcode');
    var okhiBillingOtherInformationField = document.getElementById('order_comments');
    var okhiBillingStreetNameField = document.getElementById('billing_okhi_street_name');
    var okhiBillingPropertyNameField = document.getElementById('billing_okhi_property_name');
    var okhiBillingPropertyNumberField = document.getElementById('billing_okhi_property_number');
    var okhiBillingOkHiLatField = document.getElementById('billing_okhi_lat');
    var okhiBillingOkHiLonField = document.getElementById('billing_okhi_lon');
    var okhiBillingOkHiPlaceIdField = document.getElementById('billing_okhi_place_id');
    var okhiBillingOkHiIdField = document.getElementById('billing_okhi_id');
    var okhiBillingOkHiTokenField = document.getElementById('billing_okhi_token');
    var okhiBillingOkHiURLField = document.getElementById('billing_okhi_url');
    var okhiLocationCardContainerElement = document.getElementById('selected-location-card');
    var errorElement = document.getElementById('okhi-errors');
    /**
     * Handle data received from OkHi
     * @param {Object} data
     * @param {function} isCallBackCard
     */
    var okhiHandleOnSuccess = function (data) {
        // handle your success here with the data you get back
        if (!data) {
            return;
        }
        var streetName = data.street_name, propertyName = data.property_name, propertyNumber = data.property_number, geoPoint = data.geo_point, directions = data.directions, id = data.id, url = data.url, otherInformation = data.other_information, plusCode = data.plus_code, place_id = data.place_id, token = data.token;
        var addressTextData = [];
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
        if (typeof okhiBillingOtherInformationField !== 'undefined' &&
            otherInformation) {
            okhiBillingOtherInformationField.value = otherInformation;
        }
        if (typeof okhiBillingPostcodeField !== 'undefined' && plusCode) {
            okhiBillingPostcodeField.value = plusCode;
        }
        if (typeof okhiBillingStreetNameField !== 'undefined' && streetName) {
            okhiBillingStreetNameField.value = streetName;
        }
        if (typeof okhiBillingPropertyNameField !== 'undefined' &&
            propertyName) {
            okhiBillingPropertyNameField.value = propertyName;
        }
        if (typeof okhiBillingPropertyNumberField !== 'undefined' &&
            propertyNumber) {
            okhiBillingPropertyNumberField.value = propertyNumber;
        }
        if (typeof okhiBillingOkHiLatField !== 'undefined' &&
            geoPoint &&
            geoPoint.lat) {
            okhiBillingOkHiLatField.value = geoPoint.lat;
        }
        if (typeof okhiBillingOkHiLonField !== 'undefined' &&
            geoPoint &&
            geoPoint.lon) {
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
    var okhiHandleError = function (error) {
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
    var locationCard = new okcollect({
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
    var okhiAddEvent = function (obj, type, fn) {
        if (obj.addEventListener) {
            obj.addEventListener(type, fn, false);
        }
        else if (obj.attachEvent) {
            obj['e' + type + fn] = fn;
            obj[type + fn] = function () {
                obj['e' + type + fn](event);
            };
            obj.attachEvent('on' + type, obj[type + fn]);
        }
        else {
            obj['on' + type] = obj['e' + type + fn];
        }
    };
    var handleFatalError = function (error) {
        if (error && error.code === 'invalid_phone') {
            // this is not fatal
            okhiHandleError(error);
            return;
        }
        jQuery.each([
            // '#billing_country_field',
            // '#billing_address_1_field',
            // '#billing_postcode_field',
            // '.woocommerce-additional-fields',
            '#billing_okhi_location_data_field' //given this is required
        ], function (_, item) {
            jQuery(item).show();
        });
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
    okhiBillingPhoneField.addEventListener('input', function (ev) {
        locationCard.$set({
            userPhoneNumber: autoPrefixPhone(ev.target.value)
        });
    });
    // try to auto fix phone number
    function autoPrefixPhone(phone) {
        if (phone.indexOf('0') === 0) {
            return wcOkHiJson.countryCallingCode + phone.slice(1);
        }
        return phone;
    }
    /**
     * reset fields set by OkHi
     */
    var okhiResetFields = function () {
        var fields = [
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
        for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
            var field = fields_1[_i];
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
    }
    catch (error) {
        handleFatalError(error);
        console.error('Zero click card load erroring out:', error);
    }
}
//# sourceMappingURL=okhi-actions.js.map