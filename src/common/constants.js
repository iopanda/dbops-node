const me = require('../../package.json')
const HOME = process.env.HOME || process.env.USERPROFILE
module.exports = {
    version: me.version,
    syskeyspace: "dbops",
    path: {
        CWD: process.cwd(),
        HOME: HOME,
        CONFIG_DIR: `${HOME}/.dbops/`,
        CONFIG_FILE: `${HOME}/.dbops/config.json`
    },
    default_config_json: {
        default: {
            type: "cassandra",
            contactPoints: ['localhost:19042'],
            localDataCenter: 'datacenter1',
            keyspace: 'system_schema',
            work_ks: 'dbops',
            credentials: {
                username: 'cassandra',
                password: 'cassandra'
            }
        }
    }
}