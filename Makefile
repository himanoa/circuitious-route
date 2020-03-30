setup:
	touch data/database.sqlite3
	bash -c "sqlite3 data/database.sqlite3 < ./migrations/*.sql"
reset-db:
	rm data/database.sqlite3
	bash -c "sqlite3 data/database.sqlite3 < ./migrations/*.sql"
drop-db:
	rm data/database.sqlite3
