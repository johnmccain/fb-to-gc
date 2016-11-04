require('../style/style.scss');
// require('../js/AsyncEventLoader.js');

var app = angular.module('fbtogc', []);

window.fbAsyncInit = function() {
	FB.init({
		appId: '1354964521180957',
		xfbml: true,
		version: 'v2.8'
	});
	FB.AppEvents.logPageView();
	let $scope = angular.element('[ng-controller=myCtrl]').scope();
	$scope.getFBAuth();
};


(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {
		return;
	}
	js = d.createElement(s);
	js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


/**
 * Handles Facebook api authentication
 */
app.service('fbAuth', function() {
	let _self = this;
	this.auth = function() {
		let def = new jQuery.Deferred();
		FB.getLoginStatus(function(response) {
			console.log(response);
			def.resolve(response);
		});
		let prom = def.promise();
		prom.connected = false;
		return prom;
	};
});

/**
 * Handles the asynchronous loading of Facebook events through the FB graph API
 */
app.service('eventLoader', function() {
	let _self = this;
	this.loadEvent = function(eventId, accessToken) {
		let def = new jQuery.Deferred();
		FB.api('/' + eventId + '?access_token=' + accessToken, function(response) {
			def.resolve(response);
			//Do something with the result
		});
		let prom = def.promise();
		prom.connected = false;
		return prom;
	};
});

app.controller('myCtrl', ['$scope', 'fbAuth', 'eventLoader', function($scope, fbAuth, eventLoader) {
	$scope.getFBAuth = function() {
		//TODO: automatically renew access token
		let prom = fbAuth.auth();
		prom.then(function(response) {
			$scope.loginStatus = response.status;
			$scope.accessToken = response.authResponse.accessToken;
		});
	};
	$scope.events = [];
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
		if (!$scope.accessToken) {
			alert('You must be logged in via Facebook in order to gather event data');
		} else {
			let eventIds = [];
			for (let i = 0; i < $scope.eventUrls.length; ++i) {
				let startIndex = $scope.eventUrls[i].val.indexOf("/events/");
				if ($scope.eventUrls[i].val && startIndex > 0) {
					if ($scope.eventUrls[i].val.charAt($scope.eventUrls[i].val.length - 1) != '/') {
						eventIds.push($scope.eventUrls[i].val.substring(startIndex + 8, $scope.eventUrls[i].val.length));
					} else {
						eventIds.push($scope.eventUrls[i].val.substring(startIndex + 8, $scope.eventUrls[i].val.length - 1));
					}
				} else {
					//TODO: add form feedback
					console.error('URL ' + (i + 1) + ' is not a facebook event (' + $scope.eventUrls[i].val + ')');
				}
			}
			if (!$scope.accessToken) {
				//TODO: disable "process urls" button until access token is granted
				console.log('no access token in $scope');
			}
			for (let i = 0; i < eventIds.length; ++i) {
				console.log('Trying to load event with id: ' + eventIds[i]);
				let prom = eventLoader.loadEvent(eventIds[i], $scope.accessToken);
				//TODO: handle failed requests
				prom.then(function(response) {
					//TODO: handle error responses
					console.log(response);
					$scope.events.push(response);
					$scope.$apply();
				});
			}
		}
	};
	$scope.resetUrls = function() {
		$scope.eventUrls = [''];
	};
}]);
