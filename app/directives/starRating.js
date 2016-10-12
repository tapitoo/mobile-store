'use strict';
(function () {
	var app = angular.module('starRating', ['ui.router']);

	app.directive("starsRating", function() {
		return {
			restrict : "EA",
			template : "<ul class='rating' ng-class='{readonly: readonly}'>" +
			"  <li ng-repeat='star in stars' ng-class='star' ng-click='toggle($index)'>" +
			"    <i class='ion-ios-star'></i>" + //&#9733
			"  </li>" +
			"</ul>",
			scope : {
				ratingValue : "=ngModel",
				max : "=?", //optional: default is 5
				onRatingSelected : "&?",
				readonly: "=?"
			},
			link : function(scope, elem, attrs) {
				if (scope.max == undefined) { scope.max = 5; }

				scope.stars = [1,2,3,4,5]
				function updateStars() {
					scope.stars = [];
					for (var i = 0; i < scope.max; i++) {
						scope.stars.push({
							filled : i < scope.ratingValue
						});
					}
				};
				scope.toggle = function(index) {
					if (scope.readonly == undefined || scope.readonly == false){
						scope.ratingValue = index + 1;
						scope.onRatingSelected({
							rating: index + 1
						});
					}
				};
				scope.$watch("ratingValue", function( newVal, oldVal) {
					if (newVal) { updateStars(); }
				});
			}
		};
	});

})();
