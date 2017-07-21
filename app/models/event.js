exports.definition = {
	config: {
		columns: {
		    "id": "INTEGER PRIMARY KEY AUTOINCREMENT",
		    /**
		     * emotion is an integer representing the type of emotion.
		     * 1: happy
		     * 2: sad
		     * 3: anxious
		     * 4: upset
		     * 5: angry
		     * 6: mixed
		     */
		    "emotion": "INTEGER",
		    "date": "INTEGER"
		},
		adapter: {
			type: "sql",
			collection_name: "event",
			idAttribute: "id"
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