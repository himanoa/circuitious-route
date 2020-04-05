setup:
	touch data/database.sqlite3
	bash -c "cat ./migrations/*.sql | sqlite3 data/database.sqlite3"
reset-db:
	rm data/database.sqlite3
	bash -c "cat ./migrations/*.sql | sqlite3 data/database.sqlite3"
drop-db:
	rm data/database.sqlite3
setup-key:
	ssh-keygen -t rsa -b 4096 -m PEM -f data/simic.private.key
