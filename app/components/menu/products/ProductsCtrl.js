'use strict';
(function () {
	var app = angular.module('ProductsCtrl', ['ui.router']);

	app.controller('ProductsController', function ($state, $scope,$rootScope, $ionicPopover,AccountService, CartService, $timeout, $window, $ionicHistory ,ProductService) {
		//		ProductService.getCategoryProducts("24");

		$scope.products = ProductService.categProducts.products;
		$scope.$on('productsLoaded', function (event, loc) {
			$timeout(function () {
				$scope.products = ProductService.categProducts.products;
				$scope.$apply();
				console.log($scope.products);
			}, 0, false);
		});

		$scope.viewportWidth = $window.innerWidth;

		$scope.openPopover = function (id, $event) {
			$scope.productID = id;
			document.body.classList.remove('platform-ios');
			document.body.classList.remove('platform-android');
			document.body.classList.add('platform-android');
			$scope.popover.show($event);
		}

		$ionicPopover.fromTemplateUrl('./templates/productDropdown.html', {
			scope: $scope
		}).then(function(popover) {
			$scope.popover = popover;
		});

		$scope.addToCart = function () {
			$scope.popover.hide();
			var promise = ProductService.getProduct($scope.productID);
			promise.then(
				function(product) {
					console.log(product);
					if(product.options.length === 0){
						CartService.addProductToCart(product);
					}
					else{
						$state.go("leftdrawer.productInfo", {productId: $scope.productID})
					}
				},
				function(error) {
					console.log(error.data);
				});
//			$scope.popover.hide();
//			$state.go("leftdrawer.productInfo", {productId: $scope.productID});
		}

		$scope.addToWishlist = function () {
			//AccountService.getWishlist();
			AccountService.addProductToWishlist($scope.productID);
			$scope.popover.hide();
		}

		$scope.goToProduct = function (id , e) {
			console.log(e.target.localName);
			if(e.target.localName !== "i"){
				$state.go("leftdrawer.productInfo", {productId: id})
			}
		}

		$scope.goBack = function() {
			$ionicHistory.goBack();
		};


		$ionicPopover.fromTemplateUrl('./templates/dropdownSort.html', {
			scope: $scope
		}).then(function(popover) {
			$scope.dropdownSort = popover;
		});

		$ionicPopover.fromTemplateUrl('./templates/dropdownOrder.html', {
			scope: $scope
		}).then(function(popover) {
			$scope.dropdownOrder = popover;
		});

		$scope.showSortDropdown = function ($event) {
			console.log($event);
			document.body.classList.remove('platform-ios');
			document.body.classList.remove('platform-android');
			document.body.classList.add('platform-android');
			$scope.dropdownSort.show($event);
		}

		$scope.showOrderDropdown = function ($event) {
			console.log($event);
			document.body.classList.remove('platform-ios');
			document.body.classList.remove('platform-android');
			document.body.classList.add('platform-android');
			$scope.dropdownOrder.show($event);
		}

		$scope.sort = function (sort) {
			var searchQuery = {};
			var type = 'sort';

			//			searchQuery.category_id = $rootScope.categoryID ;
			searchQuery.search = $rootScope.searchName;
			searchQuery.sort = sort;
			searchQuery.order = 'ASC';

			if($rootScope.sortOptions === "manufacturer"){
				ProductService.getManufacturersProducts(ProductService.categProducts.manufacturer_id, searchQuery)
			}
			if($rootScope.sortOptions === "category"){
				ProductService.getCategoryProducts(ProductService.categProducts.category_id, searchQuery)
			}
			if($rootScope.sortOptions === "special"){
				ProductService.getSpecialOffers(searchQuery);
			}
			if($rootScope.sortOptions === "search"){
				ProductService.searchProducts(searchQuery, type);
			}

			$scope.dropdownSort.hide();
			$state.go("leftdrawer.products")
		}

		$scope.order = function (order) {
			var searchQuery = {};
			var type = 'order';

			//			searchQuery.category_id = $rootScope.categoryID ;
			searchQuery.search = $rootScope.searchName;
			searchQuery.sort = $rootScope.sortType;
			searchQuery.order = order;

			if($rootScope.sortOptions === "manufacturer"){
				ProductService.getManufacturersProducts(ProductService.categProducts.manufacturer_id, searchQuery)
			}
			if($rootScope.sortOptions === "category"){
				ProductService.getCategoryProducts(ProductService.categProducts.category_id, searchQuery)
			}
			if($rootScope.sortOptions === "special"){
				ProductService.getSpecialOffers(searchQuery);
			}
			if($rootScope.sortOptions === "search"){
				ProductService.searchProducts(searchQuery, type);
			}

			//			ProductService.searchProducts(searchQuery, type);
			$scope.dropdownOrder.hide();
			$state.go("leftdrawer.products")
		}
	});
})();
