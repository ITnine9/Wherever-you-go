var watchId = null; //watchId is used to stop watch behavior

var ourCoords = {
latitude: 47.624851,
longitude: -122.52099
};

var map;

var timer = 0;

var prevCoords = null;

function showMap(coords) {
  var googleLatAndLong = new google.maps.LatLng(coords.latitude, coords.longitude);

  var mapOptions = {
    zoom: 16,
    center: googleLatAndLong,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var mapDiv = document.getElementById("map");
  map = new google.maps.Map(mapDiv, mapOptions);

  var title = "Your Location";
  var content = "You are here: " + coords.latitude + ", " + coords.longitude;
  addMarker(map, googleLatAndLong, title, content);
}

$(document).ready( function getMyLocation() {
  if (navigator.geolocation) {
    $("#watch").click(watchLocation);
    $("#clearWatch").click(clearWatch);
    // navigator.geolocation.getCurrentPosition(displayLocation, displayError);
  } else {
    alert("Oops, no geolocation support");
  }
}
);

function watchLocation() {
  watchId = navigator.geolocation.watchPosition(displayLocation, displayError, {timeout: 5000});
}

function clearWatch() {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
}

function scrollMapToPosition(coords) {
  var latitude = coords.latitude;
  var longitude = coords.longitude;
  var latlong = new google.maps.LatLng(latitude, longitude);

  map.panTo(latlong);

  addMarker(map, latlong, "Your new location", "You moved to: " +  latitude + ", " + longitude);
}

function displayLocation(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;

  $("#status").html("You've been watching! " + timer);
  timer++;
  $("#location").html("You are at Latitude: " + latitude + " Longitude, " + longitude);

  $("#location").append(" with " + position.coords.accuracy + " meters accuracy.");

  var km = computeDistance(position.coords, ourCoords);
  $("#distance").html("You are " + km + " km from the WickedlySmart HQ");

  if (map == null) {
    showMap(position.coords);
    prevCoords = position.coords;
  } else {
    var meters = computeDistance(position.coords, prevCoords) * 1000;
    if (meters > 20) {
      scrollMapToPosition(position.coords);
      prevCoords = position.coords;
    }
  }
}

function displayError(error) {
  var errorTypes = {
    0: "Unknown error",
    1: "Permission denied by user",
    2: "Position is not available",
    3: "Request timed out"
  };
  var errorMessage = errorTypes[error.code];
  if (error.code == 0 || error.code == 2) {
    errorMessage = errorMessage + " " + error.message;
  }
  $("#location").html(errorMessage);
}

function computeDistance(startCoords, destCoords) {
  var startLatRads = degreesToRadians(startCoords.latitude);
  var startLongRads = degreesToRadians(startCoords.longitude);
  var destLatRads = degreesToRadians(destCoords.latitude);
  var destLongRads = degreesToRadians(destCoords.longitude);
  var Radius = 6371; // radius of the Earth in km
  var distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) +
  Math.cos(startLatRads) * Math.cos(destLatRads) *
  Math.cos(startLongRads - destLongRads)) * Radius;
  return distance;
}

function degreesToRadians(degrees) {
var radians = (degrees * Math.PI)/180;
return radians;
}

function addMarker(map, latlong, title, content) {
  var markerOptions = {
    position: latlong,
    map: map,
    title: title,
    clickable: true
  };
  var marker = new google.maps.Marker(markerOptions);

  var infoWindowOptions = {
    content: content,
    position: latlong
  };

  var infoWindow = new google.maps.InfoWindow(infoWindowOptions);

  google.maps.event.addListener(marker, "click", function() {
    infoWindow.open(map);
  });

}
