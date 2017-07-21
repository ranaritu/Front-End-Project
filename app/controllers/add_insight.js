(function(){
	Alloy.Globals.Analytics.tagScreen("Add Insight");
	$.nextPageButton.addEventListener("click", function(event){
		var insight = Alloy.createModel("insight",{
			"data": $.event_reason_textarea.value,
			"date": Date.now()
		});
		insight.save();
		Alloy.Globals.Analytics.tagEvent('Add insight', {'Insight':$.event_reason_textarea.value});
		var controller =  Alloy.createController('index');
		var win = controller.getView();
		win.open();
		$.add_insight.close();
	});
	$.previousPageButton.addEventListener("click", function(event){
		//Alloy.Globals.temp.event.reason = ;
		Alloy.Globals.clearEvent();
		var controller =  Alloy.createController('index');
		var win = controller.getView();
		win.open();
		$.add_insight.close();
	});
})();