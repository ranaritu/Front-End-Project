var args = arguments[0] || {};
(function(){
	var data_type = 2; // oneself
	if(typeof args.oneself === 'boolean'){
		if(!args.oneself){
			data_type = 3; // partner
			$.questionLabel.text = "How would you describe him after this experience?";
			Alloy.Globals.Analytics.tagScreen("His trait (new event)");
		}
		else{
			Alloy.Globals.Analytics.tagScreen("My trait (new event)");
		}
	}
	var eventData = Alloy.createCollection('event_data');
	var table = eventData.config.adapter.collection_name;
	
	var registerAdjective = function(adjectiveName){
		Ti.API.info('registerAdj');
		Alloy.Globals.EmotionEvents.addTempEventAttribute(data_type, adjectiveName);
		var controller = null;
		if(data_type === 2){
			// oneself
			controller =  Alloy.createController('event_3',{oneself:false}); // going to partner screen
		}
		else{
			// partner
			//going to positive or negative event screen
			if(Alloy.Globals.temp.positiveEvent===true){
				controller = Alloy.createController('event_positive_1');
			}
			else{
				controller = Alloy.createController('event_negative_1');
			}
		}
		var win = controller.getView();
		win.open();
		$.event_3.close();
	};
	var existingTraitSelection = function(event){
		//Ti.API.log("info",event.source.title);
		registerAdjective(event.source.title);
	};
	eventData.fetch(
		{query:"SELECT data AS adjective FROM "+table+" WHERE data_type="+data_type+" AND LENGTH(data)>0 GROUP BY data ORDER BY data"}
	);
	eventData.forEach(function(model){
		var button = $.UI.create("Button", {
			classes:['trait_button'],
			title:model.get("adjective")
		});
		button.addEventListener('click',existingTraitSelection);
		$.trait_view.add(button);
	});
	$.search_textfield.addEventListener("change",function(event){
		var searchQuery = event.value;
		var buttons = $.trait_view.children;
		var childCount = buttons.length;
		for(var i=0; i<childCount; i++){
			var button = buttons[i];
			var text = button.title;
			if(button.id!=="add_trait_button"){
				if(text.indexOf(searchQuery)===-1){
					button.visible = false;
					button.width = 0;
					button.height = 0;
				}
				else{
					button.visible = true;
					button.width = "80dp";
					button.height = "80dp";
				}
			}
		};
	});
	
	$.previousPageButton.addEventListener("click", function(event){
		//Alloy.Globals.temp.event.reason = ;
		if(data_type === 2){
			// oneself
			controller =  Alloy.createController('event_2'); // going back to reason
		}
		else if(data_type === 3){
			// oneself
			controller =  Alloy.createController('event_3',{oneself:true}); // going back to oneself adjective
		}
		else {
			var dialog = Ti.UI.createAlertDialog({
				message: 'Exception.',
				ok: 'Close',
				title: 'Programmation error'
			  });
			dialog.show();
		}
		var win = controller.getView();
		win.open();
		$.event_3.close();
	});
	$.add_trait_button.addEventListener("click",function(event){
		var dialog = null;
		if (Alloy.Globals.isIphone){
			dialog = Ti.UI.createAlertDialog({
				title: 'Enter adjective',
				style: Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT,
				buttonNames: ['OK']
			});
		}
		else if(Alloy.Globals.isAndroid){
			dialog = $.dialog;
		}
		else return;
		dialog.addEventListener('click', function(e){
			//Ti.API.info(e);
			var adjective = null;
			if (Alloy.Globals.isIphone){
				adjective = e.text;
			}
			else{
				// has to be Android
				
				adjective = $.android_adjective_textfield.value;
			}
			Ti.API.info('adjective: ' + adjective);
			if(adjective.length===0){
				Ti.UI.createAlertDialog({
					title: 'The adjective cannot be empty.',
					buttonNames: ['OK']
				}).show();
			}
			else
				registerAdjective(adjective);
		});
		dialog.show();
	});
})();


