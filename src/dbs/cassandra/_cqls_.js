const constants = require('../../common/constants')

module.exports = {
    checkInstall: ks => `select * from keyspaces where keyspace_name = '${ks}'`,
    install: ks => [
        `DROP KEYSPACE ${ks}`,
        `CREATE KEYSPACE ${ks} WITH REPLICATION = {'class': 'SimpleStrategy', 'replication_factor': 1}`,
        `CREATE TABLE IF NOT EXISTS ${ks}.INFO (
            ID SMALLINT,
            VERSION TEXT,
            INSTALL_AT TIMESTAMP,
            PRIMARY KEY (ID)
        )`,
        `CREATE TABLE IF NOT EXISTS ${ks}.SCHEMA_VERSION (
            ID SMALLINT,
            VERSION TEXT,
            APPLIED_AT TIMESTAMP,
            PRIMARY KEY (ID)
        )`,
        `CREATE TABLE IF NOT EXISTS ${ks}.SCHEMA_DETAILS (
            VERSION TEXT,
            AUTHOR TEXT,
            INFO TEXT,
            SCRIPT TEXT,
            ROLLBACK TEXT,
            PRIMARY KEY (VERSION)
        )`,
        `UPDATE ${ks}.INFO SET VERSION='${constants.version}', INSTALL_AT=currentTimestamp() WHERE ID=0`,
        `UPDATE ${ks}.SCHEMA_VERSION SET VERSION='init', APPLIED_AT=currentTimestamp() WHERE ID=0`,
        `UPDATE ${ks}.SCHEMA_DETAILS SET AUTHOR='DBOPS', INFO='init', SCRIPT=null, ROLLBACK=null WHERE VERSION='init'`
    ]
}