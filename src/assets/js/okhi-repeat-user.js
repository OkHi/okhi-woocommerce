var deliveryLocationCard = document.getElementById('selected-location-card');
var user = {
  firstName: deliveryLocationCard.getAttribute('data-firstname'),
  lastName: deliveryLocationCard.getAttribute('data-lastname'),
  phone: deliveryLocationCard.getAttribute('data-phone'),
};
var locationCard = new okhi.LocationCard({
  element: deliveryLocationCard,
  user: user,
  onSuccess: function (data) {
    handleOnSuccess(data, true)
  },
  onError: handleOnError,
  style: okhi_widget_styles,
  // copy: copy,
});