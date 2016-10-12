/*
 * angular-phonegap-push-notification v0.0.3
 * (c) 2014 Patrick Heneise, patrickheneise.com
 * License: MIT
 */

'use strict';

angular.module('cordova', [])

    .factory('cordovaReady', function($rootScope, $q) {
        var loadingDeferred = $q.defer();

        document.addEventListener('deviceready', function() {
            $rootScope.$apply(loadingDeferred.resolve);
        });

        return function cordovaReady() {
            return loadingDeferred.promise;
        };
    })

    .service('phone', function() {
        this.isAndroid = function() {
            var uagent = navigator.userAgent.toLowerCase();
            return uagent.search('android') > -1 ? true : false;
        };
    })

    .factory('push', function($rootScope, phone, cordovaReady) {
        return {
            registerPush: function(fn) {
                cordovaReady().then(function() { 
                    var pushNotification = window.plugins.pushNotification,
                        successHandler = function(result) {
                        },
                        errorHandler = function(error) {
                        },
                        tokenHandler = function(result) {
                            return fn({
                                'type': 'registration',
                                'id': result,
                                'device': 'ios'
                            });
                        };

                    app.onNotificationAPN = function(event) {
                        if (event.alert) {
                            navigator.notification.alert(event.alert);
                        }

                        if (event.sound) {
                            var snd = new Media(event.sound);
                            snd.play();
                        }

                        if (event.badge) {
                            pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
                        }
                    };

                    app.onNotificationGCM = function(event) {
                        switch (event.event) {
                            case 'registered':
                                if (event.regid.length > 0) {
                                    return fn({
                                        'type': 'registration',
                                        'id': event.regid,
                                        'device': 'android'
                                    });
                                }
                                break;

                            case 'message':
                                if (event.foreground) {
                                    navigator.notification.alert(
                                        event.payload.message, // message
                                        null, // callback
                                        'Confirmation', // title
                                        'OK' // buttonName
                                        );
                                } else {
                                    if (event.coldstart) {
                                    } else {
                                    }
                                }
                                break;

                            case 'error':
                                break;

                            default:
                                break;
                        }
                    };

                    if (phone.isAndroid()) {
                        pushNotification.register(successHandler, errorHandler, {
                            'senderID': '1049754901328',
                            'ecb': 'app.onNotificationGCM'
                        });
                    } else {
                        pushNotification.register(tokenHandler, errorHandler, {
                            'badge': 'true',
                            'sound': 'true',
                            'alert': 'true',
                            'ecb': 'app.onNotificationAPN'
                        });
                    }
                });
            }
        };
    });