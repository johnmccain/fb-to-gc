require('../style/style.scss');
// require('../js/AsyncEventLoader.js');

/**
 * Handles the asynchronous loading of Facebook events through the FB graph API
 */
class AsyncEventLoader {
	/**
	 * Constructor for the AsyncEventLoader
	 * @constructor
	 * @param {Array} eventIds - An array of Facebook eventId strings to be loaded
	 * @param {function} callback - A callback which should accept an array of objects with event data
	 * @param {string} accessToken - The Facebook access token to be used
	 */
	constructor(eventIds, callback, accessToken) {

		console.log('constructing AsyncEventLoader');
		/**
		 * An array of eventId strings
		 * @type {Array}
		 */
		this.eventIds = eventIds;

		/**
		 * The callback to handle event data responses
		 * @type {function}
		 */
		this.callback = callback;

		/**
		 * The Facebook access token to be used in loading these events
		 * @type {string}
		 */
		this.accessToken = accessToken;

		/**
		 * An array of event objects to be filled as they are loaded
		 */
		this.events = [];

		/**
		 * The number of events to be loaded
		 * @type {number}
		 */
		this.numEvents = this.eventIds.length;

		/**
		 * The number of events loaded
		 * @type {number}
		 */
		this.numLoaded = 0;
	}

	/**
	 * Initiates the loading process
	 */
	load() {
		console.log('loading...\n' + this.eventIds.length);
		for (let i = 0; i < this.eventIds.length; ++i) {
			console.log('hello?');
			this.loadEvent(this.eventIds[i], i);
		}
	}

	/**
	 * Loads an eventId and adds it to the list of events, calls the callback if all events loaded
	 * @param {string} eventId - The eventId of the Facebook event to load
	 * @param {number} index - the index in the loaded events array
	 */
	loadEvent(eventId, index) {
		let _self = this;
		console.log('API loading event with id ' + eventId);
		FB.api(
			"/" + eventId + '?' + _self.accessToken,
			function(response) {
				if (response && !response.error) {
					_self.events[index] = response;
					if (++_self.numLoaded == _self.numEvents) {
						_self.callback(_self.events);
					}
				} else {
					console.error('Error loading Facebook event with id: ' + eventId);
					console.log(response);
				}
			}
		);
	}
}

var app = angular.module('fbtogc', []);

window.fbAsyncInit = function() {
	FB.init({
		appId: '1354964521180957',
		xfbml: true,
		version: 'v2.8'
	});
	FB.AppEvents.logPageView();
	updateAccessToken();
};

function updateAccessToken() {
	let $scope = angular.element(document.getElementById('event-table')).scope();
	FB.getLoginStatus(function(response) {
		console.log(response);
		$scope.loginStatus = response;
	});
	window.setTimeout(function() {
		console.log('getting accessToken');

	}, 5000);
	FB.getAuthResponse(function(response) {
		console.log('responding');
		console.log(response);
		$scope.accessToken = response.accessToken;
		console.log($scope.accessToken);
	});
}

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
		if (!$scope.accessToken) {
			alert('You must be logged in via Facebook in order to gather event data');
		} else {
			console.log('processing urls');
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

			let eventLoader = new AsyncEventLoader(eventIds, function(events) {
				console.log('Events loaded! \n' + events);
			}, $scope.accessToken);

			eventLoader.load();
		}
	};
	$scope.resetUrls = function() {
		$scope.eventUrls = [''];
	};
	$scope.hello = function() {
		console.log($scope.eventUrls);
	};

});
