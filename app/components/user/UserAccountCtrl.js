'use strict';
(function () {
    var app = angular.module('UserAccountCtrl', ['ui.router']);

    app.controller('UserAccountController', function ($scope,CheckoutService, $ionicHistory, $localStorage,account,$state,$timeout, $ionicModal, $translate, $ionicPopup, AccountService) {
        $scope.account = account.data.account;
        $scope.canEdit = false;
        $scope.user = {}


        $scope.editAccount = function () {
            if($scope.canEdit === false){
                $scope.editStatus = "OK";
                $scope.canEdit = true;
            }
            else{
                $scope.editStatus = "Edit";
                $scope.canEdit = false;
            }
        }

        $scope.saveDetails = function (){
            if(validateEmail($scope.account.email) === false)
                $ionicPopup.alert({
                    title: 	"Sorry",			//translate['popup.info'],
                    template: "Email doesn't seem to appear valid",		//translate['popup.not_in_delivery_zone'],
                    buttons: [{
                        text: 'OK',
                        type: 'button-calm'
                    }]
                });


            if($scope.account.firstname.length<1 || $scope.account.firstname.length>32){
                $ionicPopup.alert({
                    title: 	"Sorry",			//translate['popup.info'],
                    template: "First Name must be between 1 and 32 characters",		//translate['popup.not_in_delivery_zone'],
                    buttons: [{
                        text: 'OK',
                        type: 'button-calm'
                    }]
                });
                return false;
            }
            if($scope.account.lastname.length<1 || $scope.account.lastname.length>32){
                $ionicPopup.alert({
                    title: 	"Sorry",			//translate['popup.info'],
                    template: "Last Name must be between 1 and 32 characters",		//translate['popup.not_in_delivery_zone'],
                    buttons: [{
                        text: 'OK',
                        type: 'button-calm'
                    }]
                });
                return false;
            }
            if($scope.account.telephone.length<3 || $scope.account.telephone.length>32){
                $ionicPopup.alert({
                    title: 	"Sorry",			//translate['popup.info'],
                    template: "Telephone must be between 1 and 32 characters",		//translate['popup.not_in_delivery_zone'],
                    buttons: [{
                        text: 'OK',
                        type: 'button-calm'
                    }]
                });
                return false;
            }
            if($scope.account.telephone.length<3 || $scope.account.telephone.length>32){
                $ionicPopup.alert({
                    title: 	"Sorry",			//translate['popup.info'],
                    template: "Telephone must be between 1 and 32 characters",		//translate['popup.not_in_delivery_zone'],
                    buttons: [{
                        text: 'OK',
                        type: 'button-calm'
                    }]
                });
                return false;
            }


            var promise = AccountService.updateAccount($scope.account);
            promise.then(
                function (response) {
                    console.log(response);
                    $ionicHistory.goBack();
                },
                function(error){
                    console.log(error);
                })

        }

        $scope.logOut = function () {
            console.log("log out user");
            AccountService.userLogout();
            $state.go('leftdrawer.home');
        }

        $scope.changePassword = function () {
            if(!$scope.user.password){
                $ionicPopup.alert({
                    title: 	"Sorry",			//translate['popup.info'],
                    template: "Please enter new password",		//translate['popup.not_in_delivery_zone'],
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
            var promise = 	AccountService.changePassword($scope.user);
            promise.then(
                function (response) {
                    console.log(response);
                    $ionicHistory.goBack();
                },
                function(error){
                    console.log(error);
                })
        }

        $scope.goBack = function() {
            $ionicHistory.goBack();
        };

        function validateEmail(email) {
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return re.test(email);
        }


    })
})();
