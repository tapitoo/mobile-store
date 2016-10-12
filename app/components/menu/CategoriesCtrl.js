'use strict';
(function () {
	var app = angular.module('CategoriesCtrl', ['ui.router']);

	app.controller('CategoriesController', function (categories, $scope, $timeout, $translate, $ionicPopup, $state, ShopService, ProductService, $ImageCacheFactory, $rootScope) {
		$scope.categories = categories;
		console.log($scope.categories);
		$scope.subCategories = ProductService.subCategories;

		$scope.getCategory1 = function (categ) {
			ProductService.categProducts.products = [];
			if(categ.categories.length>0){
				ProductService.subCategories = [];
				for(var i=0 ; i<categ.categories.length; i++){
					console.log(categ.categories[i]);
					ProductService.subCategories.push(categ.categories[i])
				}
				console.log($scope.subCategories);
				$state.go("leftdrawer.subCategories")
			}
			else {
				ProductService.getCategoryProducts(categ.category_id);
				$state.go("leftdrawer.products")
			}
		}

		$scope.getCategory = function (categ) {
			console.log(categ);

			if(categ.categories){
				if(categ.categories.length>0){
					console.log('subcateg');
					ProductService.getSubcategories(categ.category_id);
					ProductService.getCategoryProducts(categ.category_id);
					$state.go("leftdrawer.subCategories")
				}
				else{
					console.log('no subcateg');
					ProductService.getCategoryProducts(categ.category_id);
					$state.go("leftdrawer.products")
				}
			}
			else{
				ProductService.getCategoryProducts(categ.category_id);
				$state.go("leftdrawer.products")
			}
		}

		$scope.getProducts = function () {
			ProductService.getCategoryProducts(ProductService.categoryID);
			$state.go("leftdrawer.products")
		}

		$scope.search = function (search, type) {
			var searchQuery = {};
			searchQuery.category_id = "";
			searchQuery.search = search;
			searchQuery.sort = "price";
			searchQuery.order = "DESC";
			ProductService.searchProducts(searchQuery, type);
			$state.go("leftdrawer.products")
		}

	});
})();
