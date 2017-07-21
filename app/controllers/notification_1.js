var args = arguments[0] || {};

Alloy.Globals.Analytics.tagScreen("Notifications 1");

(function() {
	/**
	 * Returns the event ids of the events for which a notification is due.
	 */
	var getEventIds = function() {
		var eventDataCollection = Alloy.createCollection('event_data');
		var eventDataTable = eventDataCollection.config.adapter.collection_name;
		eventDataCollection.fetch({
			query : "SELECT e.event_id AS id FROM " + eventDataTable + " AS e" + " WHERE e.data_type=8 AND e.data = \"false\""
		});
		var eventString = "(";
		// Building the query by fetching the ids of all the events for which the resolved_issue is false.
		eventDataCollection.forEach(function(model) {
			eventString += "e.id=" + model.get('id') + ' OR ';
		});
		return eventString;
	};
	/**
	 * 1) We need to check in the database all the events that are
	 * unresolved and for which the unresolved reminder date is past due.
	 * 2) We need to fetch the results and display the screen.
	 *
	 */

	var eventCollection = Alloy.createCollection('event');
	var table = eventCollection.config.adapter.collection_name;

	var eventString = getEventIds();
	var events = [];
	var names = [];
	if (eventString.length !== 1) {
		// Deleting the last OR and closing the parenthesis.
		eventString = eventString.substr(0, eventString.length - 4) + ')';
		// Getting the necessary data from the database to generate the timeline.
		eventCollection.fetch({
			query : "SELECT e.id as id, e.emotion as emotion, e.date as date, reason_table.data as reason, unresolved_date_table.data AS unresolved_date FROM "
			 + table + ' AS e, event_data AS reason_table, event_data AS unresolved_date_table' + 
			" WHERE " + eventString + " AND reason_table.event_id = e.id AND reason_table.data_type=1 AND unresolved_date_table.event_id = e.id " + 
			"AND unresolved_date_table.data_type = 9 AND e.emotion != 1 ORDER BY e.date DESC"
		});
		eventCollection.forEach(function(model) {
			var date = new Date(model.get('date'));
			var udate = new Date(parseInt(model.get('unresolved_date')));
			Ti.API.info(model.get('unresolved_date'));
			Ti.API.info(parseInt(udate.toString()));
			var event = {
				id : model.get('id'),
				emotion : Alloy.Globals.getEmotionName(model.get('emotion')),
				date : (date.getMonth() + 1) + "/" + date.getDate() + " at " + (date.getHours()) + ":" + (date.getMinutes()),
				reason : model.get('reason'),
				unresolved_date : (udate.getMonth() + 1) + "/" + udate.getDate() + " at " + (udate.getHours()) + ":" + (udate.getMinutes()),
			};
			events.push(event);

		});
		Ti.API.log("info", events);
		// Now you have an array of events
		/**
		 * You can create a view programmatically like we did in profile summary.
		 * You go through the 'events' array with a loop and you can display the values
		 * in the array (id, emotion, date, etc.).
		 *
		 */
	}
	(function() {

		var addPropertyLine = function(title, data) {
			var wrapperView = $.UI.create("View", {
				classes : ["lineView"]
			});
			var dataTitleLabel = $.UI.create("Label", {
				classes : ['dataTitleLabel'],
				text : title
			});
			var dataLabel = $.UI.create("Label", {
				classes : ['dataLabel'],
				text : data
			});
			wrapperView.add(dataTitleLabel);
			wrapperView.add(dataLabel);
			$.details_view.add(wrapperView);

		};

		for (var i = 0; i < events.length; i++) {
			addPropertyLine("You Felt " + events[i].emotion + " 			" + events[i].date);
			addPropertyLine(events[i].reason);
			//addPropertyLine(events[i].unresolved_date + "\n");
			var buttonWrapperView = $.UI.create("View", {
				classes : ["button_wrapper_view"]
			});
			var resolvedButton = $.UI.create("Button", {
				classes : ['solved_button','resolution_button'],
				layout:'horizontal',
				title : "Solved it",
				data_event_id: events[i].id
			});
			resolvedButton.addEventListener('click',solvedButtonAction);
			var unresolvedButton = $.UI.create("Button", {
				classes : ['unsolved_button','resolution_button'],
				layout:'horizontal',
				title : "Unresolved",
				data_event_id: events[i].id
			});
			unresolvedButton.addEventListener('click',unsolvedButtonAction);
			buttonWrapperView.add(resolvedButton);
			buttonWrapperView.add(unresolvedButton);
			$.details_view.add(buttonWrapperView);
			
		}

	})();

	function solvedButtonAction(e) {
		// Going on notification_3 with the event_id as parameter
		var controller = Alloy.createController('notification_3',{event_id:e.source.data_event_id});
		var win = controller.getView();
		win.open();
		$.notification_1.close();
	}

	function unsolvedButtonAction(e) {
		var controller = Alloy.createController('notification_4',{event_id:e.source.data_event_id});
		var win = controller.getView();
		win.open();
		$.notification_1.close();
	}


	$.back_button.addEventListener("click", function(event) {
		var controller = Alloy.createController('index');
		var win = controller.getView();
		win.open();
		$.notification_1.close();
	});

	
})(); 