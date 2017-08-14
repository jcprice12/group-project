// var map;
// var storeInfoWindow;
// var myInfoWindow;
// var findStoresButton;
//
// function initMap() {
// 	if(navigator.geolocation){
//
// 		findStoresButton = document.getElementById("findStoresButton");
// 		findStoresButton.addEventListener("click", function(event){
// 			initMap();
// 		});
//
// 		navigator.geolocation.getCurrentPosition(function(position) {
//
//             var myPos = {
//               lat: position.coords.latitude,
//               lng: position.coords.longitude
//             };
//
// 			map = new google.maps.Map(document.getElementById('map'), {
// 			  center: myPos,
// 			  zoom: 13,
// 			});
//
// 			myInfoWindow = new google.maps.InfoWindow();
//         	var myMarker = new google.maps.Marker({
// 				map: map,
// 			 	position: myPos,
// 			 	icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
// 			});
// 			google.maps.event.addListener(myMarker, 'click', function() {
// 				myInfoWindow.setContent("You are here");
// 				myInfoWindow.open(map, this);
// 			});
//
//         	storeInfoWindow = new google.maps.InfoWindow();
// 			var placesService = new google.maps.places.PlacesService(map);
// 			placesService.nearbySearch({
// 			  location: myPos,//put my current location here
// 			  radius: 4000,
// 			  type: ['grocery_or_supermarket'],//why is this deprecated? There's no alternative in the documentation.
// 			  keyword: ['grocery'],
// 			}, handleSearchResults);
//
// 		}, function() {
//             handleLocationError(true);
//         });
// 	} else {
//     	// Browser doesn't support Geolocation
//     	handleLocationError(false);
//     }
// }
//
// function handleLocationError(browserHasGeolocation){
// 	if(browserHasGeolocation){
// 		alert("Error: The Geolocation service failed.");
// 	} else {
// 		alert("Error: Your browser does not support geolocation");
// 	}
// }
//
// function handleSearchResults(results, status) {
// 	if (status === google.maps.places.PlacesServiceStatus.OK) {
// 	  for (var i = 0; i < results.length; i++) {
// 	    createMarker(results[i]);
// 	  }
// 	}
// }
//
// function createMarker(place) {
// 	var marker = new google.maps.Marker({
// 		map: map,
// 	 	position: place.geometry.location,
// 	});
//
// 	google.maps.event.addListener(marker, 'click', function() {
// 		storeInfoWindow.setContent(buildPlaceInfo(place));
// 		myInfoWindow.close();
// 		storeInfoWindow.open(map, this);
// 	});
// }
//
// function buildPlaceInfo(place){
// 	var placeContainer = $("<div>");
// 	placeContainer.addClass("placeContainer");
//
// 	var nameContainer = $("<div>");
// 	nameContainer.addClass("placeNameContainer");
// 	nameContainer.text(place.name);
// 	placeContainer.append(nameContainer);
//
// 	if(place.photos){
// 		var image = $("<img>");
// 		image.addClass("placeImage");
// 		image.attr("src", place.photos[0].getUrl({maxWidth: 400, maxHeight: 200}));
// 		placeContainer.append(image);
// 	}
//
// 	if(place.vicinity) {
// 		var addressContainer = $("<div>");
// 		addressContainer.addClass("placeAddress");
// 		addressContainer.text(place.vicinity);
// 		placeContainer.append(addressContainer);
// 	}
//
// 	if(place.opening_hours) {
// 		var openStatus = $("<div>");
// 		openStatus.addClass("placeOpenStatus");
// 		if(place.opening_hours.open_now){
// 			openStatus.text("Open Now");
// 			openStatus.css("color", "green");
// 		} else {
// 			openStatus.text("Closed");
// 			openStatus.css("color","red");
// 		}
// 		placeContainer.append(openStatus);
// 	}
// 	return placeContainer.html();
// }
//
// module.exports = {
//   initMap,
// };