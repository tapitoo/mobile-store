'use strict';
(function () {
    var app = angular.module('Tapitoo.StartUpService', ['ui.router']);

    //factory for HTTP requests
    app.factory('StartUpService', function (TAPITOO_CONFIG, OC_CONFIG, $http,$rootScope, $ionicHistory,$ionicPlatform, ShopService, AccountService, $ionicPopup, $state, $cordovaGeolocation, $cordovaNetwork, $timeout, $ImageCacheFactory, $localStorage) {
        var service = {};
        var accessToken = '';

        service.generateToken = function () {
            //encode CLIEND_ID + CLIENT_SECRET in Base64
            var string = OC_CONFIG.CLIENT_ID + ":" +OC_CONFIG.CLIENT_SECRET;
            accessToken = btoa(string);
            console.log("OAUTH access token: "+ accessToken);

            //Generate ACCESS_TOKEN
            var request= {};
            request.grant_type  = "access_token";

            var promise = $http({
                url: OC_CONFIG.OAUTH,
                method: "POST",
                headers: {'Authorization': 'Basic ' + accessToken , 'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj){
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        console.log(str);
                    }
                    return str.join("&");
                },
                data: request
            })
            .success(function (response) {
                console.log(response);
                OC_CONFIG.TOKEN = response.access_token;
                $localStorage.ACCESS_TOKEN = response.access_token;
                return response;
            })
            .error(function (response) {
                console.log(response);
            });
            return promise;
        }

        service.initialization = function  () {
            //check if user is logged in
//			AccountService.userAccount();

            $state.go("leftdrawer.home")
            /* hide splashscreen*/
//			$timeout(function () {
//				navigator.splashscreen.hide();
//			}, 3500, false);

            var notificationOpenedCallback = function(notification) {
                var title = notification.additionalData.title;
                var message = notification.message;

                $ionicPopup.alert({
                    title: 	title,			//translate['popup.info'],
                    template: message,		//translate['popup.not_in_delivery_zone'],
                    buttons: [{
                        text: 'OK',
                        type: 'button-calm'
                    }]
                });
                var date = new Date();
                date = date.getTime();
                if(!$localStorage.notifications) {
                    $localStorage.notifications = []
                }
                $localStorage.notifications.push({title: title, message: message, date:date})
            };

//			window.plugins.OneSignal.init(OC_CONFIG.ONESIGNAL_ID,
//										  {googleProjectNumber: OC_CONFIG.GOOGLE_PROJECT_NUMBER},
//										  notificationOpenedCallback);

            //cache background image
            $ImageCacheFactory.Cache(["../img/bg.jpg"]).then(function () {
                console.log("done preloading!");
            });

//			//check for internet connection
            //var isOffline = $cordovaNetwork.isOffline();
//			if (isOffline === true) {
//				$state.go("noInternet");
//				return false;
//			}
            //			}

            $ionicHistory.nextViewOptions({
                historyRoot: true
            })

            $http.defaults.headers.common.Authorization = OC_CONFIG.TOKEN;
        }
        return service;
    });
})();
