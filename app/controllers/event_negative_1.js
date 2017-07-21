var args = arguments[0] || {};

Alloy.Globals.Analytics.tagScreen("Right thing to do");

$.nextPageButton.addEventListener("click", function(event){
	Alloy.Globals.EmotionEvents.addTempEventAttribute(4, $.event_reason_textarea.value);
	var controller =  Alloy.createController('event_negative_2');
	var win = controller.getView();
	win.open();
	$.event_negative_1.close();
});
$.previousPageButton.addEventListener("click", function(event){
	// Going back to partner adjective
	var controller = Alloy.createController('event_3',{oneself:false});
	var win = controller.getView();
	win.open();
	$.event_negative_1.close();
});

(function(){
	var data = Alloy.Globals.EmotionEvents.getTempEventAttributeData(4);
	if(data !== null){
		// Filling the text field with the value
		$.event_reason_textarea.value = data;
	}
})();
