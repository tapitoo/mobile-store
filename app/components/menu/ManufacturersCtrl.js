'use strict';
(function () {
	var app = angular.module('Tapitoo.ManufacturersController', ['ui.router']);
	//factory for cart operations
	app.controller('ManufacturersController', function ($scope, $state, manufacturers, ProductService) {

		$scope.manufacturers = manufacturers;
		console.log($scope.manufacturers);
		//ProductService.getManufacturers();

		$scope.getManufacturer = function(manufacturer) {
			console.log(manufacturer);
			ProductService.getManufacturersProducts(manufacturer.manufacturer_id)
			$state.go("leftdrawer.products")
		}
	})

})();


