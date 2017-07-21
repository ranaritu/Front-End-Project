var args = arguments[0] || {};

/*
 var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'profile_picture.jpg');
 if(f.exists()){

 var wrapperView = $.UI.create("View",{
 classes:["profile_lineView"]
 });
 var imageView = $.UI.create('ImageView',{
 width:100,
 height:100, // Style with the CSS
 image:f,
 borderRadius:50,
 });
 wrapperView.add(imageView);
 $.profile_details_view.add(wrapperView);
 }
 Ti.API.info('Output as a blob: '+f);
 */
$.date_picker.setMinDate(new Date(2000, 0, 1));

$.date_picker.setMaxDate(new Date());

if (Ti.App.Properties.getDouble('profile.relationship_duration', -1) !== -1) {
	/**
	 * Persistence API
	 * https://docs.appcelerator.com/platform/latest/#!/guide/Lightweight_Persistence_with_the_Properties_API
	 */
	var timeSince1979 = Ti.App.Properties.getDouble('profile.relationship_duration', -1);
	// data we saved previously
	Ti.API.info(timeSince1979);
	/**
	 * Javascript native object
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
	 */
	var dateObject = new Date(timeSince1979);
	/**
	 * Setting the value of the date picker.
	 * WARNING!! Function setValue only works for Date pickers, not for the other types! Cf. user_age.js
	 *
	 */
	$.date_picker.setValue(dateObject);
}

$.date_picker.addEventListener("change", function(e) {
	Ti.API.info("User selected date:" + e.value);
});

$.next_button.addEventListener("click", function(event) {
	Ti.App.Properties.setDouble('profile.relationship_duration', $.date_picker.getValue().getTime());
	Ti.API.info($.date_picker.getValue().getTime());
	var controller = Alloy.createController('happy');
	var win = controller.getView();
	win.open();
	$.relationship_duration.close();
});

$.exit_button.addEventListener("click", function(event) {
	var controller = Alloy.createController('profile_summary');
	var win = controller.getView();
	win.open();
	$.relationship_duration.close();
});

$.back_button.addEventListener("click", function(event) {
	var controller = Alloy.createController('profile_01');
	var win = controller.getView();
	win.open();
	$.relationship_duration.close();
});
