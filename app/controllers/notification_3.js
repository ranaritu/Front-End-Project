var args = arguments[0] || {};
Alloy.Globals.Analytics.tagScreen("resolved_reason");

$.previousPageButton.addEventListener("click", function(event) {
	
	var controller = Alloy.createController("notification_1");
	var win = controller.getView();
	win.open();
	$.notification_3.close();
});

$.nextPageButton.addEventListener("click", function(event) {
	
	var controller = Alloy.createController("index");
	/**
	 * We need to save the new details.
	 */
	// Getting the event id
	var eventId = args.event_id;
	Alloy.Globals.resolveEventNotification(eventId,true,$.reason_textarea.value);
	Alloy.Globals.Analytics.tagEvent('NotificationEventResolved', {
		'reason':  $.reason_textarea.value
	});
	var win = controller.getView();
	win.open();
	$.notification_3.close();
});

