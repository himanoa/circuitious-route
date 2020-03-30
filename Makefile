setup:
	touch data/database.sqlite3
	cat ./migrations/*.sql > sqlite3 data/database.sqlite3
reset-db:
	rm data/database.sqlite3
	cat ./migrations/*.sql > sqlite3 data/database.sqlite3
drop-db:
	rm data/database.sqlite3
