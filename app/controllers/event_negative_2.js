var args = arguments[0] || {};
Alloy.Globals.Analytics.tagScreen("Positive things about my life");

$.nextPageButton.addEventListener("click", function(event){
	Alloy.Globals.EmotionEvents.addTempEventAttribute(5, $.positive_thing_1_field.value.replace(",","") + ", " +
			$.positive_thing_2_field.value.replace(",","") + ", " +
			$.positive_thing_3_field.value.replace(",",""));
	var controller =  Alloy.createController('event_negative_3');
	var win = controller.getView();
	win.open();
	$.event_negative_2.close();
});
$.previousPageButton.addEventListener("click", function(event){
	// Going back to partner adjective
	var controller = Alloy.createController('event_negative_1');
	var win = controller.getView();
	win.open();
	$.event_negative_2.close();
});

(function(){
	var data = Alloy.Globals.EmotionEvents.getTempEventAttributeData(5);
	if(data !== null){
		// Filling the text field with the value
		var array = data.split(", ");
		if(array.length !== 3) return;
		$.positive_thing_1_field.value = array[0];
		$.positive_thing_2_field.value = array[1];
		$.positive_thing_3_field.value = array[2];
	}
})();