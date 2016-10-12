'use strict';
(function () {
	var app = angular.module('PaymentDetailsCtrl', ['ui.router']);

	app.controller('PaymentDetailsController', function ($scope, $rootScope,$localStorage,$ionicHistory, paymentMethods, $ionicPopup, $state, $translate, ShopService, CheckoutService, CheckoutProcessService) {
		//$scope.addresses = addresses;
		$scope.paymentMethods = paymentMethods;

		$scope.goBack = function() {
			console.log($rootScope.shipping_status);
			if($localStorage.shippingMethod && $localStorage.shippingMethod !== null){
				console.log('shipping back');
				$state.go('checkout');
			}
			if($rootScope.shipping_status === false){
				console.log('shipping false');
				$state.go('checkout');
			}
			else {
				$ionicHistory.goBack();
			}
		};

		$scope.setPayment = function (method) {
			for(var i=0 ; i < $scope.paymentMethods.length ;i++){
				if($scope.paymentMethods[i].code === method.code){
					$scope.paymentMethods[i].checked = true;
				}
				else{
					$scope.paymentMethods[i].checked = false;
				}
			}
		}

		// set payment method previously selected and saved in $localstorage
		if($localStorage.paymentMethod  && $localStorage.paymentMethod !== null){
			console.log( $localStorage.paymentMethod);
			console.log($scope.paymentMethods);
			for(var i=0; i<$scope.paymentMethods.length; i++){
				if($scope.paymentMethods[i].code === $localStorage.paymentMethod.code){
					$scope.paymentMethods[i].checked = true;
				}
				else{
					$scope.paymentMethods[i].checked = false;
				}
			}
		}

		// set payment method
		$scope.savePayment = function () {
			for(var i=0 ; i < $scope.paymentMethods.length ;i++){
				if($scope.paymentMethods[i].checked === true){
					console.log($scope.paymentMethods[i]);
					$scope.method = $scope.paymentMethods[i];
				}
			}

			if(!$scope.method){
				$ionicPopup.alert({
					title: 	"Sorry",			//translate['popup.info'],
					template: "You have to choose a payment method",		//translate['popup.not_in_delivery_zone'],
					buttons: [{
						text: 'OK',
						type: 'button-calm'
					}]
				});
				return false;
			}
			$localStorage.paymentMethod = $scope.method;
			CheckoutService.currentPayment = $scope.method;
			CheckoutProcessService.checkout('confirm');
		}
	});
})();
