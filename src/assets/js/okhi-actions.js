var okhi_init = function(stylesJSON, configJSON) {
    var okhiLocationCardContainerElement = document.getElementById(
        'selected-location-card'
    );
    var okhiRequiredAddressField = document.getElementById('billing_address_1');
    var okhiDeliveryLocationButton = document.getElementById('lets-okhi');
    var okhiBillingPhoneField = document.getElementById('billing_phone');
    var okhiBillingLastName = document.getElementById('billing_last_name');
    var okhiBillingFirstName = document.getElementById('billing_first_name');
    var okhiBillingOkHiLocationData = document.getElementById(
        'billing_okhi_location_data'
    );
    var okhiBillingOkHiId = document.getElementById('billing_okhi_id');
    var okhiBillingOkHiURL = document.getElementById('billing_okhi_url');
    var okhiBillingPostcode = document.getElementById('billing_postcode');
    var okhiBillingOtherInformation = document.getElementById('order_comments');
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

    /**
     * configure */
    var okhi_widget_styles = new window.okhi.OkHiStyle(window.okhi_styles);
    var okhi_config = new window.okhi.OkHiConfig(window.okhi_config);

    /***
     * common functions
     ***/

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
        onError, // = okhiHandleOnError
        currentLocationObject
    ) {
        // empty the container element
        // containerElement.innerHTML = '';

        if (!user.phone) {
            return okhiHandleOnError(
                new Error('Enter a phone number to continue')
            );
        }
        containerElement.style.display = 'block';
        console.log('currentLocationObject', currentLocationObject);

        return new window.okhi.OkHiLocationCard(
            {
                user: user,
                // auth: okhi_auth,
                style: okhi_widget_styles,
                config: okhi_config,
                copy: okhiCopy,
                location: currentLocationObject
            },
            containerElement,
            function(error, data) {
                if (error) {
                    // handle OkHiError
                    console.log(error.code);
                    console.log(error.message);
                    onError(error);
                } else {
                    // handle OkHiUser and OkHiLocation
                    onSuccess(data);
                    okhiLocationCardContainerElement.style.display = 'block';
                }
            }
        );
        return new window.okhi.LocationCard({
            element: containerElement,
            user: user,
            onSuccess: onSuccess,
            onError: onError,
            style: okhi_widget_styles,
            location: currentLocationObject,
            copy: okhiCopy,
            config: okhi_config
        });
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
        console.log(data);
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
                okhiHandleOnError,
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
    var okhiHandleOnError = function(error) {
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

    var handleFatalError = function() {
        jQuery.each(
            [
                '#billing_country_field',
                '#billing_address_1_field',
                '#billing_postcode_field',
                '.woocommerce-additional-fields',
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
            okhiUser = new window.okhi.OkHiUser({
                firstName: okhiBillingFirstName,
                lastName: okhiBillingLastName,
                phone: okhiBillingPhoneField.value
            });

            okhiHandleOnError(null);
            okhiResetFields();
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
                okhiHandleOnError
            );
        } catch (error) {
            okhiHandleOnError(error);
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
        okhiHandleOnError(null);

        // craete okhi user object
        var firstName = document.getElementById('billing_first_name');
        var lastName = document.getElementById('billing_last_name');
        var phone = document.getElementById('billing_phone');
        if (!phone || !phone.value) {
            return okhiHandleOnError(
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
                style: okhi_widget_styles,
                config: okhi_config,
                mode: window.okhi.OkHiLocationManagerLaunchMode.select_location,
                copy: okhiCopy,
                location: currentLocationObject
            });

            locationManager.launch(function(error, data) {
                if (error) {
                    throw error;
                }
                okhiHandleOnSuccess(data);
                okhiDeliveryLocationButton.style.display = 'none';
                okhiLocationCardContainerElement.style.display = 'block';
            });
        } catch (error) {
            // something broke, allow user to proceed manually
            handleFatalError();
            console.log('launch manager errors', error);
        }

        // instanciate manager

        // var locationManager = new window.okhi.LocationManager({
        //   user: user,
        //   onSuccess: function (data) {
        //     okhiHandleOnSuccess(data);
        //     okhiDeliveryLocationButton.style.display = 'none';
        //     okhiLocationCardContainerElement.style.display = 'block';
        //   },
        //   onError: okhiHandleOnError,
        //   style: okhi_widget_styles,
        //   copy: okhiCopy,
        //   config: okhi_config,
        // });
        // var currentLocationObject = null;
        // var currentLoctionIdElement = document.getElementById('billing_okhi_id');
        // if (currentLoctionIdElement && currentLoctionIdElement.value) {
        //   currentLocationObject = {
        //     id: currentLoctionIdElement.value // The OkHi location id you want manipulated in the selected mode
        //   }
        // }
        // var launchConfiguration = {
        //   mode: 'select_location',
        //   location: currentLocationObject
        // };
        // locationManager.launch(launchConfiguration);
    };
    /**
     * listen for changes in the phone field
     */
    okhiAddEvent(okhiBillingPhoneField, 'blur', okhiHandlePhoneChange);

    /**
     * Delivery location button listener
     */
    okhiAddEvent(
        okhiDeliveryLocationButton,
        'click',
        okhiHandleDeliveryLocationButtonClick
    );

    try {
        /**
         * show location card for repeat users
         * for a zero click user experience
         */
        jQuery('#okhi-loader').hide();
        if (okhiBillingPhoneField && okhiBillingPhoneField.value) {
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
                okhiHandleOnError
            );
        } else {
            /**
             * otherwise show a button to launch OkHi
             * location manager
             */
            okhiDeliveryLocationButton.style.display = 'block';
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
        handleFatalError();
        console.log('Erroring out:', error);
    } finally {
        jQuery.each(
            ['#billing_okhi_id_field', '#billing_okhi_url_field'],
            function(_, item) {
                jQuery(item).hide();
            }
        );
    }
};
