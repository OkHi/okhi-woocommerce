import { OkHiFields } from '../fields';
import { Location } from '../interfaces/location.interface';
import { okCollectErrorHandler } from './errorHandler';
import { resetOkHiFields } from './reset-fields';

export const okCollectSuccessHandler = (data: Location) => {
    okCollectErrorHandler(null);

    resetOkHiFields();
    const billingPostcodeField = jQuery(OkHiFields.billingPostcodeField);
    const billingOtherInformationField = jQuery(
        OkHiFields.billingOtherInformationField
    );
    const billingStreetNameField = jQuery(OkHiFields.billingStreetNameField);
    const billingPropertyNameField = jQuery(
        OkHiFields.billingPropertyNameField
    );
    const billingPropertyNumberField = jQuery(
        OkHiFields.billingPropertyNumberField
    );
    const billingOkHiLatField = jQuery(OkHiFields.billingOkHiLatField);
    const billingOkHiLonField = jQuery(OkHiFields.billingOkHiLonField);
    const billingOkHiPlaceIdField = jQuery(OkHiFields.billingOkHiPlaceIdField);
    const billingOkHiIdField = jQuery(OkHiFields.billingOkHiIdField);
    const billingOkHiURLField = jQuery(OkHiFields.billingOkHiURLField);
    const requiredAddressField = jQuery(OkHiFields.requiredAddressField);
    const billingOkHiNeighborhoodField = jQuery(
        OkHiFields.billingOkHiNeighborhoodField
    );
    const addressLine2Field = jQuery(OkHiFields.addressLine2Field);
    const billingCompany = jQuery(OkHiFields.billingCompany);
    const billingStateField = jQuery(OkHiFields.billingStateField);
    const billingCityField = jQuery(OkHiFields.billingCityField);
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
        city,
        state,
        neighborhood,
        unit,
        business_name: businessName
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
    if (typeof requiredAddressField !== 'undefined') {
        requiredAddressField.val(addressTextData.join(', ').trim());
    }
    if (
        typeof billingOtherInformationField !== 'undefined' &&
        otherInformation
    ) {
        billingOtherInformationField.val(otherInformation);
    }
    if (typeof billingPostcodeField !== 'undefined' && plusCode) {
        billingPostcodeField.val(plusCode);
    }
    if (typeof billingStreetNameField !== 'undefined' && streetName) {
        billingStreetNameField.val(streetName);
    }
    if (typeof billingPropertyNameField !== 'undefined' && propertyName) {
        billingPropertyNameField.val(propertyName);
    }
    if (typeof billingPropertyNumberField !== 'undefined' && propertyNumber) {
        billingPropertyNumberField.val(propertyNumber);
    }
    if (
        typeof billingOkHiLatField !== 'undefined' &&
        geoPoint &&
        geoPoint.lat
    ) {
        billingOkHiLatField.val(geoPoint.lat);
    }
    if (
        typeof billingOkHiLonField !== 'undefined' &&
        geoPoint &&
        geoPoint.lon
    ) {
        billingOkHiLonField.val(geoPoint.lon);
    }
    if (typeof billingOkHiPlaceIdField !== 'undefined') {
        billingOkHiPlaceIdField.val(place_id || '');
    }
    if (typeof billingOkHiIdField !== 'undefined') {
        billingOkHiIdField.val(id || '');
    }
    if (typeof billingOkHiURLField !== 'undefined') {
        billingOkHiURLField.val(url || '');
    }

    if (typeof billingCityField !== 'undefined' && city) {
        billingCityField.val(city);
    }
    if (typeof billingStateField !== 'undefined' && state) {
        billingStateField.val(state);
    }

    if (typeof addressLine2Field !== 'undefined' && unit) {
        addressLine2Field.val(unit);
    }

    if (typeof billingCompany !== 'undefined' && businessName) {
        billingCompany.val(businessName);
    }

    if (typeof billingOkHiNeighborhoodField !== 'undefined' && neighborhood) {
        billingOkHiNeighborhoodField.val(neighborhood);
    }

    // trigger calculation of shipping costs
    jQuery(document.body).trigger('update_checkout');
};
