function okhi_init() {
    window.okhi.OkHiInit({
        app: {
            name: wcOkHiJson.app.name,
            version: wcOkHiJson.app.version,
            build: wcOkHiJson.app.build
        },
        platform: { name: 'web' },
        developer: { name: 'okhi' }
    });

    var okhiBillingPhoneField = document.getElementById('billing_phone');
    var okhiBillingLastName = document.getElementById('billing_last_name');
    var okhiBillingFirstName = document.getElementById('billing_first_name');
    var okhiRequiredAddressField = document.getElementById('billing_address_1');
    var okhiBillingPostcode = document.getElementById('billing_postcode');
    var okhiBillingOtherInformation = document.getElementById('order_comments');

    var okhiBillingOkHiId = document.getElementById('billing_okhi_id');
    var okhiBillingOkHiURL = document.getElementById('billing_okhi_url');
    var okhiBillingOkHiLocationData = document.getElementById(
        'billing_okhi_location_data'
    );
    var okhiLocationCardContainerElement = document.getElementById(
        'selected-location-card'
    );

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

    var okhiStyle = new window.okhi.OkHiStyle({
        color: wcOkHiJson.styles.color,
        logo: wcOkHiJson.styles.logo
    });

    var okhiConfig = new window.okhi.OkHiConfig({
        streetView: wcOkHiJson.config.streetView,
        appBar: wcOkHiJson.config.appBar
    });

    /**
     * event handler with compat setup
     * @param {*} obj
     * @param {*} type
     * @param {*} fn
     */
    var okhiAddEvent = function(obj, type, fn) {
        if (obj.addEventListener) {
            obj.addEventListener(type, fn, false);
        } else if (obj.attachEvent) {
            obj['e' + type + fn] = fn;
            obj[type + fn] = function() {
                obj['e' + type + fn](window.event);
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
    var okhiRenderLocationCard = function(
        user,
        containerElement,
        onSuccess, // = okhiHandleOnSuccess
        onError, // = okhiHandleError
        currentLocationObject
    ) {
        // empty the container element
        // containerElement.innerHTML = '';

        if (!user.phone) {
            return okhiHandleError(
                new Error('Enter a phone number to continue')
            );
        }
        containerElement.style.display = 'block';

        return new window.okhi.OkHiLocationCard(
            {
                user: user,
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
                    okhiLocationCardContainerElement.style.display = 'block';
                }
            }
        );
    };

    /**
     * Handle data received from OkHi
     * @param {Object} data
     * @param {function} isCallBackCard
     */
    var okhiHandleOnSuccess = function(data) {
        // handle your success here with the data you get back
        if (!data || !data.location) {
            return;
        }
        if (typeof locationRawData !== 'undefined') {
            locationRawData.value = JSON.stringify(data.location);
        }

        var addressTextData = [];
        if (data.location.propertyName) {
            addressTextData.push(data.location.propertyName);
        }
        if (data.location.directions) {
            addressTextData.push(data.location.directions);
        }
        if (data.location.streetName) {
            addressTextData.push(data.location.streetName);
        }
        if (typeof okhiRequiredAddressField !== 'undefined') {
            okhiRequiredAddressField.value = addressTextData.join(', ').trim();
        }
        if (typeof okhiBillingOtherInformation !== 'undefined') {
            okhiBillingOtherInformation.value =
                data.location.otherInformation || '';
        }
        if (typeof okhiBillingPostcode !== 'undefined') {
            okhiBillingPostcode.value = data.location.plusCode || '';
        }
        if (typeof okhiBillingOkHiLocationData !== 'undefined') {
            okhiBillingOkHiLocationData.value = JSON.stringify(data.location);
        }
        if (typeof okhiBillingOkHiId !== 'undefined') {
            okhiBillingOkHiId.value = data.location.id || '';
        }
        if (typeof okhiBillingOkHiURL !== 'undefined') {
            okhiBillingOkHiURL.value = data.location.url || '';
        }

        // trigger calculation of shipping costs
        jQuery(document.body).trigger('update_checkout');
        currentLocationObject = new window.okhi.OkHiLocation(data.location);
        if (!okhiLocationCard) {
            okhiLocationCard = okhiRenderLocationCard(
                data.user,
                okhiLocationCardContainerElement,
                okhiHandleOnSuccess,
                okhiHandleError,
                currentLocationObject
            );
            return;
        }
        okhiDeliveryLocationButton.style.display = 'none';
        okhiLocationCardContainerElement.style.display = 'block';
    };

    /**
     * Handle errors from OkHi
     * @param {Object} error
     */
    var okhiHandleError = function(error) {
        console.error('Failing, but caught', error);
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
    var handleFatalError = function(error) {
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

    var okhiHandlePhoneChange = function() {
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
            okhiUser = new window.okhi.OkHiUser({
                firstName: okhiBillingFirstName,
                lastName: okhiBillingLastName,
                phone: okhiBillingPhoneField.value
            });

            // update current location card
            if (okhiLocationCard) {
                okhiLocationCard.user = okhiUser;
                return;
            }

            okhiLocationCard = okhiRenderLocationCard(
                okhiUser,
                okhiLocationCardContainerElement,
                function(data) {
                    okhiHandleOnSuccess(data, true);
                },
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

    var okhiHandleDeliveryLocationButtonClick = function(e) {
        if (e) {
            e.preventDefault();
        }
        // reset errors
        okhiHandleError(null);

        // craete okhi user object
        var firstName = document.getElementById('billing_first_name');
        var lastName = document.getElementById('billing_last_name');
        var phone = document.getElementById('billing_phone');
        if (!phone || !phone.value) {
            return okhiHandleError(
                new Error('Enter a phone number to continue')
            );
        }
        try {
            var user = new window.okhi.OkHiUser({
                phone: phone.value,
                firstName: firstName ? firstName.value : '',
                lastName: lastName ? lastName.value : ''
            });

            // handle current location already selected
            var currentLocationObject = null;
            var currentLoctionIdElement = document.getElementById(
                'billing_okhi_id'
            );
            if (currentLoctionIdElement && currentLoctionIdElement.value) {
                currentLocationObject = new window.okhi.OkHiLocation({
                    id: currentLoctionIdElement.value // The OkHi location id you want manipulated in the selected mode
                });
            }

            var locationManager = new window.okhi.OkHiLocationManager({
                user: user,
                // auth: okhi_auth,
                style: okhiStyle,
                config: okhiConfig,
                mode: window.okhi.OkHiLocationManagerLaunchMode.select_location,
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
    var okhiResetFields = function() {
        var fields = [
            okhiRequiredAddressField,
            okhiBillingOkHiLocationData,
            okhiBillingOkHiId,
            okhiBillingOkHiURL,
            okhiBillingPostcode,
            okhiBillingOtherInformation
        ];
        for (var index = 0; index < fields.length; index++) {
            var element = fields[index];
            element.value = '';
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
            okhiUser = new window.okhi.OkHiUser({
                firstName: okhiBillingFirstName
                    ? okhiBillingFirstName.value
                    : '',
                lastName: okhiBillingLastName ? okhiBillingLastName.value : '',
                phone:
                    okhiBillingPhoneField && okhiBillingPhoneField.value
                        ? okhiBillingPhoneField.value
                        : ''
            });

            // show location card
            okhiLocationCard = okhiRenderLocationCard(
                okhiUser,
                okhiLocationCardContainerElement,
                function(data) {
                    okhiHandleOnSuccess(data, true);
                },
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
        jQuery.each(
            [
                '#billing_country_field',
                '#billing_address_1_field',
                '#billing_postcode_field',
                '.woocommerce-additional-fields',
                '#billing_okhi_location_data_field'
            ],
            function(_, item) {
                jQuery(item).hide();
            }
        );
    } catch (error) {
        handleFatalError(error);
        console.error('Zero click card load erroring out:', error);
    }
}
