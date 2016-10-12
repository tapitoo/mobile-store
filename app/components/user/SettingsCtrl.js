'use strict';
(function () {
	var app = angular.module('SettingsCtrl', ['ui.router']);

	app.controller('SettingsController', function ($scope, notifications, $localStorage, CommonService){

//		if(notifications){
//			$scope.notifications = notifications.reverse();
//		}
		$scope.notifications = notifications;
		console.log(notifications);

		if(typeof $localStorage.notificationsEnabled !== "undefined"){
			console.log($localStorage.notificationsEnabled);
			$scope.pushNotification = { checked: $localStorage.notificationsEnabled };
		}
		else
			$scope.pushNotification = { checked: true };

		$scope.pushNotificationChange = function() {
			console.log('Push Notification Change', $scope.pushNotification.checked);
			$localStorage.notificationsEnabled = $scope.pushNotification.checked
			CommonService.setOneSignalSubscription($scope.pushNotification.checked);
		};
	});
})();
