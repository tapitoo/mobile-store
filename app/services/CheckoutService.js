'use strict';
(function () {
	var app = angular.module('Tapitoo.CheckoutService', ['ui.router']);

	app.factory('CheckoutService', function (OC_CONFIG, $http, $rootScope, $ionicLoading, $ionicPopup, $translate, $state, $localStorage, AccountService) {

		var service = {};

		// Checkout Step 1
		service.postPaymentAddress = function (address) {
			//$ionicLoading.show({templateUrl: 'templates/loading.html', noBackdrop: false});

			var postArray = [];
			if(address.existing === true){
				postArray.push({"payment_address" : "existing"});
				postArray.push({"address_id" : address.address_id});
			}
			else{
				postArray.push({"payment_address" : "new"});
				postArray.push({"firstname" : address.firstname});
				postArray.push({"lastname" : address.lastname});
				postArray.push({"address_1" : address.address});
				postArray.push({"city" : address.city});
				postArray.push({"postcode":address.postcode});
				postArray.push({"country_id" : address.country_id});
				postArray.push({"zone_id" : address.zone_id});
			}

			var promise = $http({
				method: "post",
				url: OC_CONFIG.CHECKOUT + 'payment_address',
				headers: {'Authorization': OC_CONFIG.TOKEN, 'Content-Type': 'application/x-www-form-urlencoded'},
				transformRequest: function (obj) {
					var str = [];
					for (var p in obj){
						var myobj = Object.keys(obj[p])
						str.push((myobj) + "=" + encodeURIComponent(obj[p][myobj]));
						console.log(str);
					}
					return str.join("&");
				},
				data: postArray
			}).
			success(function (data, status, headers, config) {
				//$ionicLoading.hide();
				console.log(data);
			}).
			error(function (data, status, headers, config) {
				console.log(data.error);
				//$ionicLoading.hide();
			});

			return promise;
		}


		// Checkout Step 2
		service.postShippingAddress = function (address) {
			//$ionicLoading.show({templateUrl: 'templates/loading.html', noBackdrop: false});

			var postArray = [];
			if(address.existing === true){
				postArray.push({"shipping_address" : "existing"});
				postArray.push({"address_id" : address.address_id});
			}
			else{
				postArray.push({"payment_address" : "new"});
				postArray.push({"firstname" : address.firstname});
				postArray.push({"lastname" : address.lastname});
				postArray.push({"address_1" : address.address});
				postArray.push({"city" : address.city});
				postArray.push({"postcode":address.postcode});
				postArray.push({"country_id" : address.country_id});
				postArray.push({"zone_id" : address.zone_id});
			}

			service.currentAddress = address;

			var promise = $http({
				method: "post",
				url: OC_CONFIG.CHECKOUT + 'shipping_address',
				headers: {'Authorization': OC_CONFIG.TOKEN, 'Content-Type': 'application/x-www-form-urlencoded'},
				transformRequest: function (obj) {
					var str = [];
					for (var p in obj){
						var myobj = Object.keys(obj[p])
						str.push((myobj) + "=" + encodeURIComponent(obj[p][myobj]));
						console.log(str);
					}
					return str.join("&");
				},
				data: postArray
			}).
			success(function (data, status, headers, config) {
				//$ionicLoading.hide();
				console.log(data);
			}).
			error(function (data, status, headers, config) {
				console.log(data.error);
				//$ionicLoading.hide();
			});

			return promise;
		}

		// Checkout Step 3
		service.getShippingMethod = function () {
			//$ionicLoading.show({templateUrl: 'templates/loading.html', noBackdrop: false});
			var promise = $http({
				url: OC_CONFIG.CHECKOUT + 'shipping_method',
				method: "GET",
				headers: {'Authorization': OC_CONFIG.TOKEN}
			})
			.then(function (response) {
				//$ionicLoading.hide();
				console.log(response.data);
				return response.data;
			});
			return promise;
		}

		// Checkout Step 4
		service.postShippingMethod = function (order) {
			var checkout = [];

			checkout.push({"shipping_method" : order.code});
			//			checkout.push({"comment" : "doorbell doesn't work"});
			var promise = $http({
				method: "post",
				url: OC_CONFIG.CHECKOUT + 'shipping_method',
				headers: {'Authorization': OC_CONFIG.TOKEN, 'Content-Type': 'application/x-www-form-urlencoded'},
				transformRequest: function (obj) {
					var str = [];
					for (var p in obj){
						var myobj = Object.keys(obj[p])
						str.push((myobj) + "=" + encodeURIComponent(obj[p][myobj]));
						console.log(str);
					}
					return str.join("&");
				},
				data: checkout
			}).
			success(function (data, status, headers, config) {
				//$ionicLoading.hide();
				console.log(data);
			}).
			error(function (data, status, headers, config) {
				console.log(data.error);
				//$ionicLoading.hide();
			});
			return promise;
		}



		// Checkout Step 5
		service.getPaymentMethod = function () {
			//$ionicLoading.show({templateUrl: 'templates/loading.html', noBackdrop: false});
			var promise = $http({
				url: OC_CONFIG.CHECKOUT + 'payment_method',
				method: "GET",
				headers: {'Authorization': OC_CONFIG.TOKEN}
			})
			.then(function (response) {
				//$ionicLoading.hide();
				console.log(response.data.payment_methods);
				return response.data.payment_methods;
			});
			return promise;
		}

		// Checkout Step 6
		service.postPaymentMethod = function (payment) {
			var checkout = {};
			checkout.payment_method = payment.code;
			if(payment.agree){
				checkout.agree = payment.agree;
			}
			if(payment.comment){
				checkout.comment = payment.comment;
			}

			var promise = $http({
				url: OC_CONFIG.CHECKOUT + 'payment_method',
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
				data: checkout
			})
			.then(function (response) {
				console.log(response.data);
				return response.data;
			});
			return promise;
		}

		// Checkout Step 7
		service.getCheckoutConfirm = function () {
			//$ionicLoading.show({templateUrl: 'templates/loading.html', noBackdrop: false});
			var promise = $http({
				url: OC_CONFIG.CHECKOUT + 'confirm',
				method: "GET",
				headers: {'Authorization': OC_CONFIG.TOKEN}
			})
			.then(function (response) {
				////$ionicLoading.hide();
				console.log(response.data.order.products);
				$rootScope.cartProducts = response.data.order.products;
				return response.data;
			});
			return promise;
		}

		// Checkout Step 8
		service.getCheckoutPay = function () {
			//$ionicLoading.show({templateUrl: 'templates/loading.html', noBackdrop: false});
			var promise = $http({
				url: OC_CONFIG.CHECKOUT + 'pay',
				method: "GET",
				headers: {'Authorization': OC_CONFIG.TOKEN}
			})
			.success(function (response) {
				//$ionicLoading.hide();
				console.log("step 8");
				console.log(response);
				return response;
			})
			.error(function (response) {
				//$ionicLoading.hide();
				console.log(response);
			});
			return promise;
		}

		// Checkout Step 9
		service.getCheckoutSuccess = function () {
			//$ionicLoading.show({templateUrl: 'templates/loading.html', noBackdrop: false});
			var promise = $http({
				url: OC_CONFIG.CHECKOUT + 'success',
				method: "GET",
				headers: {'Authorization': OC_CONFIG.TOKEN}
			})
			.success(function (response) {
				console.log("step 9");
				$localStorage.paymentAddress = null;
				$localStorage.paymentMethod = null;
				$localStorage.shippingAddress = null;
				$localStorage.shippingMethod = null;
				$rootScope.cartProducts = [];
				$rootScope.cartBadge = 0;
				console.log(response);
				for(var i=0; i<response.length; i++){
					AccountService.deleteProductFromWishlist(response[i].product_id)
				}
				return response;
			})
			.error(function (response) {
				//$ionicLoading.hide();
				console.log(response);
			});
			return promise;
		}

		service.payNow = function (paymentType, card) {
			var cardData = {};
			console.log(paymentType);
			cardData.cc_number = card.cc_number;
			cardData.cc_expire_date_month = card.cc_expire_date_month;
			cardData.cc_expire_date_year = card.cc_expire_date_year;
			cardData.cc_cvv2 = card.cc_cvv2;

			var promise = $http({
				url: OC_CONFIG.PAYMENT + paymentType + '/send',
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
				data: cardData
			})
			.success(function (response) {
				//$ionicLoading.hide();
				console.log(response);
				return response;
			})
			.error(function (response) {
				//$ionicLoading.hide();
				console.log(response);
			});
			return promise;
		}

		return service;

	});
})();
