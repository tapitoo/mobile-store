'use strict';
(function () {
    var app = angular.module('Tapitoo.CartService', ['ui.router']);

    app.factory('CartService', function (OC_CONFIG, $http, $rootScope, $ionicLoading, $ionicPopup,ionicToast, $translate, $state) {
        var service = {};

        service.addProductToCart = function (prod) {
            $ionicLoading.show({templateUrl: 'templates/loading.html', noBackdrop: false});
            var postArray = [];
            var quantity = 1;
            postArray.push({"product_id" : prod.product_id});
            postArray.push({"quantity" : "1"});
            for (var i=0 ; i<prod.options.length ; i++) {
                if(prod.options[i].type==="radio" || prod.options[i].type==="select" || prod.options[i].type==="checkbox" ){
                    for(var j=0 ; j<prod.options[i].product_option_value.length; j++) {
                        var option = prod.options[i].product_option_value[j];
                        if (option.checked === true){
                            var property = {};
                            var propertyName = "option["+prod.options[i].product_option_id+"]";
                            var propertyValue = prod.options[i].product_option_value[j].product_option_value_id;
                            if(prod.options[i].type === "checkbox") {
                                propertyName += "[]"
                            }
                            property[propertyName] = propertyValue;
                            postArray.push(property);
                        }
                    }
                }
                if(prod.options[i].type==="date" || prod.options[i].type==="time" || prod.options[i].type==="datetime" || prod.options[i].type==="text" || prod.options[i].type==="textarea"){
                    console.log(prod.options[i].type);
                    console.log(prod.options[i].type);
                    console.log(prod.options[i]);
                    var property = {};
                    var propertyName = "option["+prod.options[i].product_option_id+"]";
                    var propertyValue = prod.options[i].value;
                    property[propertyName] = propertyValue;
                    postArray.push(property);
                }
            }
            console.log(postArray);

            $http({
                method: "post",
                url: OC_CONFIG.CART,
                headers: {'Authorization': OC_CONFIG.TOKEN, 'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj){
                        var myobj = Object.keys(obj[p])
                        console.log(myobj);
                        console.log(obj[p][myobj]);
                        str.push((myobj) + "=" + encodeURIComponent(obj[p][myobj]));
                        console.log(str);
                    }
                    return str.join("&");
                },
                data: postArray
            }).
            success(function (data, status, headers, config) {
                $ionicLoading.hide();
                ionicToast.show('Product added in cart', 'middle', false, 1500);
                console.log(data.cart.products);
                updateCartQuantity(data.cart.products);
            }).
            error(function (data, status, headers, config) {
                console.log(data.error);
                $ionicLoading.hide();
            });
        }


        service.deleteProductFromCart = function (id) {
            //console.log(key);
            var promise = $http({
                url: OC_CONFIG.EDIT_CART + 'deleteproduct/' + id,
                method: "POST",
                headers: {'Authorization': OC_CONFIG.TOKEN}
            })
            .success(function (response) {
                $ionicLoading.hide();
                updateCartQuantity(response.cart.products);
                console.log("Delete from cart");
                console.log(response);
                return response;
            })
            .error(function (error) {
                $ionicLoading.hide();
                console.log(error);
            });
            return promise;
        }

        service.getCart = function () {
            var promise = $http({
                url: OC_CONFIG.GET_CART,
                method: "GET",
                headers: {'Authorization': OC_CONFIG.TOKEN}
            })
            .then(function (response) {
                updateCartQuantity(response.data.cart.products);
                return response.data.cart;
            });
            return promise;
        }

        service.postProductQuantity = function (quantity, product_key) {
            $ionicLoading.show({templateUrl: 'templates/loading.html', noBackdrop: false});
            var propertyName = product_key;
            var propertyValue = quantity;
            var property = {};
            property[propertyName] = propertyValue;

            var promise = $http({
                url: OC_CONFIG.EDIT_CART + 'putproduct',
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
                data: property
            })
            .success(function (response) {
                $ionicLoading.hide();
                console.log(response.cart);
                updateCartQuantity(response.cart.products);
                return response.cart;
            })
            .error(function (response) {
                $ionicLoading.hide();
                console.log(response);
            });
            return promise;
        }

        var updateCartQuantity = function (cart) {
            if(cart){
                $rootScope.cartBadge = 0;
                for(var i=0; i<cart.length; i++){
                    $rootScope.cartBadge += cart[i].quantity
                    console.log($rootScope.cartBadge);
                }
            }
            else {
                $rootScope.cartBadge = 0;
            }
        }

        return service;
    });
})();
