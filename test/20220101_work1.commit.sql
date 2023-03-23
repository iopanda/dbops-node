CREATE KEYSPACE test_db WITH REPLICATION = { 'class': 'SimpleStrategy', 'replication_factor': 1 };

CREATE TABLE IF NOT EXISTS test_db.INFO (
    ID SMALLINT,
    VERSION TEXT,
    INSTALL_AT TIMESTAMP,
    PRIMARY KEY (ID)
);