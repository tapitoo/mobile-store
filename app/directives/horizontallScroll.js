(function() {
	var HorizontalScrollFix = (function() {
		function HorizontalScrollFix($timeout, $ionicScrollDelegate) {
			return {
				restrict: 'A',
				link: function(scope, element, attrs) {
					var mainScrollID = attrs.horizontalScrollFix,
						scrollID = attrs.delegateHandle;

					var getEventTouches = function(e) {
						return e.touches && (e.touches.length ? e.touches : [
							{
								pageX: e.pageX,
								pageY: e.pageY
							}
						]);
					};

					var fixHorizontalAndVerticalScroll = function() {
						var mainScroll, scroll;
						mainScroll = $ionicScrollDelegate.$getByHandle(mainScrollID).getScrollView();
						scroll = $ionicScrollDelegate.$getByHandle(scrollID).getScrollView();

						// patch touchstart
						scroll.__container.removeEventListener('touchstart', scroll.touchStart);
						scroll.touchStart = function(e) {
							var startY;
							scroll.startCoordinates = ionic.tap.pointerCoord(e);
							if (ionic.tap.ignoreScrollStart(e)) {
								return;
							}
							scroll.__isDown = true;
							if (ionic.tap.containsOrIsTextInput(e.target) || e.target.tagName === 'SELECT') {
								scroll.__hasStarted = false;
								return;
							}
							scroll.__isSelectable = true;
							scroll.__enableScrollY = true;
							scroll.__hasStarted = true;
							scroll.doTouchStart(getEventTouches(e), e.timeStamp);
							startY = mainScroll.__scrollTop;

							// below is our changes to this method
							// e.preventDefault();

							// lock main scroll if scrolling horizontal
							$timeout((function() {
								var animate, yMovement;
								yMovement = startY - mainScroll.__scrollTop;
								if (scroll.__isDragging && yMovement < 2.0 && yMovement > -2.0) {
									mainScroll.__isTracking = false;
									mainScroll.doTouchEnd();
									animate = false;
									return mainScroll.scrollTo(0, startY, animate);
								} else {
									return scroll.doTouchEnd();
								}
							}), 100);
						};
						scroll.__container.addEventListener('touchstart', scroll.touchStart);
					};
					$timeout(function() { fixHorizontalAndVerticalScroll(); });
				}
			};
		}

		return HorizontalScrollFix;

	})();

	angular.module('horizontalScroll', ['ui.router']).directive('horizontalScrollFix', ['$timeout', '$ionicScrollDelegate', HorizontalScrollFix]);

}).call(this);
