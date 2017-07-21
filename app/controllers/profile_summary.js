var args = arguments[0] || {};
Alloy.Globals.Analytics.tagScreen("Profile Summary");
(function() {
	var addPropertyLine = function(title, data) {
		var wrapperView = $.UI.create("View",   {
			classes : ["lineView"]
		});
		var dataTitleLabel = $.UI.create("Label", {
			classes : ['dataTitleLabel'],
			text : title
		});
		var dataLabel = $.UI.create("Label", {
			classes : ['dataLabel'],
			text : data
		});
		wrapperView.add(dataTitleLabel);
		wrapperView.add(dataLabel);
		$.details_view.add(wrapperView);
	};
	var username = Ti.App.Properties.getString('profile.name', 'Not specified');
	addPropertyLine('MY NAME	  ' + username);

	var userage = Ti.App.Properties.getInt('profile.age', 'User Age');
	addPropertyLine('AGE	     ' + userage);

	var userhappy = Ti.App.Properties.getDouble('profile.happy', '100');
	addPropertyLine("RELATIONSHIP HAPPINESS		" + userhappy+ "%");

	var userlife = Ti.App.Properties.getDouble('profile.happy2', '100');
	addPropertyLine("LIFE HAPPINESS		" + userlife + "%");

		
	var relationshipStart = 'Not specified';
	if(Ti.App.Properties.getDouble('profile.relationship_duration', -1) !== -1){
		var timeSince1979 = Ti.App.Properties.getDouble('profile.relationship_duration', -1);
		var dateObject = new Date(timeSince1979);
		relationshipStart =  (dateObject.getMonth()+1) + "/"+dateObject.getDate()+'/'+dateObject.getFullYear();
	}
	addPropertyLine("RELATIONSHIP START		" + relationshipStart);
	
	
	var userdatingGoal = Ti.App.Properties.getString('profile.dating_goal1', 'None');
	addPropertyLine("DATING GOALS	" + userdatingGoal);
	
	var userdatingGoal = Ti.App.Properties.getString('profile.dating_goal1', 'None');
	addPropertyLine("DATING GOALS	" + userdatingGoal);

	var partnerChar = Ti.App.Properties.getString('profile.significant_other', 'None');
	addPropertyLine("PARTNER QUALITIES	" + Alloy.Globals.flattenArray(Alloy.Globals.parseTextFieldString(partnerChar)));

	var userdealBreaker = Ti.App.Properties.getString('profile.deal_breakers', 'None');
	addPropertyLine("DEAL BREAKERS	" + Alloy.Globals.flattenArray(Alloy.Globals.parseTextFieldString(userdealBreaker)));

	if (Ti.App.Properties.getBool('profile.picture_saved', false) === true) {
		// A picture was saved on the system, trying to display it.
		var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'profile_picture.jpg');
		$.profile_photo_view.image = f;

	}

	$.cameraButton.addEventListener('click', function(event) {
		Titanium.Media.openPhotoGallery({
			success : function(event) {
				// called when media returned from the camera
				Ti.API.debug('Our type was: ' + event.mediaType);

				if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
					$.profile_photo_view.image = event.media;
					// Saving the picture for later use.
					var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'profile_picture.jpg');
					f.write(event.media);
					Ti.App.Properties.setBool('profile.picture_saved', true);

				} else {
					alert("got the wrong type back =" + event.mediaType);
				}
			},
			cancel : function() {
				// called when user cancels taking a picture
			},
			error : function(error) {
				// called when there's an error
				var a = Titanium.UI.createAlertDialog({
					title : 'Camera'
				});
				if (error.code == Titanium.Media.NO_CAMERA) {
					a.setMessage('Please run this test on device');
				} else {
					a.setMessage('Unexpected error: ' + error.code);
				}
				a.show();
			},

			mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
		});
	});

	$.hisdata.addEventListener("click", function(event) {
		var controller = Alloy.createController('profile_summary_2');
		var win = controller.getView();
		win.open();
		$.profile_summary.close();
	});

	$.previousPageButton.addEventListener("click", function(event) {
		var controller = Alloy.createController('index');
		var win = controller.getView();
		win.open();
		$.profile_summary.close();
	});

	$.editButton.addEventListener('click', function(e) {
		var controller = Alloy.createController('profile_01');
		var win = controller.getView();
		win.open();
		$.profile_summary.close();
	});
})();

/**
 1 profile_01
 2 relationship duration
 4 happy
 5 happy
 6 dating_goals
 7 significant_other
 8 deal_breakers
 9 partner_name
 10 partner_datingGoal
 11 partner_dealBreaker
  

 6,7,8,10,11 = profile_textarea_question
 **/

