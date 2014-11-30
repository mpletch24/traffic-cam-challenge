// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";


$(function() {
	// create and add map to div
	var center = {lat: 47.6, lng: -122.3};
	var mapElem = document.getElementById('map');
	var map = new google.maps.Map(mapElem, {
		center: center,
		zoom: 12 
	});

	var infoWindow = new google.maps.InfoWindow();
	var cameraList;
	var mapMarkers = [];


	// retrieve camera data from json object
	$.getJSON("http://data.seattle.gov/resource/65fc-btcc.json")
		.done(function(data, trafficCams) {
			cameraList = data;
			data.forEach(function(camera) {
				var marker = new google.maps.Marker({ 
				position: {
					lat: Number(camera.location.latitude),
					lng: Number(camera.location.longitude)
				},
				map: map
			});

			mapMarkers.push(marker);

			//display infoWindow for camera marker 
			google.maps.event.addListener(marker, 'click', function() {
				map.panTo(this.getPosition());
				var markerHTML= '<h1>' + camera.cameralabel + '</h1>' + '<img src=' + camera.imageurl.url + '>';
				infoWindow.setContent(markerHTML);
				infoWindow.open(map, this);
			});

			google.maps.event.addListener(marker, 'click', toggleBounce);

			function toggleBounce() {
				if (marker.getAnimation() != null) {
    				marker.setAnimation(null);
  				} else {
    				marker.setAnimation(google.maps.Animation.BOUNCE);
  				}
			};

			google.maps.event.addListener(map, 'click', function() {
				var openWindow = infoWindow.close(map, this);
				marker.setAnimation(null);
			});


			//filter camera stations
            $("#search").bind('search keyup', function() {
            	var currentSearch = this.value;
            	currentSearch = currentSearch.toLowerCase();
            	var cameralabel = camera.cameralabel;
            	cameralabel = cameralabel.toLowerCase();
               
               if (cameralabel.indexOf(currentSearch) < 0) {
                  marker.setMap(null);
               } else {
                  marker.setMap(map);
               }
            });
         });
      })

      .fail(function(err) {
         console.log(err);
         //notify user of error
      })
      .always(function() {
         $('#ajax-loader').fadeOut();
      })
});

