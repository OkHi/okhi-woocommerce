var deliveryLocationButton = document.getElementById('lets-okhi');
var locationCard = document.getElementById('selected-location-card');
locationCard.style.display = 'none';
var handleButtonClick = function (e) {
  if (e) {
    e.preventDefault();
  }
  // reset errors
  handleOnError(null);
  //process the data
  var firstName = document.getElementById('billing_first_name');
  var lastName = document.getElementById('billing_last_name');
  var phone = document.getElementById('billing_phone');
  if (!phone || !phone.value) {
    return handleOnError(new Error('Missing phone number'));
  }
  var user = {
    phone: phone.value,
    firstName: firstName ? firstName.value : '',
    lastName: lastName ? lastName.value : '',
  };
  var locationManager = new okhi.LocationManager({
    user: user,
    onSuccess: handleOnSuccess,
    onError: handleOnError,
    style: okhi_widget_styles
  });
  var currentLocationObject = null;
  var currentLoctionIdElement = document.getElementById('billing_okhi_id');
  if (currentLoctionIdElement && currentLoctionIdElement.value) {
    currentLocationObject = {
      id: currentLoctionIdElement.value // The OkHi location id you want manipulated in the selected mode
    }
  }
  var launchConfiguration = {
    mode: 'select_location',
    location: currentLocationObject
  };
  locationManager.launch(launchConfiguration);
};
deliveryLocationButton.addEventListener('click', handleButtonClick);
// show location card once done with manager
var showLocationCard = function(data) {
  var locationCard = document.getElementById('selected-location-card');
      if(locationCard.innerHTML !== '') {
        return;
      }
      var currentLocationObject = data.location ? data.location : null;
      
      deliveryLocationButton.style.display = 'none';
      locationCard.style.display = 'block';
      locationCard.innerHTML = '';
      var locationCard = new okhi.LocationCard({
        element: locationCard, // required
        user: data.user, // required
        onSuccess: function(data){
          handleOnSuccess(data,true)
        }, // optional
        onError: handleOnError, // optional
        style: okhi_widget_styles, // optional
        location: currentLocationObject,
        copy: {
          createOtherInformation: 'Delivery instructions'
        } // optional
      });
    };