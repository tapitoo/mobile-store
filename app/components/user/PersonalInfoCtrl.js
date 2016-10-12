'use strict';
(function () {
    var app = angular.module('PersonalInfoCtrl', ['ui.router']);

    app.controller('PersonalInfoController', function ($scope,$rootScope,$ionicSideMenuDelegate, $state,$timeout, $ionicModal,$ionicHistory, $translate, $ionicPopup, ShopService, AccountService, CommonService) {
        //save user info
        $scope.user = {};

        $scope.goBack = function () {
            console.log("go back");
            $ionicHistory.goBack();
        }

        $scope.login = function () {
            console.log($scope.user);
            var promise = AccountService.userLogin($scope.user);
            promise.then(
                //if login was succesfull redirect to cart
                function(response) {
                    console.log(response.data);
                    $ionicHistory.goBack();
                },
                //throw error popup if credentials are wrong
                function(error) {
                    console.log(error.data);
                    $ionicPopup.alert({
                        title: 	"Sorry",			//translate['popup.info'],
                        template: "Your email is not in our database or the password is incorect",		//translate['popup.not_in_delivery_zone'],
                        buttons: [{
                            text: 'OK',
                            type: 'button-calm'
                        }]
                    });
                    return false;
                });
        }
        $scope.password = {};
        $scope.lostPassword = function () {
            $ionicPopup.show({
                template: '<input type="text" ng-model="password.email">',
                title: 'Enter Email Address',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Retrieve</b>',
                        type: 'button-calm',
                        onTap: function(e) {
                            if(!$scope.password.email){
                                e.preventDefault();
                            }
                            else{
                                AccountService.forgotPassword($scope.password.email)
                            }

                        }
                    }
                ]
            });
        }

        $ionicModal.fromTemplateUrl('templates/modal-country.html', {
            scope: $scope,
            animation: 'modal-fade'
        }).then(function(modal) {
            $scope.countryModal = modal;
        })

        $ionicModal.fromTemplateUrl('templates/modal-zones.html', {
            scope: $scope,
            animation: 'modal-fade'
        }).then(function(modal) {
            $scope.zonesModal = modal;
        })

        $scope.openModalCountry = function () {
            var promise = CommonService.getCountries();
            promise.then(
                function(response) {
                    console.log(response.data.countries);
                    $scope.countries = response.data.countries;
                    $scope.countryModal.show()
                },
                function(error) {
                    console.log(error.data);
                });
        }

        $scope.chooseCountry = function (country) {
            $timeout(function () {
                $scope.user.country_id = country.country_id
                $scope.user.country_name = country.name
                $scope.selectedCountry = country;
                $scope.countryModal.hide();
            }, 0, false);
        }

        $scope.openModalZoneID = function () {
            console.log($scope.selectedCountry);
            if($scope.selectedCountry){
                var promise = CommonService.getZoneIds($scope.selectedCountry.country_id);
                promise.then(
                    function(response) {
                        console.log(response.data.country.zones);
                        $scope.zones = response.data.country.zones;
                        $scope.zonesModal.show()
                    },
                    function(error) {
                        console.log(error.data);
                    });
            }
            else{
                return;
            }
        }

        $scope.chooseZone = function (zone) {
            console.log(zone);
            $timeout(function () {
                $scope.user.zone_id = zone.zone_id;
                $scope.user.zone_name = zone.name;
                $scope.selectedZone = zone;
                $scope.zonesModal.hide();
            }, 0, false);
        }

        $scope.register = function () {
            if(validateEmail($scope.user.email) === false)
                $ionicPopup.alert({
                    title: 	"Sorry",			//translate['popup.info'],
                    template: "Email doesn't seem to appear valid",		//translate['popup.not_in_delivery_zone'],
                    buttons: [{
                        text: 'OK',
                        type: 'button-calm'
                    }]
                });


            if(!$scope.user.firstname || !$scope.user.lastname || !$scope.user.email || !$scope.user.telephone || !$scope.user || !$scope.user.password || !$scope.user.address_1 || !$scope.user.postcode || !$scope.user.city || !$scope.user.country_id || !$scope.user.zone_id) {
                $ionicPopup.alert({
                    title: 	"Sorry",			//translate['popup.info'],
                    template: "All fields are requiered!",		//translate['popup.not_in_delivery_zone'],
                    buttons: [{
                        text: 'OK',
                        type: 'button-calm'
                    }]
                });
                return false;
            }
            if($scope.user.password !== $scope.user.confirm){
                $ionicPopup.alert({
                    title: 	"Sorry",			//translate['popup.info'],
                    template: "Passwords don't match",		//translate['popup.not_in_delivery_zone'],
                    buttons: [{
                        text: 'OK',
                        type: 'button-calm'
                    }]
                });
                return false;
            }
            if($scope.user.password.length<4 || $scope.user.password.length>20){
                $ionicPopup.alert({
                    title: 	"Sorry",			//translate['popup.info'],
                    template: "Password must be between 4 and 20 characters",		//translate['popup.not_in_delivery_zone'],
                    buttons: [{
                        text: 'OK',
                        type: 'button-calm'
                    }]
                });
                return false;
            }

            $scope.user.agree = true;
            var promise = AccountService.userRegister($scope.user);
            promise.then(
                function(response) {
                    console.log(response);
                    $state.go('leftdrawer.home');
                },
                function(error) {
                    console.log(error);
                });

        }


        $scope.logOut = function () {
            AccountService.userLogout();
            $state.go('leftdrawer.home')
        }

        $scope.userLogin = function () {
            $ionicSideMenuDelegate.toggleLeft();
            $state.go("leftdrawer.userLogin");
        }
        $scope.userRegister = function () {
            $ionicSideMenuDelegate.toggleLeft();
            $state.go("leftdrawer.userRegister");
        }

        function validateEmail(email) {
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return re.test(email);
        }



    });

})();
