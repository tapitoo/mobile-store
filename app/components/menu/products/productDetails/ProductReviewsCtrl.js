'use strict';
(function () {
	var app = angular.module('ProductsReviewsCtrl', ['ui.router']);

	app.controller('ProductReviewsController', function ($scope, reviews, productId, $ionicPopup, ProductService, $ionicHistory, $ionicModal,$timeout, $state) {
//		$scope.productRating = Math.round($scope.productDetails.rating);

		$scope.reviews = reviews;

		var total = 0;
		for(var i=0; i<reviews.length; i++){
			total += parseInt(reviews[i].rating);
		}
		console.log(total);
		//return Math.round(total/reviews.length);
		$scope.productRating = Math.round(total/reviews.length);

		$scope.maxRatingValue = 0;
		$scope.initRating = 0;
		$scope.stars = [
			{rating: 1, value: 0},
			{rating: 2, value: 0},
			{rating: 3, value: 0},
			{rating: 4, value: 0},
			{rating: 5, value: 0},
		];

		// init reviews tab
		if(reviews){
			for(var i=0; i<reviews.length; i++){
				for(var j=0; j<$scope.stars.length; j++){
					if(parseInt(reviews[i].rating) === $scope.stars[j].rating){
						$scope.stars[j].value++;
						if($scope.maxRatingValue < $scope.stars[j].value)
							$scope.maxRatingValue = $scope.stars[j].value;
					}
				}
			}
			console.log($scope.maxRatingValue);
		}
		$ionicModal.fromTemplateUrl('templates/modal-add-review.html', {
			scope: $scope,
			animation: 'modal-fade'
		}).then(function(modal) {
			$scope.reviewModal = modal;
		})

		//open review modal
		$scope.openReviewModal = function () {
			console.log(productId);
			$scope.reviewModal.show();
		}

		$scope.closeReviewModal = function () {
			$scope.reviewModal.hide();
		}

		$scope.sendReview = function (review) {
			console.log(review);

			if(!review || !review.name || !review.text || !review.rating){
				$ionicPopup.alert({
					title: 	"Sorry",			//translate['popup.info'],
					template: "Your review is incomplete",		//translate['popup.not_in_delivery_zone'],
					buttons: [{
						text: 'OK',
						type: 'button-calm'
					}]
				});
				return false;
			}

			if(review.text.length<25 || review.text.length>1000){
				$ionicPopup.alert({
					title: 	"Sorry",			//translate['popup.info'],
					template: "Review Text must be between 25 and 1000 characters",		//translate['popup.not_in_delivery_zone'],
					buttons: [{
						text: 'OK',
						type: 'button-calm'
					}]
				});
				return false;
			}

			var promise = ProductService.postReview(review, productId);
			promise.then(
				//if user is logged in go to checkout
				function(response) {
					console.log(response.data);
					$scope.reviewModal.hide();
				},
				//is user is not logged in rediret to login
				function(error) {
					console.log(error.data);
					//					$state.go("leftdrawer.userLogin")
				});

		}

		$scope.rateFunction = function(rating) {
			console.log("Rating selected: " + rating);
		};

		$scope.goBack = function() {
			$ionicHistory.goBack();
		};

	})
})();
