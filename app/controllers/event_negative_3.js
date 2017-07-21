var args = arguments[0] || {};
Alloy.Globals.Analytics.tagScreen("Positive things about him");
$.nextPageButton.addEventListener("click", function(event){
	Alloy.Globals.EmotionEvents.addTempEventAttribute(6,  $.positive_thing_1_field.value.replace(",","") + ", " +
			$.positive_thing_2_field.value.replace(",","") + ", " +
			$.positive_thing_3_field.value.replace(",","")
	);
	Alloy.Globals.trackTempEventBeforeSave();
	Alloy.Globals.saveEvent();
	var controller =  Alloy.createController('index');
	var win = controller.getView();
	win.open();
	$.event_negative_3.close();
});
$.previousPageButton.addEventListener("click", function(event){
	// Going back to partner adjective
	var controller = Alloy.createController('event_negative_2');
	var win = controller.getView();
	win.open();
	$.event_negative_3.close();
});

// Can't go back to this one, no need to recover.