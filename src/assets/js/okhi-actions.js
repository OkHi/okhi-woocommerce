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
    var okhiLocationCard;
    var okhiUser;
    var okhiCopy = {
        updateOtherInformation: 'Change your delivery notes',
        createLocation: 'Create a delivery location',
        selectLocation: 'Select a delivery location',
        upsellMessage: 'Create your first delivery location with OkHi!',
        createOtherInformation: 'Delivery notes'
    };
    var okhiDeliveryLocationButton = document.getElementById('lets-okhi');
    var okhiStyle = new okhi.OkHiStyle({
        color: wcOkHiJson.styles.color,
        logo: wcOkHiJson.styles.logo
    });
    var okhiConfig = new okhi.OkHiConfig({
        streetView: wcOkHiJson.config.streetView,
        appBar: wcOkHiJson.config.appBar
    });
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
    /**
     * Show user's selected location
     * @param {Object} user - current user
     * @param {Object} containerElement - parent container element
     * @param {function} onSuccess
     * @param {function} onError
     * @param {Object} currentLocationObject
     */
    var okhiRenderLocationCard = function (user, containerElement, onSuccess, // = okhiHandleOnSuccess
    onError, // = okhiHandleError
    currentLocationObject) {
        // empty the container element
        // containerElement.innerHTML = '';
        if (!user.phone) {
            return okhiHandleError(new Error('Enter a phone number to continue'));
        }
        containerElement.style.display = 'block';
        return new okhi.OkHiLocationCard({
            user: user,
            // auth: okhi_auth,
            style: okhiStyle,
            config: okhiConfig,
            copy: okhiCopy,
            location: currentLocationObject
        }, containerElement, function (error, data) {
            if (error) {
                // handle OkHiError
                onError(error);
            }
            else {
                // handle OkHiUser and OkHiLocation
                onSuccess(data);
            }
        });
    };
    /**
     * Handle data received from OkHi
     * @param {Object} data
     * @param {function} isCallBackCard
     */
    var okhiHandleOnSuccess = function (data) {
        // handle your success here with the data you get back
        if (!data || !data.location) {
            return;
        }
        var user = data.user, location = data.location;
        okhiUser = new okhi.OkHiUser(user);
        var streetName = location.streetName, propertyName = location.propertyName, propertyNumber = location.propertyNumber, geoPoint = location.geoPoint, placeId = location.placeId, directions = location.directions, id = location.id, url = location.url, otherInformation = location.otherInformation, plusCode = location.plusCode, token = location.token;
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
        var currentLocationObject = new okhi.OkHiLocation(data.location);
        if (!okhiLocationCard) {
            okhiLocationCard = okhiRenderLocationCard(okhiUser, okhiLocationCardContainerElement, okhiHandleOnSuccess, okhiHandleError, currentLocationObject);
            return;
        }
        jQuery('#lets-okhi').hide();
        jQuery('#selected-location-card').show();
    };
    /**
     * Handle errors from OkHi
     * @param {Object} error
     */
    var okhiHandleError = function (error) {
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
    var okhiHandlePhoneChange = function () {
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
        }
        else {
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
            okhiLocationCard = okhiRenderLocationCard(okhiUser, okhiLocationCardContainerElement, okhiHandleOnSuccess, okhiHandleError);
        }
        catch (error) {
            // hid
            okhiHandleError(error);
        }
    };
    /**
     * handle delivery location button click
     * to launch location manager
     */
    var okhiHandleDeliveryLocationButtonClick = function (e) {
        if (e) {
            e.preventDefault();
        }
        // reset errors
        okhiHandleError(null);
        // craete okhi user object
        if (!okhiBillingPhoneField || !okhiBillingPhoneField.value) {
            return okhiHandleError(new Error('Enter a phone number to continue'));
        }
        try {
            var user = new okhi.OkHiUser({
                phone: okhiBillingPhoneField.value,
                firstName: okhiBillingFirstNameField
                    ? okhiBillingFirstNameField.value
                    : '',
                lastName: okhiBillingLastNameField
                    ? okhiBillingLastNameField.value
                    : ''
            });
            // handle current location already selected
            var currentLocationObject = null;
            if (okhiBillingOkHiIdField && okhiBillingOkHiIdField.value) {
                currentLocationObject = new okhi.OkHiLocation({
                    id: okhiBillingOkHiIdField.value // The OkHi location id you want manipulated in the selected mode
                });
            }
            var locationManager = new okhi.OkHiLocationManager({
                user: user,
                // auth: okhi_auth,
                style: okhiStyle,
                config: okhiConfig,
                mode: okhi.OkHiLocationManagerLaunchMode.select_location,
                copy: okhiCopy,
                location: currentLocationObject
            });
            locationManager.launch(function (error, data) {
                if (error) {
                    return okhiHandleError(error);
                }
                okhiHandleOnSuccess(data);
                okhiDeliveryLocationButton.style.display = 'none';
                okhiLocationCardContainerElement.style.display = 'block';
            });
        }
        catch (error) {
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
    okhiAddEvent(okhiDeliveryLocationButton, 'click', okhiHandleDeliveryLocationButtonClick);
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
        if (okhiBillingPhoneField && okhiBillingPhoneField.value) {
            autoPrefixPhone();
            // create OkHi User object
            var firstName = okhiBillingFirstNameField
                ? okhiBillingFirstNameField.value
                : '';
            var lastName = okhiBillingLastNameField
                ? okhiBillingLastNameField.value
                : '';
            var phone = okhiBillingPhoneField && okhiBillingPhoneField.value
                ? okhiBillingPhoneField.value
                : '';
            okhiUser = new okhi.OkHiUser({ firstName: firstName, lastName: lastName, phone: phone });
            // show location card
            okhiLocationCard = okhiRenderLocationCard(okhiUser, okhiLocationCardContainerElement, okhiHandleOnSuccess, okhiHandleError);
        }
        else {
            /**
             * otherwise show a button to launch OkHi
             * location manager
             */
            jQuery('#lets-okhi').show();
        }
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