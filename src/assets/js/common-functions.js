var copy = {
  createOtherInformation: 'Create your delivery location',
  updateOtherInformation: 'Change your delivery notes',
  createLocation: 'Create a new pickup location',
  selectLocation: 'Select a delivery location',
  upsellMessage: 'Create your first delivery location with OkHi!',
};
var handleOnSuccess = function (data, isCallBackCard) {
  // handle your success here with the data you get back
  if (!data || !data.location) {
    return
  }
  var locationRawData = document.getElementById('billing_okhi_location_data');
  var deliveryNotes = document.getElementById('order_comments');
  var billingAddress1 = document.getElementById('billing_address_1');
  var locationOkHiId = document.getElementById('billing_okhi_id');
  var okhiURL = document.getElementById('billing_okhi_url');
  var postcode = document.getElementById('billing_postcode');

  if (locationRawData && data.location) {
    locationRawData.value = JSON.stringify(data.location);
  }
  if (deliveryNotes && data.location.otherInformation) {
    deliveryNotes.value = data.location.otherInformation;
  }
  if (billingAddress1 && data.location.streetName) {
    billingAddress1.value = data.location.streetName;
  }
  if (locationOkHiId && data.location.id) {
    locationOkHiId.value = data.location.id;
  }
  if (okhiURL && data.location.url) {
    okhiURL.value = data.location.url;
  }
  if (postcode && data.location.url) {
    postcode.value = data.location.plusCode;
  }

  // trigger calculation of shipping costs
  jQuery(document.body).trigger('update_checkout');

  if (!isCallBackCard) {
    showLocationCard(data);
  }
};

var handleOnError = function (error) {
  var errorElement = document.getElementById('okhi-errors');
  if (!errorElement) {
    return;
  }
  if (!error) {
    errorElement.innerHTML = "";
    return;
  }
  // handle errors here e.g fallback to your own way of collecting a location information
  errorElement.innerHTML = error.message ? error.message : 'Something went wrong please try again';
};