migration.up = function(db) {
	db.createTable({
		"columns":{
			"id": "INTEGER PRIMARY KEY AUTOINCREMENT",
			"data":"TEXT",
			"date": "INTEGER"
		}
	});
};

migration.down = function(db) {
	db.dropTable();
};
