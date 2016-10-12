'use strict';
(function () {
	var app = angular.module('Tapitoo.CheckoutProcessService', ['ui.router']);

	app.factory('CheckoutProcessService', function ($localStorage,$rootScope, CheckoutService, $ionicLoading, $state) {

		var service = {};

		service.checkout = function(checkoutType) {
			$ionicLoading.show({templateUrl: 'templates/loading.html', noBackdrop: false});
			console.log($localStorage);

			var postPaymentAddress = function() {
				return CheckoutService.postPaymentAddress($localStorage.paymentAddress).then( function( response )  {                 // Step #1
					console.log("step 1");
					console.log(response);         // Response Handler #1
					return response;
				});
			},
				postShippingAddress = function() {
					if ($rootScope.shipping_status === false)
						return false;
					else
						return CheckoutService.postShippingAddress($localStorage.paymentAddress).then( function( response )  {            // Step #2
							console.log("step 2")
							console.log(response);         // Response Handler #2
							return response;
						});
				},
				getShippingMethod = function() {
					if ($rootScope.shipping_status === false)
						return false;
					else
						return CheckoutService.getShippingMethod().then( function( response )  {               							  // Step #3
							console.log("step 3");
							console.log(response);         // Response Handler #3
							return response;
						});
				},
				postShippingMethod = function() {
					if ($rootScope.shipping_status === false)
						return false;
					else
						return CheckoutService.postShippingMethod($localStorage.shippingMethod).then( function( response )  {               // Step #4
							console.log("step 4");
							console.log(response);         // Response Handler #4
							return response;
						});
				},
				getPaymentMethod = function() {
					return CheckoutService.getPaymentMethod().then( function( response )  {                 							// Step #5
						console.log("step 5");
						console.log(response);         // Response Handler #5
						return response;
					});
				},
				postPaymentMethod = function() {
					return CheckoutService.postPaymentMethod($localStorage.paymentMethod).then( function( response )  {                 // Step #6
						console.log("step 6");
						console.log(response);         // Response Handler #6
						return response;
					});
				},
				getCheckoutConfirm = function() {
					return CheckoutService.getCheckoutConfirm().then( function( response )  {                							 // Step #7
						console.log("step 7");
						console.log(response);         // Response Handler #7
						return response;
					});
				}

			// call all checkout steps in sequence
			postPaymentAddress()
				.then( postShippingAddress )
				.then( getShippingMethod )
				.then( postShippingMethod )
				.then( getPaymentMethod )
				.then( postPaymentMethod )
				.then( getCheckoutConfirm )
				.then(function (response) {
				if(checkoutType === "confirm"){
					$state.go('checkout');
				}
				else{
					if(response.order.needs_payment_now === false){
						CheckoutService.getCheckoutPay().then(function (response) {
							var promise = CheckoutService.getCheckoutSuccess();
							promise.then(
								function(response) {
									console.log(response);
									$ionicLoading.hide();
									$state.go('goodbye');
								},
								function(error) {
									console.log(error);
								});
						})
					}
					else {
						CheckoutService.getCheckoutPay().then(function (response) {
							$state.go('addCard');
							console.log(response);
							$ionicLoading.hide();
						})
					}
				}
			})
			;
		};

		return service;

	});
})();
