exports.definition = {
	config: {
		columns: {
			"event_data_id": "INTEGER PRIMARY KEY AUTOINCREMENT",
		    "event_id": "INTEGER",
		    "data": "STRING",
		    /**
		     * data_type indicates the type of the event_data stored.
		     * 1: reason
		     * 2: adjective_oneself
		     * 3: adjective_partner
		     * 4: right_thing_to_do (negative event)
		     * 5: three_things_oneself (negative event)
		     * 6: three_things_partner (negative event)
		     * 7: unexpected (positive event)
		     * 8: resolved_issue (true/false) (negative event) (false if the resolution is still PENDING! nothing to do with successfully resolved or not)
		     * 9: unresolved_reminder_date (negative event) (date at which a reminder needs to be sent to the user)
		     * 10: positive_resolution_description
		     * 11: negative_resolution_description
		     * 12: successful_resolution (true/false) (true if the event was successfully resolved).
		     */
		    "data_type":"INTEGER"
		},
		adapter: {
			type: "sql",
			collection_name: "event_data",
			idAttribute: "event_data_id"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});

		return Collection;
	}
};