var args = arguments[0] || {};
Alloy.Globals.Analytics.tagScreen("how happy you are in your relationhip?");

$.slider.addEventListener("change", function(e) {

	$.slider.text = $.slider.value;
	//$.slider_label.text = String.format("%3.1f", e.value);
	Ti.API.log('current value of slider:' + $.slider.text);
});

$.slider2.addEventListener("change", function(e) {
	$.slider2.text = $.slider2.value;
	Ti.API.log('current value of slider:' + $.slider2.text);
});
$.slider.setValue(Ti.App.Properties.getDouble('profile.happy', 100.0));
$.slider2.setValue(Ti.App.Properties.getDouble('profile.happy2', 100.0));

var saveSliderValue = function() {
	Ti.App.Properties.setDouble('profile.happy', $.slider.getValue());
	Ti.App.Properties.setDouble('profile.happy2', $.slider2.getValue());
	Alloy.Globals.Analytics.tagEvent('ProfileInformationHappy', {
		'happy': $.slider.getValue(),
		'happy2':$.slider2.getValue()
	});
	Alloy.Globals.Analytics.tagEvent('ProfileInformation_PropertyChanged', {
			'property_name': 'profile.happy', 'property_value':$.slider.getValue()
		});
			Alloy.Globals.Analytics.tagEvent('ProfileInformation_PropertyChanged', {
			'property_name': 'profile.happy2', 'property_value':$.slider2.getValue()
		});

};

$.exit_button.addEventListener("click", function(event) {
	saveSliderValue();
	var controller = Alloy.createController('profile_summary');
	var win = controller.getView();
	win.open();
	$.happy.close();
});

$.back_button.addEventListener("click", function(event) {
	var controller = Alloy.createController('relationship_duration');
	var win = controller.getView();
	win.open();
	$.happy.close();
});

$.next_button.addEventListener("click", function(event) {
	saveSliderValue();
	var controller = Alloy.createController('profile_textarea_question', {
		propertyName : "profile.dating_goal"
	});
	var win = controller.getView();
	win.open();
	$.happy.close();
});

