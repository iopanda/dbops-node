
const {Client} = require('cassandra-driver')

module.exports = opts => new Client(opts)