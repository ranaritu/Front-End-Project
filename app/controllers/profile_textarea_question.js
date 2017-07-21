var args = arguments[0] || {};

(function(args) {
	var question = "";
	var propertyName = args.propertyName;
	var nextScreenName = 'happy';
	var previousScreenName = 'significant_other';
	var nextScreenArgs = {};
	var previousScreenArgs = {};
	switch(propertyName) {
	case 'profile.dating_goal':
		$.pageNumber.text += '4 of 9';
		question = "What are your dating goals?";
		nextScreenName = 'profile_textarea_question';
		// dealbreaker
		nextScreenArgs = {
			propertyName : "profile.significant_other"
		};
		previousScreenName = 'happy';
		$.exit_button.addEventListener("click", function(event) {
			saveTextAreaValue();
			var controller = Alloy.createController("profile_summary");
			var win = controller.getView();
			win.open();
			$.profile_textarea_question.close();
		});

		break;
	case 'profile.significant_other':
		$.pageNumber.text += '5 of 9';
		question = "What are you looking for in a significant other?";
		nextScreenName = 'profile_textarea_question';
		// dealbreaker
		nextScreenArgs = {
			propertyName : "profile.deal_breakers"
		};
		previousScreenName = 'profile_textarea_question';
		previousScreenArgs = {
			propertyName : "profile.dating_goal"
		};
		$.exit_button.addEventListener("click", function(event) {
			saveTextAreaValue();
			var controller = Alloy.createController("profile_summary");
			var win = controller.getView();
			win.open();
			$.profile_textarea_question.close();
		});

		break;
	case 'profile.deal_breakers':
		$.pageNumber.text += '6 of 9';
		question = "What are your deal breakers?";
		nextScreenName = 'partner_name';
		previousScreenName = 'profile_textarea_question';
		previousScreenArgs = {
			propertyName : "profile.significant_other"
		};
		$.exit_button.addEventListener("click", function(event) {
			saveTextAreaValue();
			var controller = Alloy.createController("profile_summary");
			var win = controller.getView();
			win.open();
			$.profile_textarea_question.close();
		});

		break;
	case 'profile.partner.dating_goal':
		$.pageNumber.text += '8 of 9';
		question = "What are his dating goals?";
		nextScreenName = 'profile_textarea_question';
		// dealbreaker
		nextScreenArgs = {
			propertyName : "profile.partner.deal_breakers"
		};
		previousScreenName = 'partner_name';
		$.exit_button.addEventListener("click", function(event) {
			saveTextAreaValue();
			var controller = Alloy.createController("profile_summary_2");
			var win = controller.getView();
			win.open();
			$.profile_textarea_question.close();
		});

		break;
	case 'profile.partner.deal_breakers':
		$.pageNumber.text += '9 of 9';
		question = "What are his deal breakers?";
		nextScreenName = 'profile_summary';
		previousScreenName = 'profile_textarea_question';
		// dating goal
		previousScreenArgs = {
			propertyName : "profile.partner.dating_goal"
		};
		$.exit_button.addEventListener("click", function(event) {
			saveTextAreaValue();
			var controller = Alloy.createController("profile_summary_2");
			var win = controller.getView();
			win.open();
			$.profile_textarea_question.close();
		});

		break;
	}
	Alloy.Globals.profileTextAreaView = {
		propertyName : propertyName,
		previousScreenName : previousScreenName,
		nextScreenName : nextScreenName,
		nextScreenArgs : nextScreenArgs,
		previousScreenArgs : previousScreenArgs,
	};

	var deleteLine = function(event) {
		// Insert code for deleting the current line.
		$.fieldsView.remove(event.source.getParent());
	};
	var addTextField = function(defaultText) {
		var wrapperView = $.UI.create("View", {
			classes : ["lineView"]
		});
		var defaultText = ( typeof defaultText !== 'undefined') ? defaultText : '';
		var textfield = $.UI.create("TextField", {
			classes : ['positive_thing_field'],
			value : defaultText,
			hintText : 'Type here'
		});
		var deleteButton = $.UI.create('Button', {
			//title : 'Delete',
			classes : ['delete_line_button'],
		});
		deleteButton.addEventListener('click', deleteLine);
		wrapperView.add(textfield);
		wrapperView.add(deleteButton);
		$.fieldsView.add(wrapperView);
	};
	$.addLineButton.addEventListener('click', function() {
		addTextField();
	});
	$.question.text = question;

	// When loading the page, we need to populate the page with the text fields.
	var workingString = Ti.App.Properties.getString(propertyName, '');
	
	var strings = Alloy.Globals.parseTextFieldString(workingString);
	if (strings.length === 0)
		addTextField();
	else {
		for (var i = 0; i < strings.length; i++) {
			addTextField(strings[i]);
		}
	}

	var saveTextAreaValue = function() {
		/**
		 * Saving all the text entries into a single string.
		 */
		var textAreaString = '';
		var children = $.fieldsView.children;
		for (var i = 0; i < children.length; i++) {
			if (children[i].apiName == 'Ti.UI.View') {
				// It's a wrapper.
				var wrapper = children[i];
				// we know for sure that textField is the firt child of wrapper.
				var textField = wrapper.children[0];
				Ti.API.info(textField);
				Ti.API.info(textField.value);
				// Adding the content of the text field to the textAreaString variable.
				// We add the delimiter /@/ to be able to break down the string later on.
				textAreaString += (textField.value + '/@/');
			}
		}
		Ti.API.info(textAreaString);
		Ti.App.Properties.setString(propertyName, textAreaString);
		Alloy.Globals.Analytics.tagEvent('ProfileInformation_PropertyChanged', {
			'property_name': propertyName, 'property_value': textAreaString
		});
	};

	$.back_button.addEventListener("click", function(event) {
		saveTextAreaValue();
		var controller = Alloy.createController(previousScreenName, previousScreenArgs);
		var win = controller.getView();
		win.open();
		$.profile_textarea_question.close();
	});

	$.next_button.addEventListener("click", function(event) {
		saveTextAreaValue();
		var controller = Alloy.createController(nextScreenName, nextScreenArgs);
		var win = controller.getView();
		win.open();
		$.profile_textarea_question.close();
	});
})(args);

