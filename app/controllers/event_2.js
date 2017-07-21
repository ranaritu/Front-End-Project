var args = arguments[0] || {};

(function() {
	Alloy.Globals.Analytics.tagScreen("Emotion Reason");
})();

(function() {
	var goToNextPage = function(){
		var controller = Alloy.createController('event_3', {
			oneself : true
		});
		var win = controller.getView();
		win.open();
		$.event_2.close();
	};
	$.nextPageButton.addEventListener("click", function(event) {
		Alloy.Globals.EmotionEvents.addTempEventAttribute(1, $.event_reason_textarea.value);
		goToNextPage();
	});

	$.previousPageButton.addEventListener("click", function(event) {
		var controller = Alloy.createController('event_1');
		var win = controller.getView();
		win.open();
		$.event_2.close();
	});
	//var questionText = "Why do you feel " + Alloy.Globals.temp.event.emotion + "?";
		$.questionLabel.text = "Why do you feel " + Alloy.Globals.temp.event.emotion + "?";


	if (Alloy.Globals.temp.event.emotion == 'happy') {
		$.questionLabel.text += ' You can type or take a picture.';
		// add the picture button
		$.cameraButton.visible = true;
		// Insert code for picture.

		/**
		 * To add the picture for each happy event,
		 * the picture needs to be stored in the local
		 * filesystem as it was done in profile_01.js.
		 * This time, a unique name needs to be generated for each
		 * picture that will be taken by the user for a given event.
		 * A possible name could be happy_[timestamp].jpg.
		 *
		 */

   $.cameraButton.addEventListener('click', function(event) {
		Titanium.Media.showCamera({
			success : function(event) {

				Ti.API.debug('Our type was: ' + event.mediaType);

				if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
					$.event_positive_photo_view.image = event.media;
					// Saving the picture temporarily until the event is actually created.
					/*
					 * @todo Rename the file once the event is created.
					 */


					var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'happy_temp_picture.jpg');
					f.write(event.media);
					Alloy.Globals.EmotionEvents.addTempEventAttribute(1, '');
					Ti.App.Properties.setBool('event_positive.picture_saved', true);
					goToNextPage();

					} else {
						alert("got the wrong type back =" + event.mediaType);
					}
				},

				cancel : function() {

				},
				error : function(error) {
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
				saveToPhotoGallery : true,
				allowEditing : true,
				mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]	//add background image of the header
			}); 
		});
		
		
	}

	var data = Alloy.Globals.EmotionEvents.getTempEventAttributeData(1);
	if (data !== null) {
		// Filling the text field with the value
		$.event_reason_textarea.value = data;
	}
	$.emotion_header.backgroundImage = Alloy.Globals.getEmotionBakgroundImage(Alloy.Globals.getEmotionIdentifier(Alloy.Globals.temp.event.emotion));
})();
