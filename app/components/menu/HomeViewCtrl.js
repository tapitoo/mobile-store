'use strict';
(function () {
    var app = angular.module('Tapitoo.HomeViewController', ['ui.router']);
    //factory for cart operations
//	app.controller('HomeViewController', function ($scope,$state,$localStorage, featuredCategories, $ionicPopover, GeocoderService, banner, $rootScope, $ionicSlideBoxDelegate, $ionicGesture, CommonService,$timeout,  ShopService, ProductService, AccountService, CartService) {
    app.controller('HomeViewController', function ($scope,$state,$localStorage, $ionicPopover, GeocoderService, $rootScope, $ionicSlideBoxDelegate, $ionicGesture, CommonService,$timeout,  ShopService, ProductService, AccountService, CartService) {

//        $scope.featuredCategories = featuredCategories.data;
//        console.log(featuredCategories);
//		$scope.slides = banner.data.banners;


        $scope.getCategories = function () {
            ProductService.getAllCategories();
        }

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


        $scope.goToProduct = function(id, e) {
            console.log(e.target.localName);
            if(e.target.localName !== "i"){
                $state.go("leftdrawer.productInfo", {productId: id})
            }
        }

        $scope.getSpecial = function () {
//			var date = new Date();
//			date = date.getTime();
//			console.log(date);
//			if(!$localStorage.notifications) {
//				$localStorage.notifications = []
//			}
//			$localStorage.notifications.push({title: "test " + ($localStorage.notifications.length + 1), message: "message "+ ($localStorage.notifications.length + 1), date:date})
//			console.log($localStorage.notifications);
//			return;
            ProductService.getSpecialOffers();
            $state.go('leftdrawer.products');
        }

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
        }

        $scope.addToWishlist = function () {
            //AccountService.getWishlist();
            AccountService.addProductToWishlist($scope.productID);
            $scope.popover.hide();
        }

        $scope.goToBannerLink = function (slide) {
            console.log(slide.link);
            var str = slide.link
            if(str.indexOf("product_id=")>1){
                var prodID = str.substring(str.indexOf("product_id=")+11)
                $state.go("leftdrawer.productInfo", {productId: prodID})
            }

            if(str.indexOf("category&path=")>1){
                var categID = str.substring(str.indexOf("category&path=")+14);
                if(categID.indexOf("_")>1){
                    categID = categID.split('_').pop().trim();
                }
                ProductService.getCategoryProducts(categID);
                $state.go("leftdrawer.products")
            }
        }
    })

})();


