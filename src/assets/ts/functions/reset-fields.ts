import { OkHiFields } from '../fields';

export const resetOkHiFields = function () {
    const fields = [
        jQuery(OkHiFields.requiredAddressField),
        jQuery(OkHiFields.billingPostcodeField),
        jQuery(OkHiFields.billingOtherInformationField),
        jQuery(OkHiFields.billingStreetNameField),
        jQuery(OkHiFields.billingPropertyNameField),
        jQuery(OkHiFields.billingPropertyNumberField),
        jQuery(OkHiFields.addressLine2Field),
        jQuery(OkHiFields.billingCompany),
        jQuery(OkHiFields.billingOkHiLatField),
        jQuery(OkHiFields.billingOkHiLonField),
        jQuery(OkHiFields.billingOkHiPlaceIdField),
        jQuery(OkHiFields.billingOkHiIdField),
        jQuery(OkHiFields.billingOkHiURLField),
        jQuery(OkHiFields.billingOkHiNeighborhoodField),
        jQuery(OkHiFields.billingStateField),
        jQuery(OkHiFields.billingCityField)
    ];
    for (let field of fields) {
        field.val('');
    }
};
