console.log('AsyncEventLoader loaded');

/**
 * Handles the asynchronous loading of Facebook events through the FB graph API
 */
class AsyncEventLoader {
	/**
	 * Constructor for the AsyncEventsLoader
	 * @constructor
	 * @param {Array} eventIds - An array of Facebook eventId strings to be loaded
	 * @param {function} callback - A callback which should accept an array of objects with event data
	 */
	constructor(eventIds, callback) {
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
		for (let i = 0; i < this.numEvents; ++i) {
			loadEvent(eventIds[i], i);
		}
	}

	/**
	 * Loads an eventId and adds it to the list of events, calls the callback if all events loaded
	 * @param {string} eventId - The eventId of the Facebook event to load
	 * @param {number} index - the index in the loaded events array
	 */
	loadEvent(eventId, index) {
		let _self = this;
		FB.api(
			"/" + eventId,
			function(response) {
				if (response && !response.error) {
					_self.events[index] = response;
					if(++_self.numLoaded == _self.numEvents) {
						_self.callback(_self.events);
					}
				} else if (response && response.error) {
					console.error('Error loading Facebook event with id: ' + eventId);
				}
			}
		);
	}
}
