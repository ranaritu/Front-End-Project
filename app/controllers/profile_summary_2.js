var args = arguments[0] || {};
Alloy.Globals.Analytics.tagScreen("Profile Summary, Partner");
$.herdata.addEventListener("click", function(event) {
		var controller = Alloy.createController('profile_summary');
		var win = controller.getView();
		win.open();
		$.profile_summary_2.close();
	});


	$.previousPageButton.addEventListener("click", function(event) {
		var controller = Alloy.createController('index');
		var win = controller.getView();
		win.open();
		$.profile_summary_2.close();
	});

	
	$.editButton.addEventListener('click',function(e){
		var controller = Alloy.createController('partner_name');
		var win = controller.getView();
		win.open();
		$.profile_summary_2.close();
	});


if (Ti.App.Properties.getBool('profile.partnerpicture_saved', false) === true) {
	// A picture was saved on the system, trying to display it.
	var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'profile_partnerpicture.jpg');
	$.profile_photo_view.image = f;

}

$.cameraButton.addEventListener('click', function(event) {
Titanium.Media.openPhotoGallery({
    success:function(event) {
        
        Ti.API.debug('Our type was: '+event.mediaType);
        
        if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
        	$.profile_photo_view.image = event.media;
            var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'profile_partnerpicture.jpg');
				f.write(event.media);
				Ti.App.Properties.setBool('profile.partnerpicture_saved', true);

        } else {
            alert("got the wrong type back ="+event.mediaType);
        }
    },
    cancel:function() {
        
    },
    error:function(error) {
        
        var a = Titanium.UI.createAlertDialog({
        	title:'Camera'
        	});
        if (error.code == Titanium.Media.NO_CAMERA) {
            a.setMessage('Please run this test on device');
        } else {
            a.setMessage('Unexpected error: ' + error.code);
        }
        a.show();
    },
    saveToPhotoGallery:true,
   
    allowEditing:true,
    mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]		//add background image of the header
});

});


(function() {
	
	var addPropertyLine = function(title,data){
		var wrapperView = $.UI.create("View",{
			classes:["lineView"]
		});
		var dataTitleLabel = $.UI.create("Label",{
			classes:['dataTitleLabel'],
			text:title
		});
		var dataLabel = $.UI.create("Label",{
			classes:['dataLabel'],
			text:data
		});
		wrapperView.add(dataTitleLabel);
		wrapperView.add(dataLabel);
		$.details_view.add(wrapperView);
	};
	
	var partnername = Ti.App.Properties.getString('profile.partnername', 'Not specified');
	addPropertyLine('Partner  name:	' + partnername);
	
	var partnerage = Ti.App.Properties.getInt('profile.partnerage', 'Not specified');
	addPropertyLine("Partner's age:	"+ partnerage);
	
	var partnerdatingGoal = Ti.App.Properties.getString('profile.partner.dating_goal', 'None');
	addPropertyLine("Partner's Dating goals:	" + Alloy.Globals.flattenArray(Alloy.Globals.parseTextFieldString(partnerdatingGoal)));
	
	var partnerdealBreaker = Ti.App.Properties.getString('profile.partner.deal_breakers', 'None');
	addPropertyLine("Partner's deal breakers: " + Alloy.Globals.flattenArray(Alloy.Globals.parseTextFieldString(partnerdealBreaker)));
	})();
