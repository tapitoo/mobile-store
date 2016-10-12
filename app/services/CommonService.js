'use strict';
(function () {
	var app = angular.module('Tapitoo.CommonService', ['ui.router']);

	app.factory('CommonService', function (OC_CONFIG, $http,$q, $rootScope, $ionicLoading, $window, $ionicPopup,$cordovaGeolocation,GeocoderService, $translate, $state) {
		var service = {};
		service.loc = {};
		service.address = {};


		service.addAddressToForm = function () {

			var getUserLocation = function() {
				var promise = service.getCurrentLocation()
				promise.then(function (location) {
					service.location = location.coords;
				})
				return promise;
			}

			var reverseGeocodeAddress = function () {
				var promise = service.GeocodeAddress(service.location)
				promise.then(
					function( data )  {
						service.address.address = data.street + ' ' + data.number;
						service.address.city = data.locality ;
						service.address.postcode = data.postal_code ;
						service.address.country_name = data.country.long_name;
						service.address.zone_name = data.zone.long_name;
					});
				return promise;

			}

			var getCountryId = function () {
				var promise = service.getCountries();
				promise.then(
					function(response) {
						var countries = response.data.countries;
						for(var i=0; i<countries.length; i++){
							if(countries[i].name === service.address.country_name){
								service.address.country_id = countries[i].country_id;
								service.selectedCountry = countries[i];
							}
						}
					},
					function(error) {
						console.log(error.data);
					});
				return promise;
			}
			var getZoneId = function () {
				var promise = service.getZoneIds(service.address.country_id);
				promise.then(
					function(response) {
						var zones = response.data.country.zones;
						console.log(zones);
						for(var i = 0; i<zones.length; i++){
							if (zones[i].name === service.address.zone_name){
								console.log(zones[i]);
								service.address.zone_id = zones[i].zone_id;
							}
						}
					},
					function(error) {
						console.log(error.data);
					});

				return promise;
			}

			var deferredObj = $q.defer();
			var promise = deferredObj.promise;

			promise
				.then(getUserLocation)
				.then(reverseGeocodeAddress)
				.then(getCountryId)
				.then(getZoneId)
				.catch (function(errorMsg) {
				console.log(errorMsg);
			})
				.finally(function() {
				console.log(service.address);
				$rootScope.$broadcast('addressLoaded');
				return promise;
			});

			deferredObj.resolve(101);

			return promise
		};

		service.getCurrentLocation = function () {
			var positionOptions = {
				timeout: 15000,
				enableHighAccuracy: false // may cause errors if true
			};
			$ionicLoading.show({templateUrl: 'templates/loadingAddress.html', noBackdrop: false});
			var promise = $cordovaGeolocation.getCurrentPosition(positionOptions).then(function (position) {
				$ionicLoading.hide();
				return position;
			}, function (err) {
				$ionicLoading.hide();
				//GPS not activated
//				$translate(['popup.location_services', 'popup.choose_address']).then(function (translate) {
//					var GpsPopup = $ionicPopup.alert({
//						title: translate['popup.location_services'],
//						template: translate['popup.enable_gps'],
//						buttons: [{
//							text: 'OK',
//							type: 'button-calm'
//						}]
//					});
//				});
			});
			return promise;
		};

		service.GeocodeAddress = function (loc) {
			var address = {}
			var promise = GeocoderService.addressForLatLng(loc.latitude, loc.longitude).then(function (data) { //33.989761, -118.330708
				console.log(data);
				var responses = data.address;
				address.number = '';
				address.street = '';
				address.locality = '';
				address.country = '';
				for (var i = 0; i < responses.length; ++i) {
					var super_var1 = responses[i].address_components;
					for (var j = 0; j < super_var1.length; ++j) {
						var super_var2 = super_var1[j].types;
						for (var k = 0; k < super_var2.length; ++k) {
							//find street number
							if (super_var2[k] === "street_number") {
								address.number = super_var1[j].long_name;
							}
							//find street
							if (super_var2[k] === "route") {
								address.street = super_var1[j].long_name;
							}
							//find city
							if (super_var2[k] === "locality") {
								address.locality = super_var1[j].long_name;
							}
							//find administrive area
							if (super_var2[k] === "administrative_area_level_1") {
								address.zone = {};
								address.zone.long_name = super_var1[j].long_name;
								address.zone.short_name = super_var1[j].short_name;
							}
							//find country
							if (super_var2[k] === "country") {
								address.country = {};
								address.country.long_name = super_var1[j].long_name;
								address.country.short_name = super_var1[j].short_name;
							}
							if (super_var2[k] === "postal_code") {
								address.postal_code = super_var1[j].long_name;
							}
						}
					}
				}
				return address;
			});
			return promise;
		}

		service.getCountries = function () {
			$ionicLoading.show({templateUrl: 'templates/loading.html', noBackdrop: false});
			var promise = $http({
				url: OC_CONFIG.COMMON + 'country',
				method: "GET",
				headers: {'Authorization': OC_CONFIG.TOKEN}
			})
			.success(function (response) {
				$ionicLoading.hide();
				console.log("user account");
				console.log(response);
				return response;
			})
			.error(function (response) {
				console.log(response.errors);
				return response.errors;
			});
			return promise;
		}

		service.getZoneIds = function (id) {
			$ionicLoading.show({templateUrl: 'templates/loading.html', noBackdrop: false});
			var promise = $http({
				url: OC_CONFIG.COMMON + 'country/' + id,
				method: "GET",
				headers: {'Authorization': OC_CONFIG.TOKEN}
			})
			.success(function (response) {
				$ionicLoading.hide();
				console.log("user account");
				console.log(response);
				return response;
			})
			.error(function (response) {
				$ionicLoading.hide();
				console.log(response.errors);
				return response.errors;
			});
			return promise;

		}

		service.getBanner = function () {
			$ionicLoading.show({templateUrl: 'templates/loading.html', noBackdrop: false});
			var banner= {};
			banner.width = $window.innerWidth;
			banner.height = 160;

			var promise = $http({
				url: 'http://185.16.40.144/opencart-2.0.1.0/upload/api/v1/module/homebanner',
				method: "POST",
				headers: {'Authorization': OC_CONFIG.TOKEN, 'Content-Type': 'application/x-www-form-urlencoded'},
				transformRequest: function (obj) {
					var str = [];
					for (var p in obj){
						str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
						console.log(str);
					}
					return str.join("&");
				},
				data: banner
			})
			.success(function (response) {
				$ionicLoading.hide();
//				console.log(response);
				return response.data;
			})
			.error(function (response) {
				$ionicLoading.hide();
				console.log(response);
			});
			return promise;
		}

		service.getFeaturedCategory = function () {
//			$ionicLoading.show({templateUrl: 'templates/loading.html', noBackdrop: false});

			var promise = $http({
				url: OC_CONFIG.MODULE + 'featuredcategory',
				method: "POST",
				headers: {'Authorization': OC_CONFIG.TOKEN},
			})
			.success(function (response) {
				$ionicLoading.hide();
//				console.log(response);
				return response;
			})
			.error(function (response) {
				$ionicLoading.hide();
				console.log(response);
			});
			return promise;
		}

		service.setOneSignalSubscription = function (status) {
			window.plugins.OneSignal.setSubscription(status);
		}


		return service;
	});
})();
