var args = arguments[0] || {};


(function(){
	Alloy.Globals.Analytics.tagScreen("Dashboard");
	/**
	 * Drawing the upper part of the dashboard,
	 * adjectives for me and adjectives for him.
	 * The function first retrieves the data from the database, prepares it for
	 * the HTML file (assets/html/dashboard_adjective.html) and calls the javascript function
	 * in that file.
	 */
	(function(){
		var eventDataCollection = Alloy.createCollection('event_data');
		var table = eventDataCollection.config.adapter.collection_name;
		eventDataCollection.fetch(
			{query:"SELECT data_type,data,COUNT(*) as occurrence FROM "+table+" WHERE data_type=2 OR data_type=3 GROUP BY data_type,data ORDER BY data_type, occurrence"}
		);
		var myTraits = [];
		var hisTraits = [];
		eventDataCollection.forEach(function(model){
			if(model.get('data_type')==2){
				myTraits.push({'trait':model.get('data'),'occurrence':model.get('occurrence')});
			}
			else if(model.get('data_type')==3){
				hisTraits.push({'trait':model.get('data'),'occurrence':model.get('occurrence')});
			}
		});
		Ti.API.log("info",myTraits);
		
		
		(function(traits){
			$.myTraitsChartView.addEventListener('load', function() {
				$.myTraitsChartView.evalJS('plotAdjectiveChart('+JSON.stringify(myTraits)+")");
			});
		})(myTraits);
		
		(function(traits){
			$.hisTraitsChartView.addEventListener('load', function() {
				$.hisTraitsChartView.evalJS('plotAdjectiveChart('+JSON.stringify(hisTraits)+")");
			});
		})(hisTraits);
	})();
	/**
	 * Drawing the bottom part of the timeline, the bar charts with the emotions.
	 * The function first retrieves the data from the database, prepares it for
	 * the HTML file (assets/html/dashboard.html) and calls the javascript function
	 * in that file.
	 */
	$.emotionChartView.addEventListener('load', function() {
		var eventCollection = Alloy.createCollection('event');
		var table = eventCollection.config.adapter.collection_name;
		eventCollection.fetch(
			{query:"SELECT emotion, COUNT(emotion) as occurrence FROM "+table+" GROUP BY emotion"}
		);
		var names = [];
		var occurrences = [];
		var nameOccurrenceObject = {};
		eventCollection.forEach(function(model){
			//names.push(model.get('emotion'));
			//occurences.push(model.get("occurence"));
			nameOccurrenceObject[Alloy.Globals.getEmotionName(model.get('emotion'))] = model.get("occurrence");
			
		});
		
		// Putting values in the right order
		names.push("happy","sad","anxious","upset","angry","mixed");
		for(var i=0;i<names.length;i++){
			if(typeof nameOccurrenceObject[names[i]] !== 'undefined'){
				occurrences.push(nameOccurrenceObject[names[i]]);
			}
			else{
				occurrences.push(0);
			}
		}
		//Ti.API.log("info",occurrences);
		//Ti.API.log('info',names);
		$.emotionChartView.evalJS('plotCustomChart('+JSON.stringify(names)+","+JSON.stringify(occurrences)+")");
	});
	$.timeline_button.addEventListener("click", function(event){
		var controller =  Alloy.createController('index');
		var win = controller.getView();
		win.open();
		$.dashboard.close();
	});
	
	
	
})();
	
	




