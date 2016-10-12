'use strict';
(function () {
    var app = angular.module('Tapitoo.AccountService', ['ui.router']);

    app.factory('AccountService', function (OC_CONFIG, $http, $rootScope, ionicToast, $ionicLoading, $ionicPopup, $translate, $state, CommonService) {
        var service = {};

        service.postOneSignalID = function (clientID, oneSignalId){
            var user = {};
            user.clientId = clientID;
            user.onesignalId = oneSignalId;

            console.log("client id: "+ user.clientID);
            console.log("one signal id:" + user.onesignalId);
            var promise = $http({
                url: OC_CONFIG.ACCOUNT + 'notificationsid',
                method: "POST",
                headers: {'Authorization': OC_CONFIG.TOKEN, 'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj){
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));

                    }
                    return str.join("&");
                },
                data: user
            })
            .success(function (response) {
                //$rootScope.account = response.account;
                return response;
            })
            .error(function (response) {
                console.log(response);
            });
            return promise;
        };



        service.userLogin = function (userCreds) {
            $ionicLoading.show({templateUrl: 'templates/loading.html', noBackdrop: false});
            console.log(userCreds);
            var userCredentials = {};
            userCredentials.email = userCreds.email;
            userCredentials.password = userCreds.password;

            var promise = $http({
                url: OC_CONFIG.ACCOUNT + 'login',
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
                data: userCredentials
            })
            .success(function (response) {
                $ionicLoading.hide();
                console.log(response);
                $rootScope.account = response.account;
//				window.plugins.OneSignal.getIds(function(ids) {
//					service.postOneSignalID(response.account.customer_id, ids.userId);
//				});
                return response.account;
            })
            .error(function (response) {
                $ionicLoading.hide();
                console.log(response);
            });
            return promise;
        }

        service.userLogout = function () {
            $ionicLoading.show({templateUrl: 'templates/loading.html', noBackdrop: false});
            var promise = $http({
                url: OC_CONFIG.ACCOUNT + 'logout',
                method: "GET",
                headers: {'Authorization': OC_CONFIG.TOKEN}
            })
            .success(function (response) {
                $ionicLoading.hide();
                console.log("user logout");
                $rootScope.account = '';
                console.log($rootScope.account);
                console.log(response);
                return response;
            })
            .error(function (response) {
                console.log(response);
            });
            return promise;
        }

        service.userAccount = function () {
            $ionicLoading.show({templateUrl: 'templates/loading.html', noBackdrop: false});
            var promise = $http({
                url: OC_CONFIG.ACCOUNT + 'account',
                method: "GET",
                headers: {'Authorization': OC_CONFIG.TOKEN}
            })
            .success(function (response) {
                $ionicLoading.hide();
                console.log("user account");
                console.log(response.account);
                $rootScope.account = response.account;
                return response.account;
            })
            .error(function (response) {
                $ionicLoading.hide();
                console.log(response.errors);
                return response.errors;
            });
            return promise;
        }

        service.userRegister = function (userCreds) {
            var userCredentials = {};
            userCredentials.firstname = userCreds.firstname;
            userCredentials.lastname = userCreds.lastname;
            userCredentials.email = userCreds.email;
            userCredentials.telephone = userCreds.telephone;
            userCredentials.password = userCreds.password;
            userCredentials.confirm = userCreds.confirm;
            userCredentials.address_1 = userCreds.address_1;
            userCredentials.city = userCreds.city;
            userCredentials.postcode = userCreds.postcode;
            userCredentials.country_id = userCreds.country_id;
            userCredentials.zone_id = userCreds.zone_id;
            userCredentials.agree = userCreds.agree;

            var promise = $http({
                url: OC_CONFIG.ACCOUNT + 'register',
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
                data: userCredentials
            })
            .success(function (response) {
                console.log("user registered");
                $rootScope.account = response.account;
                window.plugins.OneSignal.getIds(function(ids) {
                    service.postOneSignalID(response.account.customer_id, ids.userId);
                });
                return response.account;
            })
            .error(function (error) {
                console.log(error);
            });
            return promise;
        }
        service.updateAccount = function (userCreds) {
            var userCredentials = {};
            userCredentials.firstname = userCreds.firstname;
            userCredentials.lastname = userCreds.lastname;
            userCredentials.email = userCreds.email;
            userCredentials.telephone = userCreds.telephone;

            var promise = $http({
                url: OC_CONFIG.ACCOUNT + 'putaccount',
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
                data: userCredentials
            })
            .success(function (response) {
                console.log("user saved");
                $rootScope.account = response.account;
                return response.data;
            })
            .error(function (error) {
                console.log(error);
            });
            return promise;
        }

        service.changePassword = function (userCreds) {
            var userCredentials = {};
            userCredentials.password = userCreds.password;
            userCredentials.confirm = userCreds.confirm;

            var promise = $http({
                url: OC_CONFIG.ACCOUNT + 'password',
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
                data: userCredentials
            })
            .success(function (response) {
                console.log("password saved");
                //				$rootScope.account = response.account;
                console.log(response);
                return response;
            })
            .error(function (error) {
                console.log(error);
            });
            return promise;
        }

        service.forgotPassword = function (email) {
            var user = {};
            user.email = email;

            var promise = $http({
                url: OC_CONFIG.ACCOUNT + 'forgotten',
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
                data: user
            })
            .success(function (response) {
                console.log("password retrieved");
                console.log(response);
                $ionicPopup.alert({
                    title: 	"Success",			//translate['popup.info'],
                    template: "A message has been sent to your email address with a new password",		//translate['popup.not_in_delivery_zone'],
                    buttons: [{
                        text: 'OK',
                        type: 'button-calm'
                    }]
                });
                return false;
                return response;
            })
            .error(function (error) {
                console.log(error);
                $ionicPopup.alert({
                    title: 	"Sorry",			//translate['popup.info'],
                    template: "Your email was not found in our records",		//translate['popup.not_in_delivery_zone'],
                    buttons: [{
                        text: 'OK',
                        type: 'button-calm'
                    }]
                });
                return false;
            });
            return promise;
        }

        service.getAddresses = function () {
            var promise = $http({
                url: OC_CONFIG.ACCOUNT + 'address',
                method: "GET",
                headers: {'Authorization': OC_CONFIG.TOKEN}
            })
            .then(function (response) {
                console.log("user addresses");
                console.log(response.data.addresses);
                return response.data.addresses;
            });
            return promise;
        }

        service.deleteAddress = function (id) {
            var promise = $http({
                url: OC_CONFIG.ACCOUNT + 'deleteaddress/'  + id,
                method: "POST",
                headers: {'Authorization': OC_CONFIG.TOKEN}
            })
            .success(function (response) {
                console.log("delete address");
                console.log(response);
                return response.data;
            })
            .error(function (error) {

            });
            return promise;
        }

        service.addAddress = function (data) {
            var address = {};
            address.firstname = data.firstname;
            address.lastname = data.lastname;
            address.address_1 = data.address;
            address.city = data.city;
            address.postcode  = data.postcode ;
            address.country_id  = data.country_id ;
            address.zone_id  = data.zone_id ;

            var promise = $http({
                url: OC_CONFIG.ACCOUNT + 'address',
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
                data: address
            })
            .success(function (response) {
                console.log(response.data);
                return response.data;
            })
            .error(function (error) {
                console.log(error);
            });
            return promise;
        }

        service.getWishlist = function () {
            service.categProducts = [];
            var promise = $http({
                url: OC_CONFIG.WISHLIST,
                method: "GET",
                headers: {'Authorization': OC_CONFIG.TOKEN}
            })
            .then(function (response) {
                return response.data.wishlist.products;
            });
            return promise;
        }

        service.addProductToWishlist = function (id) {
            var promise = $http({
                url: OC_CONFIG.WISHLIST + id,
                method: "POST",
                headers: {'Authorization': OC_CONFIG.TOKEN}
            })
            .success(function (response) {
                console.log("added product to whishlist");
                console.log(response);
                ionicToast.show('Product added to wishlist', 'middle', false, 1500);
                return response;
            })
            .error(function (error) {
                $ionicPopup.alert({
                    title: 	"Sorry",
                    template: "You have to log in if you want to be able to add products to your wishlist",
                    buttons: [{
                        text: 'OK',
                        type: 'button-calm'
                    }]
                });
                return error;
            });
            return promise;
        }

        service.deleteProductFromWishlist = function (id) {
            var promise = $http({
                url: OC_CONFIG.ACCOUNT +'deletewishlist/'+ id,
                method: "POST",
                headers: {'Authorization': OC_CONFIG.TOKEN}
            })
            .success(function (response) {
                console.log("delete product_id="+id+" from whishlist");
                console.log(response);
                return response;
            })
            .error(function (error) {
                return error;
            });
            return promise;
        }

        service.getOrderList = function () {
            var promise = $http({
                url: OC_CONFIG.ACCOUNT + 'order',
                method: "GET",
                headers: {'Authorization': OC_CONFIG.TOKEN}
            })
            .success(function (response) {
                console.log("user orders");
                console.log(response.orders);
                return response.orders;
            })
            .error(function (error) {
                console.log(error);
            });
            return promise;
        }

        service.getOrder = function (id) {
            var promise = $http({
                url: OC_CONFIG.ACCOUNT + 'order/' + id,
                method: "GET",
                headers: {'Authorization': OC_CONFIG.TOKEN}
            })
            .success(function (response) {
                console.log("user orders");
                console.log(response);
                return response;
            })
            .error(function (error) {
                console.log(error);
            });
            return promise;
        }

        return service;
    });
})();
