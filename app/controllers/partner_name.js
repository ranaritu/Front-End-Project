var args = arguments[0] || {};
Alloy.Globals.Analytics.tagScreen("Partner Profile Name and Age");

// Loading the name from local storage. If the property is not set, put an empty string.
$.pname.value = Ti.App.Properties.getString('profile.partnername', "");
$.page.value = Ti.App.Properties.getString('profile.partnerage', "");

var exitScreen = function(controller) {
	// Saving the name to the local storage
	Ti.App.Properties.setString('profile.partnername', $.pname.value);
	Ti.App.Properties.setString('profile.partnerage', $.page.value);
	Alloy.Globals.Analytics.tagEvent('ProfileInformation', {
		'age': $.page.value
	});
	var win = controller.getView();
	win.open();
	$.partner_name.close();
};



$.next_button.addEventListener("click", function(event){
	exitScreen(Alloy.createController('profile_textarea_question',{propertyName:"profile.partner.dating_goal"})); 
});


$.exit_button.addEventListener("click", function(event){
	exitScreen(Alloy.createController('profile_summary_2'));
}); 

$.back_button.addEventListener("click", function(event){
	var controller =  Alloy.createController('profile_textarea_question',{propertyName:"profile.deal_breakers"});
	var win = controller.getView();
	win.open();
	$.partner_name.close();
}); 