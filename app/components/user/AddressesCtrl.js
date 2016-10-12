'use strict';
(function () {
	var app = angular.module('AddressesCtrl', ['ui.router']);

	app.controller('AddressesController', function ($scope, $state,$timeout, $rootScope,$ionicHistory, $ionicModal, $translate, $ionicPopup, ShopService, AccountService, CommonService) {
		//save user info
		$scope.address = {};

		$scope.goBack = function() {
			$ionicHistory.goBack();
		};

		$scope.$on('addressLoaded', function (event) {
			$timeout(function () {
				$scope.address = CommonService.address;
				$scope.selectedCountry = CommonService.selectedCountry;
				if(!CommonService.address.zone_id){
					$scope.address.zone_name = '';
				}
				if(!CommonService.address.country_id){
					$scope.address.country_name = '';
				}
				$scope.$apply();
			}, 0, false);
		});

		$scope.getUserLocation = function () {
			CommonService.addAddressToForm().then(function (data) {
				console.log(data);
			});
		}

		$ionicModal.fromTemplateUrl('templates/modal-country.html', {
			scope: $scope,
			animation: 'modal-fade'
		}).then(function(modal) {
			$scope.countryModal = modal;
		})

		$ionicModal.fromTemplateUrl('templates/modal-zones.html', {
			scope: $scope,
			animation: 'modal-fade'
		}).then(function(modal) {
			$scope.zonesModal = modal;
		})

		$scope.openModalCountry = function () {
			var promise = CommonService.getCountries();
			promise.then(
				function(response) {
					console.log(response.data.countries);
					$scope.countries = response.data.countries;
					$scope.countryModal.show()
				},
				function(error) {
					console.log(error.data);
				});
		}

		$scope.chooseCountry = function (country) {
			$timeout(function () {
				$scope.address.country_id = country.country_id
				$scope.address.country_name = country.name
				$scope.selectedCountry = country;
				$scope.countryModal.hide();
			}, 0, false);
		}

		$scope.openModalZoneID = function () {
			console.log($scope.selectedCountry);
			if($scope.selectedCountry){
				var promise = CommonService.getZoneIds($scope.selectedCountry.country_id);
				promise.then(
					function(response) {
						console.log(response.data.country.zones);
						$scope.zones = response.data.country.zones;
						$scope.zonesModal.show()
					},
					function(error) {
						console.log(error.data);
					});
			}
			else{
				return;
			}
		}

		$scope.chooseZone = function (zone) {
			console.log(zone);
			$timeout(function () {
				$scope.address.zone_id = zone.zone_id;
				$scope.address.zone_name = zone.name;
				$scope.selectedZone = zone;
				$scope.zonesModal.hide();
			}, 0, false);
		}

		$scope.addNewAddress = function () {
			$scope.address.firstname = $rootScope.account.firstname;
			$scope.address.lastname = $rootScope.account.lastname;

			console.log($scope.address);


			if(!$scope.address.address || !$scope.address.city || !$scope.address.postcode || !$scope.address.country_id || !$scope.address.zone_id){
				$ionicPopup.alert({
					title: 	"Error",			//translate['popup.info'],
					template: "You have to fill in all fields",		//translate['popup.not_in_delivery_zone'],
					buttons: [{
						text: 'OK',
						type: 'button-calm'
					}]
				});

				return false;
			}


			var promise = AccountService.addAddress($scope.address);
			promise.then(
				function(response) {
					console.log(response);
					$ionicHistory.goBack();
				},
				function(error) {
					console.log(error);
				});

		}



	});

})();
