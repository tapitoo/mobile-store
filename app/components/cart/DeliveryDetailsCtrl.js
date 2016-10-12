'use strict';
(function () {
	var app = angular.module('DeliveryDetailsCtrl', ['ui.router']);

	app.controller('DeliveryDetailsController', function (deliveryData,$rootScope,$localStorage,$timeout, $ionicHistory, $scope, $ionicPopup, $state, $translate, ShopService, CheckoutService, CheckoutProcessService, AccountService) {
		$scope.deliveryData = deliveryData;
		$scope.editStatus = "Edit";
		$scope.canEdit = false;

		$scope.goBack = function() {
			console.log($rootScope.shipping_status);
			$ionicHistory.goBack();
		};

		$scope.chooseAddress = function (address) {
			for(var i=0 ; i < $scope.deliveryData.length ;i++){
				if($scope.deliveryData[i].address_id === address.address_id){
					$scope.deliveryData[i].checked = true;
				}
				else{
					$scope.deliveryData[i].checked = false;
				}
			}
		}

		// set payment address previously selected and saved in $localstorage
		if($state.current.name === "paymentAddress"){
			if($localStorage.paymentAddress  && $localStorage.paymentAddress !== null){
				for(var i=0; i<$scope.deliveryData.length; i++){
					if($scope.deliveryData[i].address_id === $localStorage.paymentAddress.address_id){
						$scope.deliveryData[i].checked = true;
					}
					else{
						$scope.deliveryData[i].checked = false;
					}
				}
			}
		}

		$scope.setPaymentAddress = function () {
			for(var i=0 ; i < $scope.deliveryData.length ;i++){
				if($scope.deliveryData[i].checked === true){
					console.log($scope.deliveryData[i]);
					$scope.address = $scope.deliveryData[i];
					$scope.address.existing = true;
				}
			}

			if(!$scope.address){
				$ionicPopup.alert({
					title: 	"Sorry",			//translate['popup.info'],
					template: "You have to choose an address or add a new one",		//translate['popup.not_in_delivery_zone'],
					buttons: [{
						text: 'OK',
						type: 'button-calm'
					}]
				});
				return false;
			}
			$localStorage.paymentAddress = $scope.address;

			CheckoutService.postPaymentAddress($scope.address).finally(function () {
				if($rootScope.shipping_status === true){
					$state.go('shippingAddress');
				}
				else{
					$state.go('paymentDetails');
				}
			});
		}

		// set shipping address previously selected and saved in $localstorage
		if($state.current.name === "shippingAddress"){
			if($localStorage.shippingAddress && $localStorage.shippingAddress !== null){
				console.log("shippin : " + $localStorage.shippingAddress.address_id);
				for(var i=0; i<$scope.deliveryData.length; i++){
					if($scope.deliveryData[i].address_id === $localStorage.shippingAddress.address_id){
						$scope.deliveryData[i].checked = true;
					}
					else{
						$scope.deliveryData[i].checked = false;
					}
				}
			}
		}

		// set shipping address
		$scope.setShippingAddress = function () {
			for(var i=0 ; i < $scope.deliveryData.length ;i++) {
				if($scope.deliveryData[i].checked === true) {
					$scope.address = $scope.deliveryData[i];
					$scope.address.existing = true;
				}
			}
			if(!$scope.address){
				$ionicPopup.alert({
					title: 	"Sorry",			//translate['popup.info'],
					template: "You have to choose an address or add a new one",		//translate['popup.not_in_delivery_zone'],
					buttons: [{
						text: 'OK',
						type: 'button-calm'
					}]
				});
				return false;
			}
			$localStorage.shippingAddress = $scope.address;
			if($localStorage.paymentMethod !== null && $localStorage.shippingMethod !== null && $localStorage.paymentMethod && $localStorage.shippingMethod){
				$state.go('checkout');
			}
			else{
				$state.go('shippingMethod');
			}
		}

		// set shipping method previously selected and saved in $localstorage
		if($state.current.name === "shippingMethod"){
			if($localStorage.shippingMethod && $localStorage.shippingMethod !== null){
				for(var i=0; i<$scope.deliveryData.shipping_methods.length; i++){
					for(var j=0; j<$scope.deliveryData.shipping_methods[i].quote.length; j++){
						var method = $scope.deliveryData.shipping_methods[i].quote[j];
						if(method.code === $localStorage.shippingMethod.code){
							method.checked = true;
						}
						else{
							method.checked = false;
						}
					}
				}
			}
		}

		// check in list shipping method
		$scope.chooseShippingMethod = function (code) {
			for(var i=0 ; i < $scope.deliveryData.shipping_methods.length ;i++){
				for(var j=0; j<$scope.deliveryData.shipping_methods[i].quote.length; j++){
					var method = $scope.deliveryData.shipping_methods[i].quote[j];
					if(method.code === code.code){
						method.checked = true;
					}
					else{
						method.checked = false;
					}
				}

			}
			console.log($scope.deliveryData);
		}

		// set shipping method
		$scope.setShippingMethod = function () {
			for(var i=0 ; i < $scope.deliveryData.shipping_methods.length ;i++){
				for(var j=0; j<$scope.deliveryData.shipping_methods[i].quote.length; j++){
					var method = $scope.deliveryData.shipping_methods[i].quote[j];
					if(method.checked === true) {
						console.log(method);
						$scope.shippingMethod = method;
					}
				}
			}

			for(var i=0 ; i < $scope.deliveryData.length ;i++) {
				if($scope.deliveryData[i].checked === true) {
					console.log($scope.deliveryData[i]);
					$scope.shippingMethod = $scope.deliveryData[i];
				}
			}
			if(!$scope.shippingMethod){
				$ionicPopup.alert({
					title: 	"Sorry",			//translate['popup.info'],
					template: "You have to choose a shipping method",		//translate['popup.not_in_delivery_zone'],
					buttons: [{
						text: 'OK',
						type: 'button-calm'
					}]
				});
				return false;
			}
			$localStorage.shippingMethod = $scope.shippingMethod;
			if($localStorage.paymentMethod && $localStorage.paymentMethod !== null){
				CheckoutProcessService.checkout('confirm');
			}
			else{
				$state.go('paymentDetails');
			}
		}

		$scope.getShippingMethod = function () {
			CheckoutService.getShippingMethod();
		}

		$scope.editAddress = function () {
			if($scope.canEdit === false){
				$scope.editStatus = "OK";
				$scope.canEdit = true;
			}
			else{
				$scope.editStatus = "Edit";
				$scope.canEdit = false;
			}
		}

		$scope.deleteAddress = function (address) {
			console.log("obj");
			console.log(address);
			var promise = AccountService.deleteAddress(address.address_id);
			promise.then(
				function (response) {
					$timeout( function(){
						var index = $scope.deliveryData.indexOf(address);
						$scope.deliveryData.splice(index, 1);
					});
				},
				function(error){

				})
		}


	});
})();
