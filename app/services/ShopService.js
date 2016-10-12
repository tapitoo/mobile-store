'use strict';
(function () {
	var app = angular.module('Tapitoo.ShopService', ['ui.router']);

	//factory for HTTP requests
	app.factory('ShopService', function (TAPITOO_CONFIG, OC_CONFIG, $http, $rootScope, $ionicLoading, $ionicPopup, $translate, $state, $cordovaGeolocation, $ImageCacheFactory) {
		var service = {};
		//var baseUrl = 'http://nodejs-geek12.rhcloud.com';
		// server Url
		var baseUrl = TAPITOO_CONFIG.backend;
		var _restaurantID = TAPITOO_CONFIG.restaurantID;

		var _locationID = '';
		var _finalUrl = '';
		var androidID = 0;
		var iosID = 0;
		var order = new Object;
		service.loc = [];
		service.url = baseUrl;
		service.restaurants = [];
		service.restaurantName = '';
		service.categoryName = '';
		service.menu = [];
		service.info = [];
		service.products = [];
		service.productInfo = [];
		service.productTotal = 0;
		service.url = baseUrl;
		service.subCategories = [];
		service.categProducts = [];
		service.allProducts = [];

		service.modifiers = [{"id": "1", "name": " Marime", "type": "single", "validation": "required", "modifierElement": [{"id": "2", "isActuallyProduct": "false", "name": "mica (25cm)", "price": "15"}, {"id": " 3", "isActuallyProduct": "false", "name": "medie (30cm)", "price": "20"}, {"id": "4", "isActuallyProduct": "false", "name": "mare (40cm)", "price": "30"}]}, {"id": "5", "name": " Blat", "type": "single", "validation": "required", "modifierElement": [{"id": "1", "isActuallyProduct": "false", "name": " traditional", "price": "0"}, {"id": " 2", "isActuallyProduct": "false", "name": "italian", "price": "0"}]}, {"id": "1", "name": " Sos pe blat", "type": "single", "validation": "optional", "modifierElement": [{"id": "2", "isActuallyProduct": "true", "name": "pizza", "price": "2 "}, {"id": " 3", "isActuallyProduct": "true", "name": "bbq dulce", "price": "2"}, {"id": "4", "isActuallyProduct": "true", "name": "bbq iute", "price": "2"}, {"id": "4", "isActuallyProduct": "true", "name": "salsa", "price": "2"}]}, {"id": "1", "name": " Ingrediente", "type": "multiple", "validation": "optional", "modifierElement": [{"id": "2", "isActuallyProduct": "false", "name": "Ciuperci", "price": "1.5"}, {"id": " 3", "isActuallyProduct": "false", "name": "Ardei", "price": "1.5"}, {"id": "4", "isActuallyProduct": "false", "name": "rosii", "price": "1.5"}, {"id": "4", "isActuallyProduct": "false", "name": "porumb", "price": "1.5"}, {"id": "4", "isActuallyProduct": "false", "name": "sunca", "price": "2"}, {"id": "4", "isActuallyProduct": "false", "name": "pui", "price": "2"}, {"id": "4", "isActuallyProduct": "false", "name": "vita", "price": "2"}, {"id": "4", "isActuallyProduct": "false", "name": "porc", "price": "2"}]}, {"id": "1", "name": " Instructiuni speciale", "type": "single", "validation": "optional", "modifierElement": [{"id": "2", "isActuallyProduct": "false", "name": "mai bine coapta", "price": "0"}, {"id": " 3", "isActuallyProduct": "false", "name": "mai putin coapta", "price": "0"}]}];
		service.testProducts = [{"product_id":42,"name":"Apple Cinema 30\" bla ultra hd many cats, workings bla sla bnak safala asjfas asfjas asfjasa asja","description":"\r\n\tThe 30-inch Apple Cinema HD Display delivers an amazing 2560 x 1600 pixel resolution. Designed sp..","price":"$122.00","special":"$110.00","tax":"$90.00","rating":0,"thumb_image":"http://apitoo.gungoos.com/opencart-2.0.0.0/upload/image/cache/catalog/demo/apple_cinema_30-228x228.jpg"},{"product_id":30,"name":"Canon EOS 5D","description":"\r\n\tCanon's press material for the EOS 5D states that it 'defines (a) new D-SLR category', while we'r..","price":"$122.00","special":"$98.00","tax":"$80.00","rating":0,"thumb_image":"http://apitoo.gungoos.com/opencart-2.0.0.0/upload/image/cache/catalog/demo/canon_eos_5d_1-228x228.jpg"},{"product_id":47,"name":"HP LP3065","description":"\r\n\tStop your co-workers in their tracks with the stunning new 30-inch diagonal HP LP3065 Flat Panel ..","price":"$122.00","special":null,"tax":"$100.00","rating":0,"thumb_image":"http://apitoo.gungoos.com/opencart-2.0.0.0/upload/image/cache/catalog/demo/hp_1-228x228.jpg"},{"product_id":28,"name":"HTC Touch HD","description":"\r\n\tHTC Touch - in High Definition. Watch music videos and streaming content in awe-inspiring high de..","price":"$122.00","special":null,"tax":"$100.00","rating":0,"thumb_image":"http://apitoo.gungoos.com/opencart-2.0.0.0/upload/image/cache/catalog/demo/htc_touch_hd_1-228x228.jpg"},{"product_id":40,"name":"iPhone 5s, 32GB, Silver","description":"\r\n\tiPhone is a revolutionary new mobile phone that allows you to make a call by simply tapping a nam..","price":"$123.20","special":null,"tax":"$101.00","rating":0,"thumb_image":"http://apitoo.gungoos.com/opencart-2.0.0.0/upload/image/cache/catalog/demo/iphone_1-228x228.jpg"},{"product_id":48,"name":"iPod Classic","description":"\r\n\t\r\n\t\t\r\n\t\t\tMore room to move.\r\n\t\t\r\n\t\t\tWith 80GB or 160GB of storage and up to 40 hours of battery l..","price":"$122.00","special":null,"tax":"$100.00","rating":0,"thumb_image":"http://apitoo.gungoos.com/opencart-2.0.0.0/upload/image/cache/catalog/demo/ipod_classic_1-228x228.jpg"},{"product_id":43,"name":"MacBook","description":"\r\n\t\r\n\t\tIntel Core 2 Duo processor\r\n\t\r\n\t\tPowered by an Intel Core 2 Duo processor at speeds up to 2.1..","price":"$602.00","special":null,"tax":"$500.00","rating":0,"thumb_image":"http://apitoo.gungoos.com/opencart-2.0.0.0/upload/image/cache/catalog/demo/macbook_1-228x228.jpg"},{"product_id":44,"name":"MacBook Air","description":"\r\n\tMacBook Air is ultrathin, ultraportable, and ultra unlike anything else. But you don’t lose..","price":"$1,202.00","special":null,"tax":"$1,000.00","rating":0,"thumb_image":"http://apitoo.gungoos.com/opencart-2.0.0.0/upload/image/cache/catalog/demo/macbook_air_1-228x228.jpg"},{"product_id":29,"name":"Palm Treo Pro","description":"\r\n\tRedefine your workday with the Palm Treo Pro smartphone. Perfectly balanced, you can respond to b..","price":"$337.99","special":null,"tax":"$279.99","rating":0,"thumb_image":"http://apitoo.gungoos.com/opencart-2.0.0.0/upload/image/cache/catalog/demo/palm_treo_pro_1-228x228.jpg"},{"product_id":35,"name":"Product 8","description":"\r\n\tProduct 8\r\n..","price":"$122.00","special":null,"tax":"$100.00","rating":0,"thumb_image":"http://apitoo.gungoos.com/opencart-2.0.0.0/upload/image/cache/placeholder-228x228.png"},{"product_id":33,"name":"Samsung SyncMaster 941BW","description":"\r\n\tImagine the advantages of going big without slowing down. The big 19\" 941BW monitor combines..","price":"$242.00","special":null,"tax":"$200.00","rating":0,"thumb_image":"http://apitoo.gungoos.com/opencart-2.0.0.0/upload/image/cache/catalog/demo/samsung_syncmaster_941bw-228x228.jpg"},{"product_id":46,"name":"Sony VAIO","description":"\r\n\tUnprecedented power. The next generation of processing technology has arrived. Built into the new..","price":"$1,202.00","special":null,"tax":"$1,000.00","rating":0,"thumb_image":"http://apitoo.gungoos.com/opencart-2.0.0.0/upload/image/cache/catalog/demo/sony_vaio_1-228x228.jpg"}];










		// compose url for all restaurants http GET
		var restaurantsUrl = function () {
			_finalUrl = baseUrl + '/api/restaurants/?callback=JSON_CALLBACK';
			return _finalUrl;
		};
		// compose url for individual restaurant http GET
		var menuUrl = function () {
			_finalUrl = baseUrl + '/api/restaurant/' + _restaurantID + '/location/' + _locationID + '/get_menu?callback=JSON_CALLBACK';
			return _finalUrl;
		};


		// find the nearest restaurant location from the client
		var findClosestDistance = function (restaurant, loc) {
			console.log(restaurant);
			var locations = restaurant.locations;
			var distancesToLocations = [];
			for (var j = 0; j < locations.length; ) {
				//check if current location has coordinates and delivery range set
				if (locations[j].locationCoordinates === 'no_location_and_delivery_area' || locations[j].locationCoordinates === 'no_delivery_area') {
					j++;
				}
				else {
					var latR = locations[j].locationCoordinates.latitude;
					var lonR = locations[j].locationCoordinates.longitude;
					var distance = getDistance(loc.lat, loc.lon, latR, lonR);
					distancesToLocations.push(distance);
					j++;
				}
			}
			//set the closest restaurant location to the user
			if (distancesToLocations.length > 0) {
				//find closest distance from client to location
				var minDistIndex = distancesToLocations.indexOf(Math.min.apply(Math, distancesToLocations));

				//set location, info and distance to closest location
				restaurant.locationId = locations[minDistIndex].locationId;
				restaurant.locationName = locations[minDistIndex].name;
				restaurant.info = locations[minDistIndex];
				restaurant.distance = distancesToLocations[minDistIndex];

				//check if client is in the delivery area of the restaurant
				if (restaurant.distance > restaurant.info.locationCoordinates.deliveryArea) {
					//alert("we can't deliver to this address!")
					$translate(['popup.info', 'popup.not_in_delivery_zone']).then(function (translate) {
						$ionicPopup.alert({
							title: translate['popup.info'],
							template: translate['popup.not_in_delivery_zone'],
							buttons: [{
								text: 'OK',
								type: 'button-calm'
							}]
						});
						return false;
					});
				}


			}
			else {
				$translate(['popup.info', 'popup.not_in_delivery_zone']).then(function (translate) {
					$ionicPopup.alert({
						title: translate['popup.info'],
						template: translate['popup.not_in_delivery_zone'],
						buttons: [{
							text: 'OK',
							type: 'button-calm'
						}]
					});
					return false;
				});
			}

			console.log(restaurant);
			return restaurant;
		};

		var findDistances = function (restaurant, loc) {
			console.log(restaurant);
			var locations = restaurant.locations;
			var distancesToLocations = [];
			for (var j = 0; j < locations.length; ) {
				//check if current location has coordinates and delivery range set
				if (locations[j].locationCoordinates === 'no_location_and_delivery_area' || locations[j].locationCoordinates === 'no_delivery_area') {
					j++;
				}
				else {
					var latR = locations[j].locationCoordinates.latitude;
					var lonR = locations[j].locationCoordinates.longitude;
					var distance = getDistance(loc.lat, loc.lon, latR, lonR);
					locations[j].distance = distance;
					j++;
				}
			}
			console.log(restaurant);
			return restaurant;
		};

		service.getCurrentLocation = function () {
			var positionOptions = {
				timeout: 15000,
				enableHighAccuracy: false // may cause errors if true
			};
			$ionicLoading.show({templateUrl: 'templates/loadingAddress.html', noBackdrop: false});
			$cordovaGeolocation.getCurrentPosition(positionOptions).then(function (position) {
				// Position here: position.coords.latitude, position.coords.longitude
				service.loc = {lat: position.coords.latitude, lon: position.coords.longitude};
				$rootScope.$broadcast('locationLoaded', service.loc);
				console.log('location loaded');
				$ionicLoading.hide();
			}, function (err) {
				//GPS not activated
				$ionicLoading.hide();
				$translate(['popup.location_services', 'popup.choose_address']).then(function (translate) {
					var GpsPopup = $ionicPopup.alert({
						title: translate['popup.location_services'],
						template: translate['popup.enable_gps'],
						buttons: [{
							text: 'OK',
							type: 'button-calm'
						}]
					});
				});
			});
		};

		//http service for restaurants list
		service.getRestaurants = function (loc, deliveryType) {
			service.restaurants = [];
			service.restaurantName = '';
			service.categoryName = '';
			service.menu = [];
			service.info = [];
			service.products = [];
			service.productInfo = [];

			if (service.restaurants.length === 0) {
				restaurantsUrl();
				$ionicLoading.show({templateUrl: 'templates/loading.html', noBackdrop: false});
				$http.jsonp(_finalUrl)
					.then(function (result) {
					console.log('aici 1');

					//if result returns an error retry to get restaurants
					if (['retrieve_restaurants', 'retrieve_locations', 'retrieve_location', 'retrieve_delivery_area', 'retrieve_minimum_delivery_fee', 'retrieve_delivery_fee'].indexOf(result.data.error) >= 0)
						service.getRestaurants(loc);
					//calculate the distance of a restaurant from client's location
					var restList = result.data.restaurants;
					console.log(restList);
					console.log(_restaurantID);
					for (var i = 0; i < restList.length; i++)
						if (restList[i].restaurantId === _restaurantID) {
							$ionicLoading.hide();
							console.log('aici 2');
							if (deliveryType === "delivery")
								var restaurant = findClosestDistance(restList[i], loc);
							if (deliveryType === "pickup")
								var restaurant = findDistances(restList[i], loc);
							$rootScope.$broadcast('restaurantFound');
							angular.copy(restaurant, service.restaurants);

							if (restaurant.locationId) {
								$state.go("leftdrawer.categories", {restaurantName : restaurant.restaurantName});
								console.log(restaurant.locationName);
								service.setRestaurantIDs(restaurant.restaurantId, restaurant.locationId, restaurant.restaurantName, restaurant.info);
							}
						}

				}, function (result) {
					$ionicLoading.hide();
				});
				return service.restaurants;
			}
			else
				return service.restaurants;
		};


		//http service for individual restaurants menu
		service.setRestaurantIDs = function (restaurantID, locationID, restaurantName, info) {
			service.restaurantName = restaurantName;
			//_restaurantID = restaurantID;
			_locationID = locationID;
			service.menu = [];
			service.info = [];
			CartService.products = [];
			$ionicLoading.show({templateUrl: 'templates/loading.html', noBackdrop: true});
			menuUrl();
			$http.jsonp(_finalUrl)
				.then(function (result) {
				//Success
				angular.copy(result.data.menu, service.menu);
				angular.copy(info, service.info);
				$rootScope.$broadcast('restaurantLoaded');
				$ionicLoading.hide();
			}, function (result) {
				//Error
			});
		};

		//service for products filtering
		service.updateProducts = function (categ) {
			for (var i = 0; i < service.menu.length; i++)
				if (service.menu[i].categoryId === categ.categoryId)
					service.products = service.menu[i].products;
			service.categoryName = categ.categoryName;
		};

		service.cacheImages = function () {
			var images = [];
			var data = service.menu;
			//console.log(data);

			//preload and cache images after menu has loaded
			for (var i = 0; i < data.length; i++)
				for (var j = 0; j < data[i].products.length; j++) {
					var imageThumb = 'http://185.16.40.144' + data[i].products[j].normalPic;
					var imageNormal = 'http://185.16.40.144' + data[i].products[j].resizedPic;
					images.push(imageThumb, imageNormal);
				}
			//console.log(images);
			$ImageCacheFactory.Cache(images).then(function () {
				//console.log("done preloading!");
			});
		};

		//http service for sending Order to Dashboard
		service.sendOrder = function () {
			//check if choosen address is in delivery area
			console.log(service.info);
			var locInfo = service.info.locationCoordinates;
			var dist = getDistance(locInfo.latitude, locInfo.longitude, locInfo.address.coordinates.lat, locInfo.address.coordinates.lon, info);
			console.log(DeliveryInfoService.address);
			console.log(dist);
			console.log(locInfo.deliveryArea);
			if (dist > locInfo.deliveryArea) {
				$translate(['popup.cart', 'popup.not_in_delivery_zone', 'popup.start_over']).then(function (translate) {
					$ionicPopup.confirm({
						title: translate['popup.cart'],
						template: translate['popup.not_in_delivery_zone'],
						buttons: [{
							text: 'OK',
							type: 'button-calm font-united'
						}, {
							text: translate['popup.start_over'],
							type: 'button-custom',
							onTap: function () {
								$state.go("leftdrawer.welcome");
								CartService.products = [];
							}
						}]
					});
					return false;
				});
			}

			//show loading screen
			$ionicLoading.show({templateUrl: 'templates/loading.html', noBackdrop: false});

			//get products
			var product = new Array;
			var address = 1;
			var item = CartService.products;
			for (var i = 0; i < item.length; i++) {
				product.push({
					productId: item[i].id,
					quantity: item[i].quantity
				});
			}
			// get UserInfo from LocalStorage
			var client = new Object;
			var parsedInfo = client;
			if (!parsedInfo.clientId)
				client.clientId = null;
			else
				client.clientId = parsedInfo.clientId;
			client.name = parsedInfo.first_name + ' ' + parsedInfo.last_name;
			client.tel = parsedInfo.phone;
			client.mail = parsedInfo.email;
			client.lastSeen = 'portal';
			client.androidID = androidID;
			client.iosID = iosID;

			//get restaurant info
			var info = new Object;
			info.deliveryFee = service.info.deliveryFee;
			info.deliveryArea = service.info.locationCoordinates.deliveryArea;
			info.minDeliveryFee = service.info.minDeliveryFee;
			info.name = service.info.name;
			info.locationCoordinates = {};
			info.locationCoordinates.latitude = service.info.locationCoordinates.latitude;
			info.locationCoordinates.longitude = service.info.locationCoordinates.longitude;
			info.locationCoordinates.deliveryArea = service.info.locationCoordinates.deliveryArea;

			order.restaurantId = _restaurantID;
			order.locationId = _locationID;
			order.type = $rootScope.deliveryType;
			order.additionalInfo = '';
			order.products = product;
			order.total = CartService.showTotal();
			order.deliveryAddress = address.street + ' No ' + address.number + ' City ' + address.locality;
			order.latLng = {latitude: address.coordinates.lat, longitude: address.coordinates.lon};
			order.client = client;
			order.date = new Date();
			order.info = info;

			console.log(order);
			$http({
				url: baseUrl + '/api/add_order',
				method: "POST",
				data: JSON.stringify(order),
				headers: {'Content-Type': 'application/json; charset=utf-8'}
			})
				.then(function (response) {
				$state.go('goodbye');
				$ionicLoading.hide();
				if (response.data.clientId) {
					parsedInfo.clientId = response.data.clientId;

				}
				CartService.products = [];
			});
		};
		//helper function to get distance from to sets of coordinates (latitude and longitude)
		function getDistance(lat1, lon1, lat2, lon2) {

			function deg2rad(deg) {
				return deg * (Math.PI / 180);
			}
			var R = 6371; // Radius of the earth in km
			var dLat = deg2rad(lat2 - lat1);  // deg2rad below
			var dLon = deg2rad(lon2 - lon1);
			var a =
				Math.sin(dLat / 2) * Math.sin(dLat / 2) +
				Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
				Math.sin(dLon / 2) * Math.sin(dLon / 2)
			;
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
			var d = R * c; // Distance in km
			return d;
		}

		return service;
	});
})();
