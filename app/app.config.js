'use strict';
(function () {
    var app = angular.module('app.config', ['ui.router']);

    app.constant('TAPITOO_CONFIG', {
        backend: 'http://139.59.165.6',
        restaurantID: '9016e8c1-0c3d-4da2-9823-4a64d8dc5b43',
        facebookID: '271360646354244'
    });

//    http://139.59.165.6/opencart-2.0.1.0/upload


    app.constant('OC_CONFIG', (function() {
//		var backend = 'http://185.16.40.144/opencart-2.0.0.0/upload/api/v1';
        var backend = 'http://139.59.165.6/opencart-2.0.1.0/upload/api/v1';
//		var backend = 'http://185.16.40.144/opencart-2.0.2.0/upload/api/v1';
        var payment = 'http://139.59.165.6/opencart-2.0.1.0/upload/index.php?route=payment'
        return {
            CLIENT_ID: 'api',
            CLIENT_SECRET: 'apiapiapiapiapiapiapiapi',
            ONESIGNAL_ID : '161fb178-5a41-11e5-a09e-2b644f8bcad6',//'live onesignal',
//			ONESIGNAL_ID : '179cfbf0-4038-11e5-9dad-9bd86f0ff0ef',//'test onesignal',
            GOOGLE_PROJECT_NUMBER : '1049754901328',
            BACKEND : backend,
            CATEGORIES: backend + '/product/category/',
            PRODUCT: backend + '/product/product/',
            REVIEWS: backend + '/product/review/',
            SPECIAL: backend + '/product/special/',
            MANUFACTURER: backend + '/product/manufacturer/',
            SEARCH: backend + '/product/search',
            CART: backend + '/cart/product/',
            EDIT_CART: backend + '/cart/',
            GET_CART: backend + '/cart/cart/',
            ACCOUNT: backend + '/account/',
            CHECKOUT: backend + '/checkout/',
            WISHLIST: backend + '/account/wishlist/',
            COMMON: backend + '/common/',
            MODULE: backend + '/module/',
            OAUTH: backend + '/oauth2/token',
            PAYMENT: payment + '/'
        }
    })());

})();
