// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

Alloy.Globals.EmotionEvents = {};
Alloy.Globals.temp = {};
Alloy.Globals.temp.event = null;
Alloy.Globals.temp.eventAttributes = null;
Alloy.Globals.temp.positiveEvent = null;
Alloy.Globals.temp.positiveEventPictureSaved = false;
Alloy.Globals.isAndroid = (Ti.Platform.osname == 'android') ? true : false;
Alloy.Globals.isIphone = (Ti.Platform.osname == 'iphone') ? true : false;
Alloy.Globals.Timeline = {};
Alloy.Globals.Timeline.EmotionFilter = ['happy', 'sad', 'anxious', 'upset', 'angry', 'mixed'];

/**
 * Analytics code, needs to be executed before windows and anything else.
 */
(function() {
	var localytics = require('com.localytics');
	localytics.autoIntegrate();
	localytics.registerPush();
	// developer options
	localytics.setLoggingEnabled(true);
	localytics.setSessionTimeoutInterval(5);
	// set cumstom dimensions and identifiers
	/**localytics.setCustomDimension(0, 'value_one'); // custom dimension number can be 0 - 9
	 localytics.getCustomDimension(0);
	 localytics.setCustomerId('apple@localytics.com');
	 localytics.setIdentifier("my_identifier", "value");
	 localytics.getIdentifier("my_identifier");
	 **/
	Alloy.Globals.Analytics = localytics;
})();

Alloy.Globals.getEmotionIdentifier = function(emotionName) {
	if ( typeof emotionName !== "string") {
		return null;
	}
	switch(emotionName.toLowerCase()) {
	case 'happy':
		return 1;
	case 'sad':
		return 2;
	case 'anxious':
		return 3;
	case 'upset':
		return 4;
	case 'angry':
		return 5;
	case 'mixed':
		return 6;
	}
	return null;
};

Alloy.Globals.getEmotionName = function(emotionIdentifier) {
	var eId = null;
	if ( typeof emotionIdentifier === "string") {
		eId = Number(emotionIdentifier);
	} else if ( typeof emotionIdentifier === "number") {
		eId = emotionIdentifier;
	} else
		return null;
	switch(eId) {
	case 1:
		return 'happy';
	case 2:
		return 'sad';
	case 3:
		return 'anxious';
	case 4:
		return 'upset';
	case 5:
		return 'angry';
	case 6:
		return 'mixed';
	}
	return null;
};

Alloy.Globals.getEventDataTypeName = function(identifier) {
	var eId = null;
	if ( typeof identifier === "string") {
		eId = Number(identifier);
	} else if ( typeof identifier === "number") {
		eId = identifier;
	} else
		return null;
	switch(eId) {
	case 1:
		return 'reason';
	case 2:
		return 'adjective_oneself';
	case 3:
		return 'adjective_partner';
	case 4:
		return 'right_thing_to_do (negative event)';
	case 5:
		return 'three_things_oneself (negative event)';
	case 6:
		return 'three_things_partner (negative event)';
	case 7:
		return 'unexpected (positive event)';
	case 8:
		return 'resolved_issue';
	case 9:
		return 'unresolved_reminder_date';
	case 10:
		return 'positive_resolution_description';
	case 11:
		return 'negative_resolution_description';
	case 12:
		return 'successful_resolution';
	}
	return null;
};
Alloy.Globals.getEventDataTypePrettyName = function(identifier) {
	var eId = null;
	if ( typeof identifier === "string") {
		eId = Number(identifier);
	} else if ( typeof identifier === "number") {
		eId = identifier;
	} else
		return null;
	switch(eId) {
	case 1:
		return 'Why did you feel so?';
	case 2:
		return 'The adjective describing me';
	case 3:
		return 'The adjective describing my partner';
	case 4:
		return 'What was the right thing to do?';
	case 5:
		return '3 positive things about myself';
	case 6:
		return '3 positive things about my partner';
	case 7:
		return 'Unexpected thing that happened that day';
	case 8:
		return 'Resolved issue';
	case 9:
		return 'Reminder date for unresolved issues';
	case 10:
		return 'How did you solve your problem?';
	case 11:
		return 'Why did you let it go?';
	case 12:
		return 'Successfully resolved';
	}
	return null;
};

Alloy.Globals.getEmotionBakgroundImage = function(identifier) {
	switch(identifier) {
	case 1:
		return "/img/emotion_selected/02_Happy.jpg";
	case 2:
		return "/img/emotion_selected/02_Sad.jpg";
	case 3:
		return "/img/emotion_selected/02_Anxious.jpg";
	case 4:
		return "/img/emotion_selected/02_Upset.jpg";
	case 5:
		return "/img/emotion_selected/02_Angry.jpg";
	case 7:
		return "/img/emotion_selected/02_MixedEmo.jpg";
	}
};

/**
 * Saves the event to the local database and
 * deletes all the temp variables related to that newly-
 * created event.
 */
Alloy.Globals.saveEvent = function() {
	// Adding resolved issue data.
	Alloy.Globals.EmotionEvents.addTempEventAttribute(8, 'false');
	var date = new Date();
	// Setting the unresolved date to now plus two weeks (1209600000 milliseconds).
	Alloy.Globals.EmotionEvents.addTempEventAttribute(9, Date.now() + 1209);

	var tempEvent = Alloy.Globals.temp.event;
	var emotionId = Alloy.Globals.getEmotionIdentifier(tempEvent.emotion);
	var event = Alloy.createModel("event", {
		"emotion" : emotionId,
		"date" : Date.now()
	});
	event.save();
	var id = event.id;
	var eventAttributes = Alloy.Globals.temp.eventAttributes;
	for (var i = 0; i < eventAttributes.length; i++) {
		var attributes = eventAttributes[i];
		attributes.event_id = id;
		var eventData = Alloy.createModel("event_data", attributes);
		eventData.save();
	}
	// If the event is happy (positive) we need to check if there is a picture saved.
	// If there is a picture saved, we need to rename it so that it can be found later
	// given the id of the event.
	if (Alloy.Globals.temp.positiveEvent === true) {
		// Checking if there is a temp picture saved.
		if (Alloy.Globals.temp.positiveEventPictureSaved === true) {
			var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'happy_temp_picture.jpg');
			var success = f.rename('happy_event_' + id + '.jpg');
			if (success == true) {
				Ti.API.info('File has been renamed');
			} else {
				Ti.API.info('File has NOT been renamed');
			}
			f.deleteFile();
		}
	}
	Alloy.Globals.temp.event = null;
	Alloy.Globals.temp.eventAttributes = null;
	Alloy.Globals.temp.positiveEvent = null;
};

/**
 * Sets an event to resolved, used when users interact with the notifications.
 *
 * @param eventId ID of the event
 * @param resolved Boolean, true if the event was resolved, false otherwise.
 * @param reason String The reason that was typed.
 */
Alloy.Globals.resolveEventNotification = function(eventId, resolved, reason) {
	/**
	 * First, fetching the event data from the database.
	 */
	var eventDataCollection = Alloy.createCollection('event_data');
	var table = eventDataCollection.config.adapter.collection_name;
	eventDataCollection.fetch({
		query : "SELECT data_type,data,event_data_id FROM " + table + " WHERE data_type BETWEEN 8 AND 12 AND event_id="+eventId+" ORDER BY data_type"
	});
	var propertyArray = {};
	// Storing in the array the id of each event data in the range for the given event
	eventDataCollection.forEach(function(model){
		propertyArray[model.get('data_type')] = model.get('event_data_id');
	});
	var setProperty = function(eventDataTypeId, data){
		if(typeof propertyArray[eventDataTypeId] === 'undefined'){
			// Registering resolved issue.
			var eventData = Alloy.createModel("event_data", {
				event_id: eventId,
				data_type: eventDataTypeId,
				data: data
			});
			eventData.save();
		}
		else{
			var m = Alloy.createModel("event_data", {event_data_id:propertyArray[eventDataTypeId]});
			m.fetch();
			m.data = 'true';
			m.save();
		}
	};
	// Check models.event_data for the significance of the number
	setProperty(8,'true');
	setProperty(resolved===true?10:11,reason);
	setProperty(12,resolved===true?'true':'false');
};

Alloy.Globals.trackTempEventBeforeSave = function() {
	var o = {
		'type' : Alloy.Globals.temp.event.emotion
	};
	var eventAttributes = Alloy.Globals.temp.eventAttributes;
	for (var i = 0; i < eventAttributes.length; i++) {
		o[Alloy.Globals.getEventDataTypePrettyName(eventAttributes[i].data_type)] = eventAttributes[i].data;
	}
	Alloy.Globals.Analytics.tagEvent('Add event', o);
};

Alloy.Globals.clearEvent = function() {
	Alloy.Globals.temp.event = null;
	Alloy.Globals.temp.eventAttributes = null;
	Alloy.Globals.temp.positiveEvent = null;
	Alloy.Globals.temp.positiveEventPictureSaved = false;
};
/**
 * Returns the index of the event attribute for the given data type.
 * Returns null if nothing was found.
 * @param {Object} data_type
 */
Alloy.Globals.EmotionEvents.findTempEventAttribute = function(data_type) {
	var ea = Alloy.Globals.temp.eventAttributes;
	if (Alloy.Globals.temp.event === null)
		return null;
	if (ea === null)
		return null;
	var eventAttributeCount = ea.length;
	for (var i = 0; i < eventAttributeCount; i++) {
		if (ea[i].data_type === data_type) {
			return i;
		}
	}
	return null;
};

/**
 * Returns the data for the event attribute for the given data type.
 * Returns null if nothing was found.
 * @param {Object} data_type
 */
Alloy.Globals.EmotionEvents.getTempEventAttributeData = function(data_type) {
	var index = Alloy.Globals.EmotionEvents.findTempEventAttribute(data_type);
	if (index === null)
		return null;
	return Alloy.Globals.temp.eventAttributes[index].data;
};

/**
 * Adds the event attribute to the current temp event.
 * If there is already an event attribute for the given data type,
 * the existing event attribute will be overwritten.
 * @param {Object} data_type Integer
 * @param {Object} data
 */
Alloy.Globals.EmotionEvents.addTempEventAttribute = function(data_type, data) {
	var index = Alloy.Globals.EmotionEvents.findTempEventAttribute(data_type);
	if (index === null) {
		Alloy.Globals.temp.eventAttributes.push({
			data_type : data_type, // reason
			data : data
		});
	} else {
		Alloy.Globals.temp.eventAttributes[index].data = data;
	}
};

/**
 * Removes the separators that were saved in profile_textarea_question.
 * Returns an array with all the values.
 * Does not include empty strings.
 * @param {Object} str
 */
Alloy.Globals.parseTextFieldString=function(str){
	// We have to break down the string that was saved with our delimiter /@/
	var currentIndex = 0;
	var array = [];
	while (str.indexOf('/@/', currentIndex) !== -1) {
		var substr = str.substring(currentIndex, str.indexOf('/@/', currentIndex));
		if(substr.length !== 0 && substr!==' '){
			array.push(substr);
		}
		currentIndex = str.indexOf('/@/', currentIndex) + 3;
	}
	// If it's -1, we reached the end of the string.
	// We need to add the last part of the string.
	var substr = str.substring(currentIndex, str.length);
	if(substr.length !== 0 && substr!==' '){
		array.push(substr);
	}
	return array;
};
/**
 * Returns a string from the array, with all the values separated by commas.
 * @param {Object} array
 */
Alloy.Globals.flattenArray = function(array){
	var str = '';
	if(array.length>0){
		for(i=0;i < array.length-1; i++){
			str+=array[i]+', ';
		}
		str+=array[array.length-1];
	}
	return str;
};
