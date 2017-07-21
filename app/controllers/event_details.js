var args = arguments[0] || {};
Alloy.Globals.Analytics.tagScreen("Event details");
//Ti.API.log(args);
if(typeof args.event_id === 'undefined'){
	
}
else{
	var model = Alloy.createModel("event");
	model.fetch({id:args.event_id});
	// Setting the background for the header
	$.event_details_header.backgroundImage = Alloy.Globals.getEmotionBakgroundImage(model.get('emotion'));
	var date = new Date(model.get("date"));
	$.emotionLabel.text = Alloy.Globals.getEmotionName(model.get("emotion")) + " on "+ (date.getMonth()+1) + "/"+date.getDate();
	if(Alloy.Globals.getEmotionName(model.get("emotion"))==='happy'){
		// Check if there's a picture, and display it.
		var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'happy_event_'+args.event_id+'.jpg');
		if(f.exists()){
			// there is a picture for the given id, so we need to add an imageview and display the picture.
			var wrapperView = $.UI.create("View",{
				classes:["lineView"]
			});
			var imageView = $.UI.create('ImageView',{
				width:50,
				height:50, // Style with the CSS
				image:f
			});
			wrapperView.add(imageView);
			$.details_view.add(wrapperView);
		}
	}
	var db = Ti.Database.open('_alloy_');
	var dataRS = db.execute(
		'SELECT data, data_type FROM event_data WHERE event_id='+args.event_id+' AND LENGTH(data)>0');
	while (dataRS.isValidRow())
	{
		var wrapperView = $.UI.create("View",{
			classes:["lineView"]
		});
		var dataTitleLabel = $.UI.create("Label",{
			classes:['dataTitleLabel'],
			text:Alloy.Globals.getEventDataTypePrettyName(dataRS.fieldByName('data_type'))
		});
		var dataLabel = $.UI.create("Label",{
			classes:['dataLabel'],
			text:dataRS.fieldByName('data')
		});
		wrapperView.add(dataTitleLabel);
		wrapperView.add(dataLabel);
		$.details_view.add(wrapperView);
		dataRS.next();
	}
	dataRS.close();
	db.close();
	/**
	 * Check if it's a happy event and if a picture is saved in the filesystem for the given event.
	 * For example, an event saved at timestamp 038201039 would have an associated picture with the name
	 * happy_038201039.jpg
	 * Using the following two lines, the presence of such file can be tested.
	 * var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'happy_038201039.jpg');
		if(f.exists()===true) {
	 * If the file does exist, then the image can be loaded by creating a new image view, like so:
	 * var imageView = Ti.UI.createImageView({
				width:320,
				height:320,
				image:f,
				classes:['eventImageView']
			});
			$.details_view.add(imageView);
	 */
}


$.previousPageButton.addEventListener("click", function(event){
	// Close handler
	var controller =  Alloy.createController('index');
	var win = controller.getView();
	win.open();
	$.event_details.close();
});