var args = arguments[0] || {};
// You can retrieve the event_id with args.event_id

$.previousPageButton.addEventListener("click", function(event) {
	var controller = Alloy.createController("notification_1");
	var win = controller.getView();
	win.open();
	$.notification_4.close();
});

$.nextPageButton.addEventListener("click", function(event) {
	Alloy.Globals.resolveEventNotification(args.event_id, false, $.reason_textarea.value);
	Alloy.Globals.Analytics.tagEvent('NotificationEventNotResolved', {
		'reason':  $.reason_textarea.value
	});
	var controller = Alloy.createController("index");
	var win = controller.getView();
	win.open();
	$.notification_4.close();
});
