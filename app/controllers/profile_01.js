var args = arguments[0] || {};
Alloy.Globals.Analytics.tagScreen("Profile Name and Age");

// Loading the name from local storage. If the property is not set, put an empty string.
$.name.value = Ti.App.Properties.getString('profile.name', "");
$.age.value = Ti.App.Properties.getString('profile.age', "");
$.relation.value = Ti.App.Properties.getString('profile.relation', "");


var exitScreen = function(controller) {
	// Saving the name to the local storage
	Ti.App.Properties.setString('profile.name', $.name.value);
	Ti.App.Properties.setString('profile.age', $.age.value);
	Ti.App.Properties.setString('profile.relation', $.relation.value);
	Alloy.Globals.Analytics.tagEvent('ProfileInformation', {
		'age': $.age.value, 'relation': $.relation.value
	});
	var win = controller.getView();
	win.open();
	$.profile_01.close();
};

$.back_button.addEventListener("click", function(event) {
	exitScreen(Alloy.createController('profile_summary'));
});

$.next_button.addEventListener("click", function(event) {
	exitScreen(Alloy.createController('relationship_duration'));
});

$.exit_button.addEventListener("click", function(event) {
	exitScreen(Alloy.createController('profile_summary'));
});

