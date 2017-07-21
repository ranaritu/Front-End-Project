var args = arguments[0] || {};

$.emotion_happy.addEventListener("click", function(event){
	positiveEmotionAction("happy");
});

$.emotion_sad.addEventListener("click", function(event){
	negativeEmotionAction("sad");
});

$.emotion_anxious.addEventListener("click", function(event){
	negativeEmotionAction("anxious");
});

$.emotion_upset.addEventListener("click", function(event){
	negativeEmotionAction("upset");
});

$.emotion_angry.addEventListener("click", function(event){
	negativeEmotionAction("angry");
});

$.emotion_mixed.addEventListener("click", function(event){
	negativeEmotionAction("mixed");
});

(function(){
	Alloy.Globals.Analytics.tagScreen("Overall feeling");
})();
function positiveEmotionAction(emotionName){
	Alloy.Globals.temp.event = {emotion:emotionName};
	Alloy.Globals.temp.positiveEvent = true;
	Alloy.Globals.temp.eventAttributes = [];
	emotionAction();
}
function negativeEmotionAction(emotionName){
	Alloy.Globals.temp.event = {emotion:emotionName};
	Alloy.Globals.temp.positiveEvent = false;
	Alloy.Globals.temp.eventAttributes = [];
	emotionAction();
}
function emotionAction(){
	//Ti.API.log('info',Alloy.Globals.temp);
	var controller =  Alloy.createController('event_2');
	var win = controller.getView();
	win.open();
	$.event_1.close();
}

$.previousPageButton.addEventListener("click", function(event){
	//Alloy.Globals.temp.event.reason = ;
	Alloy.Globals.clearEvent();
	var controller =  Alloy.createController('index');
	var win = controller.getView();
	win.open();
	$.event_1.close();
});
