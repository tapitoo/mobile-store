'use strict';
(function () {
	var app = angular.module('Tapitoo.WishlistCtrl', ['ui.router']);
	//factory for cart operations
	app.controller('WishlistController', function (wishlist, $scope, $state, $ionicPopover, ShopService, AccountService) {
		$scope.products = wishlist;

		$scope.goToProduct = function(id, e) {
			console.log(e.target.localName);
			if(e.target.localName !== "i"){
				//console.log("go to product with id:" + id);
				$state.go("leftdrawer.productInfo", {productId: id})
			}
		}

		$ionicPopover.fromTemplateUrl('./templates/productRemoveWishlist.html', {
			scope: $scope
		}).then(function(popover) {
			$scope.popover = popover;
		});

		$scope.openPopover = function (id, $event) {
			$scope.productID = id;
			document.body.classList.remove('platform-ios');
			document.body.classList.remove('platform-android');
			document.body.classList.add('platform-android');
			$scope.popover.show($event);
		}

		$scope.removeFromWishlist = function () {
			console.log($scope.productID );
			var promise = AccountService.deleteProductFromWishlist($scope.productID)
			promise.then(
				function(response) {
					console.log(response.data);
					$state.go($state.current, {}, { reload: true });
				},
				function(error) {
					$state.go($state.current, {}, { reload: true });

				});
			$scope.popover.hide();
		}

	})
})();
