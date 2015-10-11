var dtime = 0;
var refreshRate = 5000;
var deadTime = 5;
var userObject = {
  // some shit, profile, etc
  name: "Chuck Norris",
  email: "chuck97@hotmail.com"
}

$(function() {
    // Parse.$ = jQuery;

    Parse.initialize("Q8AO7vGBXb2qwISdolBabcdo8q1N5uKY5k5xYNHf", "WXft6KXdY4vWGEQjhyZ1yfk7nzOJorkplFsY78IB");

    var userGeoPoint = new Parse.GeoPoint.current({
      success: function(userGeoPoint) {
        userObject.location = userGeoPoint;
        userObject.initPoint = userGeoPoint;
      }
    });
});


var map, myloc, me, searchBox, directionsDisplay;
function initMap() {
  me = new google.maps.LatLng(20.7351025, -103.4551638);
  map = new google.maps.Map(document.getElementById('map'), {
    center: me,
    scrollwheel: true,
    zoom: 20,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // [START region_getplaces]
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    var closest;
    var closestDistance;
    places.forEach(function(place) {
      placeLoc = new Parse.GeoPoint(place.geometry.location.J, place.geometry.location.M);
      var distance = KmDistance(userObject.location, placeLoc);
      if (!closest || distance < closestDistance) {
        closest = place;
        closestDistance = distance;
      }
    });
    places = [closest];

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));
      directionsDisplay = new google.maps.DirectionsRenderer({
        map: map
      });
      endRoute(userObject, routeId);
      routeId = startRoute(place.geometry.location, userObject);

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
  // [END region_getplaces]

  myloc = new google.maps.Marker({
   clickable: false,
   icon:  new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
                                                   new google.maps.Size(22,22),
                                                   new google.maps.Point(0,18),
                                                   new google.maps.Point(11,11)),
   shadow: null,
   zIndex: 999,
   map: map
  });
}

function startRoute(endPoint, user) {
  directionsDisplay.setMap(null);
  user.destiny = endPoint;
  var interval = self.setInterval(function(){
    trackUser(user);
  }, refreshRate);

  // Set destination, origin and travel mode.
  var request = {
    destination: endPoint,
    origin: me,
    travelMode: google.maps.TravelMode.WALKING,
    provideRouteAlternatives: true
  };

  var getColor = function(i, len) {
    if (i == 0){
      return "red"
    } else if (i == len-1) {
        return "blue";
    } else {
      return "gray"
    }
  }

  // Pass the directions request to the directions service.
  var directionsService = new google.maps.DirectionsService();
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      // Display the routes on the map.
      for (var i = 0, len = response.routes.length; i < len; i++) {
                new google.maps.DirectionsRenderer({
                    map: map,
                    directions: response,
                    routeIndex: i,
                    polylineOptions: {
                      strokeColor: getColor(i, len)
                    }
                });
            }
    } else {
       $("#error").append("Unable to retrieve your route<br />");
    }
  });
  return interval;
}

var displayHelp = function(controlDiv){
  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click para buscar talleres';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.lineHeight = '38px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = 'Talleres';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to Chicago.
  controlUI.addEventListener('click', function() {
    $("#pac-input").val("Talleres de bicicletas");
      var input = document.getElementById('pac-input');
      google.maps.event.trigger(input, 'focus');
      google.maps.event.trigger(input, 'keydown', {
          keyCode: 13
      });
  });
}

var time = 0;
var something = false;
function trackUser(user) {
  var d = KmDistance(user.prevLocation, user.location) * 1000.0; // meters
  var v = d / (refreshRate); // m/s
  // console.log("Vel: " + v);
  if (v === 0) {
  console.log("tracking...");
    time += 1;
    if (time >= deadTime & !something) {
      something = true;
      var centerControlDiv = document.createElement('div');
      displayHelp(centerControlDiv);
      centerControlDiv.index = 1;
      map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);
    }
  }
}

function endRoute(user, intervalId) {
  directionsDisplay.setMap(null);
  var userGeoPoint = new Parse.GeoPoint.current({
    success: function(userGeoPoint) {
      user.endPoint = userGeoPoint;
    }
  });
  clearInterval(intervalId);

  // TODO: check endPoint and destiny
}

function KmDistance(l1, l2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(l2["_latitude"]-l1["_latitude"]);  // deg2rad below
  var dLon = deg2rad(l2["_longitude"]-l1["_longitude"]);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(l1["_latitude"])) * Math.cos(deg2rad(l2["_latitude"])) *
    Math.sin(dLon/2) * Math.sin(dLon/2);

  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

// handlers
var routeId;

$("#stop").click(function() {
  endRoute(userObject, routeId);
});

$("#map").dblclick(function() {
  map.setCenter(me);
});

setInterval(function () {
  var userGeoPoint = new Parse.GeoPoint.current({
    success: function(userGeoPoint) {
      me = new google.maps.LatLng(userGeoPoint["_latitude"], userGeoPoint["_longitude"]);
      myloc.setPosition(me);
      userObject.prevLocation = userObject.location;
      userObject.location = userGeoPoint;
    }
  });
}, 100);
