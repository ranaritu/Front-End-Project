(function() {
	// Everytime the view is reloaded, the filter has to be reset.
	Alloy.Globals.Timeline.EmotionFilter = ['happy','sad','anxious','upset','angry','mixed'];
	var timelineDataCache = null;
	var timelineDataCacheInvalid = true;
	var fetchTimelineData = function(opts_filters) {
		if (timelineDataCache === null || (timelineDataCache!==null && timelineDataCacheInvalid)) {
			/**
			 * If there is nothing in the cache or the cache is invalid (because of DB update),
			 * we need to reload the data from the DB.
			 */
			var eventCollection = Alloy.createCollection('event');
			var table = eventCollection.config.adapter.collection_name;
			var eventDataCollection = Alloy.createCollection('event_data');
			var eventDataTable = eventDataCollection.config.adapter.collection_name;
			// Getting the necessary data from the database to generate the timeline.
			eventCollection.fetch({
				query : "SELECT e.id as id, e.emotion as emotion, e.date as date, me_adj_table.data as me_adj, you_adj_table.data as you_adj, Length(words_table.data) as word_count FROM " + table + ' AS e, ' + eventDataTable + " AS me_adj_table, " + eventDataTable + ' AS you_adj_table, ' + eventDataTable + " AS words_table" + " WHERE me_adj_table.event_id = e.id AND you_adj_table.event_id = e.id AND words_table.event_id = e.id " + " AND me_adj_table.data_type = 2 AND you_adj_table.data_type = 3 AND words_table.data_type = 1 ORDER BY e.date DESC"
			});

			var events = [];
			var names = [];
			eventCollection.forEach(function(model) {
				var event = {
					id : model.get('id'),
					emotion : Alloy.Globals.getEmotionName(model.get('emotion')),
					date : model.get('date'),
					me_adj : model.get('me_adj'),
					you_adj : model.get('you_adj'),
					word_count : model.get('word_count')
				};
				events.push(event);
			});
			// Getting the data from the insight table in the database for the timeline.
			var insightCollection = Alloy.createCollection('insight');
			var table = insightCollection.config.adapter.collection_name;
			insightCollection.fetch({
				query : "SELECT id, data, date FROM " + table + " ORDER BY date DESC"
			});
			var insights = [];
			insightCollection.forEach(function(model) {
				var insight = {
					id : model.get("id"),
					date : model.get('date'),
					data : model.get('data')
				};
				insights.push(insight);
			});

			/**
			 * Creating a synthesis array to merge both the events and the insights
			 * and send them to the canvas.
			 * The events and insights in the synthesis array must be ordered by
			 * most recent date first.
			 */
			var synthesis = [];
			var eventIndex = 0;
			var insightIndex = 0;
			var synthesisIndex = 0;
			// The maximum word count for drawing the bars
			var maxWordCount = 0;
			var totalLength = insights.length + events.length;

			// Adds an event to the pile to be sent to the webpage.
			var addEvent = function(event) {
				var date = new Date(event.date);
				event.type = "event";
				// Formatting the date for display
				event.date = (date.getMonth() + 1) + "/" + date.getDate() + " at " + (date.getHours()) + ":" + (date.getMinutes());
				if (event.word_count > maxWordCount) {
					maxWordCount = event.word_count;
				}
				// Adding the event to the synthesis array.
				synthesis.push(event);
			};
			var addInsight = function(insight) {
				var date = new Date(insight.date);
				insight.type = "insight";
				insight.date = (date.getMonth() + 1) + "/" + date.getDate();
				synthesis.push(insight);
			};

			/**
			 * Going through both arrays (events and insights)
			 * and picking the most recent event or insight between
			 * events[eventIndex] and insights[insightIndex] as we
			 * want them to be ordered reversely chronogically.
			 */
			while (eventIndex + insightIndex != totalLength) {
				if (eventIndex >= events.length) {
					// we have to add an insight
					addInsight(insights[insightIndex++]);
				} else if (insightIndex >= insights.length) {
					// we have to add an event
					addEvent(events[eventIndex++]);
				} else {
					// we don't know if we have to add an event or an insight
					// looking for the most recent one.
					var event = events[eventIndex];
					var insight = insights[insightIndex];
					var eventDate = event.date;
					var insightDate = insight.date;
					if (eventDate > insightDate) {
						addEvent(event);
						eventIndex++;
					} else {
						addInsight(insight);
						insightIndex++;
					}
				}
			}
			timelineDataCache = {
				maxWordCount : maxWordCount,
				synthesis : synthesis
			};
			timelineDataCacheInvalid = false;
		}
		// At this point, timelineDataCache is not null. We can filter
		Ti.API.info(opts_filters);
		Ti.API.info(timelineDataCache);
		if(opts_filters!==undefined && opts_filters !== null){
			//filtering. For now, we are just filtering emotions.
			var maxWordCount = 0;
			if(opts_filters.emotion_filter !== undefined && opts_filters.emotion_filter!== null){
				Ti.API.info("Inside filtering");
				var td = timelineDataCache;
				var workingArray = td.synthesis.slice(); // Copying the array
				var eventCount = workingArray.length;
				for(var i = eventCount-1; i >=0; i--){
					var item = workingArray[i];
					if(item.type === 'insight'){
						workingArray.splice(i,1);
						continue;
					}
					// Now we have an event for sure
					var showsOnTimeline = false;
					//Ti.API.info(item[i].emotion);
					for(var j = 0; j < opts_filters.emotion_filter.length; j++){
						//Ti.API.info('item[i].emotion:'+item[i].emotion);
						if(item.emotion === opts_filters.emotion_filter[j]){
							showsOnTimeline = true;
							break;
						}
					}
					Ti.API.info('Show on timeline: '+showsOnTimeline);
					Ti.API.info('emotion: '+item.emotion);
					// If it has to be hidden from the timeline.
					if(showsOnTimeline === false){
						if (item.word_count > maxWordCount) {
							maxWordCount = item.word_count;
						}
						workingArray.splice(i,1);
						continue;
					}
				}
				
				return {
					synthesis:workingArray,
					maxWordCount : maxWordCount,
				};
			}
			
		}
		return timelineDataCache;
	};

	$.index.open();
	Alloy.Collections.event.fetch();
	Alloy.Globals.Analytics.tagScreen("Main screen");
	$.add_event_button.addEventListener('click', function() {
		var controller = Alloy.createController('event_1');
		var win = controller.getView();
		win.open();
		$.index.close();
	});

	$.dashboard_button.addEventListener('click', function() {
		Alloy.createController('dashboard').getView().open();
		$.index.close();
	});

	$.profile_button.addEventListener('click', function() {
		var controller = Alloy.createController('profile_summary');
		var win = controller.getView().open();
		$.index.close();
	});

	$.add_insight_button.addEventListener('click', function() {
		Alloy.createController('add_insight').getView().open();
		$.index.close();
	});

	$.notification_button.addEventListener('click', function() {
		Alloy.createController('notification_1').getView().open();
		$.index.close();
	});
	
	
	var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'profile_picture.jpg');
 if(f.exists()){

 var wrapperView = $.UI.create("View",{
 classes:["profile_lineView"]
 });
 var imageView = $.UI.create('ImageView',{
	 right:100,
	 top:5,	
	 width:90,
	 height:90, // Style with the CSS
	 image:f,
	 borderRadius:45,
 });
 wrapperView.add(imageView);
 $.profile_details_view.add(wrapperView);
 }
 
 
 var g = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'profile_partnerpicture.jpg');
 if(g.exists()){

 var wrapperView = $.UI.create("View",{
 classes:["profile_lineView"]
 });
 var imageView = $.UI.create('ImageView',{
	 left:0,
	 top:5,	
	 width:60,
	 height:60, // Style with the CSS
	 image:g,
	borderRadius:30,
 });
 wrapperView.add(imageView);
 $.partner_details_view.add(wrapperView);
 }

 
	/**
	 * Loading the data for the timeline through the WebView.
	 */
	$.timelineView.addEventListener('load', function() {
		var result = fetchTimelineData();
		/**
		 * Calling the javascript function defined in assets/html/timeline.html
		 * to draw the timeline based on the data that was just gathered.
		 */
		$.timelineView.evalJS('plotTimeline(' + JSON.stringify({
			max_word_count : result.maxWordCount,
			events : result.synthesis
		}) + ")");
	});
	/**
	 *
	 * @param {Object} e The javascript event object for onclick events.
	 * Contains the event id that was clicked under e.eventId.
	 */
	var openEventDetails = function(e) {
		//Ti.API.info(e.eventId);
		var controller = Alloy.createController('event_details', {
			event_id : e.eventId
		});
		var win = controller.getView();
		win.open();
		$.index.close();
	};
	/**
	 *
	 * @param {Object} e The javascript event object for onclick events.
	 * Contains the insight id that was clicked under e.insightId.
	 */
	var openInsightDetails = function(e) {
		//Ti.API.info(e.insightId);
		var controller = Alloy.createController('insight_details', {
			insight_id : e.insightId
		});
		var win = controller.getView();
		win.open();
		$.index.close();
	};
	Ti.App.addEventListener('app:timelineEventClick', openEventDetails);
	Ti.App.addEventListener('app:timelineInsightClick', openInsightDetails);

	$.index.addEventListener('close', function() {
		/**
		 * These are at an app level, needs to be unregistered.
		 */
		Ti.App.removeEventListener('app:timelineInsightClick', openInsightDetails);
		Ti.App.removeEventListener('app:timelineEventClick', openEventDetails);
		$.destroy();
	});
	$.filter_button.addEventListener("click", function(event) {
		var controller = Alloy.createController('filter_1');
		var win = controller.getView();
		win.open();
	});
	Ti.App.addEventListener('timeline_filter_event', function(e) {
		// Reloading the view when the emotion filter is fired.
		Ti.API.info(e.emotion_filter);
		// Filtering with optional arguments
		var result = fetchTimelineData({
			emotion_filter : e.emotion_filter
		});
		Ti.API.info(result);
		/**
		 * Calling the javascript function defined in assets/html/timeline.html
		 * to draw the timeline based on the data that was just gathered.
		 */
		$.timelineView.evalJS('plotTimeline(' + JSON.stringify({
			max_word_count : result.maxWordCount,
			events : result.synthesis
		}) + ")");
	});
})();



 