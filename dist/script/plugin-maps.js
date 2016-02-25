// Define variavel maps
var map;


// Minha posição no maps
myPosition = {lat: -22.7378623, lng: -47.3335748};

// Function do maps
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: myPosition,
    zoom: 18,
    scrollwheel: false,
    mapTypeControl: false,
    zoomControl: false,
    scaleControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    
  });

  var marker = new google.maps.Marker({
    map: map,
    position: myPosition,
    title: 'Piuui'
  });
}

document.addEventListener('DOMContentLoaded', function() {
  initMap();
});