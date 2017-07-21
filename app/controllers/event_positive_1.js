var args = arguments[0] || {};

Alloy.Globals.Analytics.tagScreen("Unexpected event");

$.nextPageButton.addEventListener("click", function(event){
	Alloy.Globals.EmotionEvents.addTempEventAttribute(7, $.event_reason_textarea.value);
	Alloy.Globals.trackTempEventBeforeSave();
	Alloy.Globals.saveEvent(); // Deletes all the temp values for the current event!
	// After a call to saveEvent(), it is not possible to go back!
	var controller =  Alloy.createController('index');
	var win = controller.getView();
	win.open();
	$.event_positive_1.close();
});
$.previousPageButton.addEventListener("click", function(event){
	// Going back to partner adjective
	var controller = Alloy.createController('event_3',{oneself:false});
	var win = controller.getView();
	win.open();
	$.event_positive_1.close();
});

// Can't go back to this one, no need to recover.

