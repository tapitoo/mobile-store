'use strict';
(function () {
	var app = angular.module('CheckoutCtrl', ['ui.router']);

	app.controller('CheckoutController', function (cart, account, $scope,$ionicLoading, $rootScope, $localStorage, $ionicPopup, $state, $translate, ShopService, CheckoutService, CheckoutProcessService) {
		$scope.cart = cart;
		$scope.account = account.data.account;
		$scope.address = $localStorage.paymentAddress;
		$scope.payment = $localStorage.paymentMethod;
		$scope.shipping = $localStorage.shippingMethod;
		$scope.card = {};


		$scope.checkoutSuccess = function () {
			var promise = CheckoutService.getCheckoutSuccess();
			promise.then(
				function(response) {
					console.log(response);
					$state.go('goodbye');
				},
				function(error) {
					console.log(error);

				});
		}

		$scope.checkout = function() {
			// checkout user
			CheckoutProcessService.checkout('pay');
		}

		$scope.exitCheckout = function () {
			$localStorage.paymentAddress = null;
			$localStorage.paymentMethod = null;
			$localStorage.shippingAddress = null;
			$localStorage.shippingMethod = null;
//			$rootScope.shipping_status = null;
			$state.go('cart');
		}

		// Pay with Credit Card
		$scope.savePayment = function (myform) {
			console.log(myform.number.$card.type);

			if(!$scope.card.cc_number){
				$ionicPopup.alert({
					title: 	"Error",
					template: "You entered an invalid credid card number",
					buttons: [{
						text: 'OK',
						type: 'button-calm'
					}]
				});
				return false;
			};
			if(!$scope.card.expiry){
				$ionicPopup.alert({
					title: 	"Error",
					template: "You entered an invalid date",
					buttons: [{
						text: 'OK',
						type: 'button-calm'
					}]
				});
				return false;
			};
			if(!$scope.card.name){
				$ionicPopup.alert({
					title: 	"Error",
					template: "Please enter your name",
					buttons: [{
						text: 'OK',
						type: 'button-calm'
					}]
				});
				return false;
			};
			if(!$scope.card.cc_cvv2){
				$ionicPopup.alert({
					title: 	"Error",
					template: "You entered an invalid CVC/CVV code",
					buttons: [{
						text: 'OK',
						type: 'button-calm'
					}]
				});
				return false;
			};

			var str = $scope.card.expiry;
			$scope.card.cc_expire_date_month =  str.substring(0,2)
			$scope.card.cc_expire_date_year = str.substring(str.indexOf("/")+1);


			$ionicLoading.show({templateUrl: 'templates/loading.html', noBackdrop: false});
			var promise = 	CheckoutService.payNow($localStorage.paymentMethod.code, $scope.card);
			promise.then(
				function (response) {
					$scope.checkoutSuccess();
					$ionicLoading.hide();
				},
				function (error) {
					console.log(error);
					$ionicLoading.hide();
				}
			)


		}

	});
})();
