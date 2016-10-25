require('../style/style.scss');

var app = angular.module('fbtogc', []);

app.controller('myCtrl', function($scope) {
    $scope.eventURLS = [''];
    $scope.removeURL = function(index) {
        $scope.eventURLS.splice(index, 1);
    };
    $scope.addURL = function() {
        $scope.eventURLS.push('');
    };
	$scope.hello = function() {
		alert('hello');
	};
});
