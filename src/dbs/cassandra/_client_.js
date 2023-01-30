
const cassandra = require('cassandra-driver')

const client = new cassandra.Client({
    contactPoints: ['localhost:9042'],
    localDataCenter: 'datacenter1',
    keyspace: 'system_schema',
    credentials: {
        username: 'cassandra',
        password: 'cassandra'
    }
})

module.exports = client