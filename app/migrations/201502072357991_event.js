migration.up = function(db) {
	db.createTable({
		"columns":{
			"id": "INTEGER PRIMARY KEY AUTOINCREMENT",
			"emotion":"INTEGER",
			"date":"INTEGER"
		}
	});
};

migration.down = function(db) {
	db.dropTable();
};
