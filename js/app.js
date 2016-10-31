require('../style/style.scss');

var app = angular.module('fbtogc', []);

app.controller('myCtrl', function($scope) {
	$scope.eventUrls = [{
		val: ''
	}];
	$scope.removeURL = function(index) {
		$scope.eventUrls.splice(index, 1);
	};
	$scope.addURL = function() {
		console.log($scope.eventUrls);
		$scope.eventUrls.push({
			val: ''
		});
		console.log($scope.eventUrls);

	};
	$scope.processUrls = function() {
		console.log('processing urls');
		let eventIds = [];
		for (let i = 0; i < $scope.eventUrls.length; ++i) {
			let startIndex = $scope.eventUrls[i].val.indexOf("/events/");
			if ($scope.eventUrls[i].val && startIndex > 0) {
				//TODO: refactor this
				if ($scope.eventUrls[i].val.charAt($scope.eventUrls[i].val.length - 1) != '/') {
					eventIds.push($scope.eventUrls[i].val.substring(startIndex + 8, $scope.eventUrls[i].val.length - 1));
				}
			} else {
				//TODO: add form feedback
				console.log('Error: url ' + (i + 1) + ' is not a facebook event. ' + $scope.eventUrls[i].val);
			}
		}

		//TODO: process events
	};
	$scope.resetUrls = function() {
		$scope.eventUrls = [''];
	};
	$scope.hello = function() {
		console.log($scope.eventUrls);
	};
});
