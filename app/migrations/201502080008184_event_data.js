migration.up = function(db) {
	db.createTable({
		"columns":{
			"event_data_id": "INTEGER PRIMARY KEY AUTOINCREMENT",
			"event_id":"INTEGER",
			"data":"TEXT",
			"data_type":"INTEGER"
		}
	});
};

migration.down = function(db) {
	db.dropTable();
};
