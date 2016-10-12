'use strict';
(function () {
    var app = angular.module('Tapitoo.ProductService', ['ui.router']);

    app.factory('ProductService', function (OC_CONFIG, $http, $rootScope, $ionicLoading, $ionicPopup, $translate, $state) {
        var service = {};
        service.subCategories = [];
        service.categProducts = [];
        service.searchQuery = {};

        service.getAllCategories = function () {
            var promise = $http({
                url: OC_CONFIG.CATEGORIES,
                method: "GET",
                withCredentials: true,
                headers: {'Authorization': OC_CONFIG.TOKEN}
            })
            .then(function (response) {
                console.log('toate categoriile');
                console.log(response.data.categories);
                console.log(response);
                return response.data.categories;
            });
            return promise;
        };

        service.getCategoryProducts = function (id, query) {
            service.categProducts = [];
            if(!query) {
                var query = {};
                query.sort = 'price';
                query.order = 'DESC';
            }
            $rootScope.sortType = query.sort;

            var promise = $http({
                url: OC_CONFIG.CATEGORIES + id,
                method: "GET",
                headers: {'Authorization': OC_CONFIG.TOKEN},
                params: {sort : query.sort , order: query.order}
            })
            .then(function (response) {
                console.log(response.data.category);
                $rootScope.categoryID = response.data.category.category_id;
                $rootScope.searchName = '';
                service.categProducts = response.data.category;
                $rootScope.$broadcast('productsLoaded');
                $rootScope.sortOptions = "category";
                return response.data.category;
            });
            return promise;
        };

        service.getSubcategories = function (id) {
//			$ionicLoading.show({templateUrl: 'templates/loading.html', noBackdrop: false});
            var promise = $http({
                url: OC_CONFIG.CATEGORIES + id +'/subcategory',
                method: "GET",
                headers: {'Authorization': OC_CONFIG.TOKEN}
            })
            .then(function (response) {
//				$ionicLoading.hide();
                service.subCategories = response.data.categories;
                service.categoryID = id;
                console.log(response.data.categories);
                return response.data.categories;
            });
            return promise;
        };

        service.getProduct = function (id) {
            var promise = $http({
                url: OC_CONFIG.PRODUCT + id,
                method: "GET",
                headers: {'Authorization': OC_CONFIG.TOKEN}
            })
            .then(function (response) {
                console.log('produs: ' +response.data.product.title);
                console.log(response.data.product);
                return response.data.product;
            });
            return promise;
        };

        service.getProductReviews = function (id) {
//			$ionicLoading.show({templateUrl: 'templates/loading.html', noBackdrop: false});
            var promise = $http({
                url: OC_CONFIG.REVIEWS + id,
                method: "GET",
                headers: {'Authorization': OC_CONFIG.TOKEN}
            })
            .then(function (response) {
//				$ionicLoading.hide();
                console.log(response.data.product_reviews);
                return response.data.product_reviews;
            });
            return promise;
        };

        service.postReview = function (reviewData, id) {
            $ionicLoading.show({templateUrl: 'templates/loading.html', noBackdrop: false});
            var review= {};
            review.name = reviewData.name;
            review.text = reviewData.text;
            review.rating = reviewData.rating;
            console.log(review);


            var promise = $http({
                url: OC_CONFIG.PRODUCT + id + '/review',
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
                data: review
            })
            .success(function (response) {
                $ionicLoading.hide();
                console.log(response);
                return response;
            })
            .error(function (response) {
                $ionicLoading.hide();
                console.log(response.data);
            });
            return promise;
        }

        service.getSpecialOffers = function (query) {
            service.categProducts = [];
            if(!query) {
                var query = {};
                query.sort = 'price';
                query.order = 'DESC';
            }
            $rootScope.sortType = query.sort;

//			$ionicLoading.show({templateUrl: 'templates/loading.html', noBackdrop: false});
            var promise = $http({
                url: OC_CONFIG.SPECIAL,
                method: "GET",
                headers: {'Authorization': OC_CONFIG.TOKEN},
                params: {sort : query.sort , order: query.order}
            })
            .then(function (response) {
                console.log(response.data);
                service.categProducts = response.data;
                $rootScope.$broadcast('productsLoaded');
                $rootScope.sortOptions = "special";
//				$ionicLoading.hide();
                return response.data;
            });
            return promise;
        };

        service.getManufacturers = function () {
//			$ionicLoading.show({templateUrl: 'templates/loading.html', noBackdrop: false});
            var promise = $http({
                url: OC_CONFIG.MANUFACTURER,
                method: "GET",
                headers: {'Authorization': OC_CONFIG.TOKEN}
            })
            .then(function (response) {
//				$ionicLoading.hide();
                console.log(response.data.manufacturers);
                return response.data.manufacturers;
            });
            return promise;
        }

        service.getManufacturersProducts = function (id , query) {
            service.categProducts = [];
            console.log(query);
            if(!query) {
                var query = {};
                query.sort = 'price';
                query.order = 'DESC';
            }
            $rootScope.sortType = query.sort;

//			$ionicLoading.show({templateUrl: 'templates/loading.html', noBackdrop: false});
            var promise = $http({
                url: OC_CONFIG.MANUFACTURER +id,
                method: "GET",
                headers: {'Authorization': OC_CONFIG.TOKEN},
                params: {sort : query.sort , order: query.order}
            })
            .then(function (response) {
//				$ionicLoading.hide();
                service.categProducts = response.data.manufacturer;
                $rootScope.$broadcast('productsLoaded');
                $rootScope.sortOptions = "manufacturer";
                return response.data.manufacturer;
            });
            return promise;
        }


        service.searchProducts = function (query, type) {
            console.log(query);
            service.categProducts = {};
            service.searchQuery = query;

            if(type === "category"){
                $rootScope.categoryID = '';
                $rootScope.searchName = query.search;
            }
            $rootScope.sortType = query.sort;


            $ionicLoading.show({templateUrl: 'templates/loading.html', noBackdrop: false});
            var promise = $http({
                url: OC_CONFIG.SEARCH,
                method: "GET",
                headers: {'Authorization': OC_CONFIG.TOKEN},
                params: {"search": query.search,
                         "tag" : query.tag,
                         "description" : query.description,
                         "category_id" : query.category_id,
                         "sub_category" : query.sub_category,
                         "sort" : query.sort,
                         "order" : query.order,
                         "page" : query.page,
                         "limit" : query.limit
                        }
            })
            .then(function (response) {
                $ionicLoading.hide();
                service.categProducts = response.data;
                $rootScope.$broadcast('productsLoaded');
                $rootScope.sortOptions = "search";
                console.log(response.data);
            });
            return promise;
        }

        return service;

    });
})();
