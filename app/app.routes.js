'use strict';
(function () {
    var app = angular.module('app.routes', ['ui.router']);

    app.config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('leftdrawer', {
            url: "/drawer",
            cache: false,
            //			abstract: true,
            templateUrl: "templates/left-drawer.html",
            controller: "PersonalInfoController"
        })
            .state('leftdrawer.home', {
            url: '/home',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/home.html',
                    controller: 'HomeViewController',
                    resolve: {
//                        featuredCategories: function (CommonService) {
//                            return CommonService.getFeaturedCategory();
//                        }
//						cart: function (CartService) {
//							return CartService.getCart();
//						},
//						banner : function (CommonService) {
//							return CommonService.getBanner();
//						}
                    }
                }
            }
        })
            .state('leftdrawer.categories', {
            url: "/menu/categories",
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: "templates/menuCategories.html",
                    controller: 'CategoriesController',
                    resolve: {
                        categories: function(ProductService){
                            return ProductService.getAllCategories();
                        }
                    }
                }
            }
        })
            .state('leftdrawer.subCategories', {
            url: "/menu/categories/subcategories",
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: "templates/menuSubCategories.html",
                    controller: 'CategoriesController',
                    resolve: {
                        categories: function(ProductService){
                            return ProductService.getAllCategories();
                        }
                    }
                }
            }
        })
            .state('leftdrawer.products', {
            url: "/products/",
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: "templates/menuProducts.html",
                    controller: 'ProductsController'
                }
            }
        })
            .state('leftdrawer.manufacturers', {
            url: '/manufacturers',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/manufacturers.html',
                    controller: 'ManufacturersController',
                    resolve: {
                        manufacturers: function(ProductService){
                            return ProductService.getManufacturers();
                        }
                    }
                }
            }
        })
            .state('userAccount', {
            url: '/account',
            cache: false,
            templateUrl: 'templates/userAccount.html',
            controller: 'UserAccountController',
            resolve: {
                account: function (AccountService) {
                    return AccountService.userAccount();
                }
            }
        })
            .state('wishlist', {
            url: '/wishlist',
            cache: false,
            templateUrl: 'templates/wishlist.html',
            controller: 'WishlistController',
            resolve: {
                wishlist: function(AccountService){
                    return AccountService.getWishlist();
                }
            }
        })
            .state('leftdrawer.productInfo', {
            url: '/product/:productId',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/menuProductInfo.html',
                    controller: 'ProductDetailsController',
                    resolve: {
                        product: function($stateParams, ProductService) {
                            return ProductService.getProduct($stateParams.productId);
                        }
                    }
                }
            }
        })
            .state('productDescription', {
            url: '/productDescription/:productId',
            cache: false,
            templateUrl: 'templates/productDescription.html',
            controller: 'ProductDetailsController',
            resolve: {
                product: function($stateParams, ProductService) {
                    return ProductService.getProduct($stateParams.productId);
                }
            }
        })
            .state('productSpecifications', {
            url: '/productSpecifications/:productId',
            cache: false,
            templateUrl: 'templates/productSpecifications.html',
            controller: 'ProductDetailsController',
            resolve: {
                product: function($stateParams, ProductService) {
                    return ProductService.getProduct($stateParams.productId);
                }
            }
        })
            .state('productReviews', {
            url: '/productReviews/:productId',
            cache: false,
            templateUrl: 'templates/productReviews.html',
            controller: 'ProductReviewsController',
            resolve: {
                reviews: function ($stateParams, ProductService) {
                    return ProductService.getProductReviews($stateParams.productId)
                },
                productId : function ($stateParams) {
                    return $stateParams.productId
                }
            }


        })
            .state('cart', {
            url: '/cart',
            cache: false,
            templateUrl: 'templates/cart.html',
            controller: 'CartController',
            resolve: {
                cart: function( CartService) {
                    return CartService.getCart();
                }
            }
        })
            .state('checkout', {
            url: '/checkout',
            cache: false,
            templateUrl: 'templates/checkout.html',
            controller: 'CheckoutController',
            resolve: {
                cart: function(CartService) {
                    return CartService.getCart();
                },
                account: function (AccountService) {
                    return AccountService.userAccount();
                }
            }
        })
            .state('paymentAddress', {
            url: '/paymentAddress',
            cache: false,
            templateUrl: 'templates/checkoutPaymentAddress.html',
            controller: 'DeliveryDetailsController',
            resolve: {
                deliveryData: function(AccountService) {
                    return AccountService.getAddresses();
                }
            }
        })
            .state('shippingAddress', {
            url: '/shippingAddress',
            cache: false,
            templateUrl: 'templates/checkoutShippingAddress.html',
            controller: 'DeliveryDetailsController',
            resolve: {
                deliveryData: function(AccountService) {
                    return AccountService.getAddresses();
                }
            }
        })
            .state('shippingMethod', {
            url: '/shippingMethod',
            cache: false,
            templateUrl: 'templates/checkoutShippingMethod.html',
            controller: 'DeliveryDetailsController',
            resolve: {
                deliveryData: function(CheckoutService) {
                    return CheckoutService.getShippingMethod();
                }
            }
        })
            .state('paymentDetails', {
            url: '/paymentDetails',
            cache: false,
            templateUrl: 'templates/paymentDetails.html',
            controller: 'PaymentDetailsController',
            resolve: {
                paymentMethods: function(CheckoutService) {
                    return CheckoutService.getPaymentMethod();
                }
            }
        })
            .state('newAddress', {
            url: '/newAddress',
            cache: false,
            templateUrl: 'templates/addNewAddress.html',
            controller: 'AddressesController'
        })

            .state('editAddress', {
            url: '/editAddress',
            cache: false,
            templateUrl: 'templates/editAddresses.html',
            controller: 'DeliveryDetailsController',
            resolve: {
                deliveryData: function(AccountService) {
                    return AccountService.getAddresses();
                }
            }
        })
            .state('accountDetails', {
            url: '/accountDetails',
            cache: false,
            templateUrl: 'templates/accountDetails.html',
            controller: 'UserAccountController',
            resolve: {
                account: function (AccountService) {
                    return AccountService.userAccount();
                }
            }
        })
            .state('changePassword', {
            url: '/changePassword',
            cache: false,
            templateUrl: 'templates/changePassword.html',
            controller: 'UserAccountController',
            resolve: {
                account: function (AccountService) {
                    return AccountService.userAccount();
                }
            }
        })
            .state('leftdrawer.userLogin', {
            url: '/login',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/userLogin.html',
                    controller: 'PersonalInfoController'
                }
            }
        })
            .state('leftdrawer.userRegister', {
            url: '/register',
            cache: false,
            views: {
                'menuContent': {
                    templateUrl: 'templates/userRegister.html',
                    controller: 'PersonalInfoController'
                }
            }
        })
            .state('addCard', {
            url: '/addCard',
            cache: false,
            templateUrl: 'templates/checkoutAddCard.html',
            controller: 'CheckoutController',
            resolve: {
                cart: function(CartService) {
                    return CartService.getCart();
                },
                account: function (AccountService) {
                    return AccountService.userAccount();
                }
            }
        })
            .state('goodbye', {
            url: '/goodbye',
            cache: false,
            templateUrl: 'templates/goodbye.html',
            controller: 'PersonalInfoController'
        })
            .state('settings', {
            url: '/settings',
            cache: false,
            templateUrl: 'templates/settings.html',
            controller: 'SettingsController',
            resolve: {
                notifications: function ($localStorage) {
                    return $localStorage.notifications
                }
            }

        })
            .state('messages', {
            url: '/messages',
            cache: false,
            templateUrl: 'templates/messages.html',
            controller: 'SettingsController',
            resolve: {
                notifications: function ($localStorage) {
                    return $localStorage.notifications
                }
            }
        })
            .state('noInternet', {
            url: '/noInternet',
            templateUrl: 'templates/noInternet.html'
        });
    });

})();
