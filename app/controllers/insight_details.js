var args = arguments[0] || {};
Alloy.Globals.Analytics.tagScreen("Insight event");

(function(){
	//Ti.API.log(args);
	if(typeof args.insight_id === 'undefined'){
		
	}
	else{
		var model = Alloy.createModel("insight");
		model.fetch({id:args.insight_id});
		//Ti.API.log(model);
		$.insightLabel.text = model.get("data");
		var date = new Date(model.get("date"));
		$.dateLabel.text = (date.getMonth()+1) + "/"+date.getDate();
	}
	
	
	$.previousPageButton.addEventListener("click", function(event){
		// Close handler
		var controller =  Alloy.createController('index');
		var win = controller.getView();
		win.open();
		$.insight_details.close();
	});
})();
