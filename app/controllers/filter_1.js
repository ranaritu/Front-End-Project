var args = arguments[0] || {};

Alloy.Globals.Analytics.tagScreen("Filter");

(function() {
	var emotionArray = [{
		displayName : 'Happy',
		'emotion' : 'happy'
	}, {
		displayName : 'Sad',
		'emotion' : 'sad'
	}, {
		displayName : 'Anxious',
		'emotion' : 'anxious'
	}, {
		displayName : 'Upset',
		'emotion' : 'upset'
	}, {
		displayName : 'Angry',
		'emotion' : 'angry'
	}, {
		displayName : 'Mixed emotions',
		'emotion' : 'mixed'
	}];
	var mask = [];
	var emotionFilter = Alloy.Globals.Timeline.EmotionFilter;
	for (var i = 0; i < emotionArray.length; i++) {
		var wrapperView = $.UI.create("View", {
			classes : ["line_view"]
		});
		var titleLabel = $.UI.create("Label", {
			classes : ['title_label'],
			text : emotionArray[i].displayName
		});
		/*
		 * If the variable is in the emotion filter, we set the value of
		 * selected to true and change the switch so that it looks selected.
		 */
		var selected = false;
		for(var j = 0; j < emotionFilter.length; j++){
			if(emotionFilter[j] === emotionArray[i].emotion){
				selected = true;
				break;
			}
		}
		var emotionSwitch = $.UI.create("Switch", {
			classes : ['emotion_switch'],
			value: selected
		});
		wrapperView.add(titleLabel);
		wrapperView.add(emotionSwitch);
		$.switch_view.add(wrapperView);
	}
	$.filter_scroll.addEventListener("swipe", function(e) {
		/**
		 * Getting the values that were checked.
		 */
		var c = $.switch_view.children;
		var filteredEmotions = [];
		for(var i = 0; i < c.length; i++){
			var switchElement = c[i].children[1];
			if(switchElement.getValue() == true){
				filteredEmotions.push(emotionArray[i].emotion);
			}
		}
		Alloy.Globals.Timeline.EmotionFilter = filteredEmotions;
		Ti.App.fireEvent('timeline_filter_event',{'emotion_filter':filteredEmotions});
		//var controller = Alloy.createController('index',{'emotion_filter':filteredEmotions});
		//var win = controller.getView();
		//win.open();
		$.menuWindow.close();
	});
})();
