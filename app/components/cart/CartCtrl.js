'use strict';
(function () {
	var app = angular.module('CartCtrl', ['ui.router']);

	app.controller('CartController', function (cart,$log,$rootScope, $localStorage, $timeout,$scope,$ionicListDelegate, $ionicPopup, $state, $translate, ShopService, CartService, AccountService, CheckoutService) {
		console.log(cart);
		$rootScope.buttonsOpened = false;
		$rootScope.canEditCart = false;

		// set localstorage checkout steps to null if user is on cart screen
		$localStorage.paymentAddress = null;
		$localStorage.paymentMethod = null;
		$localStorage.shippingAddress = null;
		$localStorage.shippingMethod = null;
//		$rootScope.shipping_status = null;


		$scope.restaurantName = ShopService.restaurantName;
		$scope.categoryName = ShopService.categoryName;
		$scope.cartItems = cart.products;
		$scope.cart = cart;
		$scope.deliveryFee = ShopService.info.deliveryFee;

		$scope.checkLogin = function(){
			$state.go('leftdrawer.userLogin')
			AccountService.userAccount();
		}

		$scope.cartCheckout = function () {
			if($scope.cart.error_warning !== null){
				$ionicPopup.alert({
					title: 	"Sorry",			//translate['popup.info'],
					template: $scope.cart.error_warning,		//translate['popup.not_in_delivery_zone'],
					buttons: [{
						text: 'OK',
						type: 'button-calm'
					}]
				})
				return false;
			}
			if($scope.cart.shipping_status === false){
				$rootScope.shipping_status = false;
			}
			else{
				$rootScope.shipping_status = true;
			}

			var promise = AccountService.userAccount();
			promise.then(
				//if user is logged in go to first step in checkout process
				function(response) {
					console.log(response.data);
					$state.go("paymentAddress")
				},
				//is user is not logged in rediret to login
				function(error) {
					console.log(error.data);
					$state.go("leftdrawer.userLogin")
				});
		}

		$scope.editQuantity = function (type, item) {
			if(type === "add"){
				var promise = CartService.postProductQuantity((item.quantity + 1), item.key)
				}
			if(type === "subtract"){
				var promise = CartService.postProductQuantity((item.quantity - 1), item.key)
				}

			promise.then(
				function(response) {
					$timeout( function(){
						$scope.cart = response.data.cart;
						$scope.cartItems = response.data.cart.products;
					});
				},
				function(error) {
					console.log(error.data);
				});
		}

		$scope.deleteProduct = function (item) {
			var promise = CartService.deleteProductFromCart(item.key);
			promise.then(
				function (response) {
					$timeout( function(){
						$scope.cart = response.data.cart;
						$scope.cartItems = response.data.cart.products;
					});
				},
				function(error){

				})

		}


	});
})();
