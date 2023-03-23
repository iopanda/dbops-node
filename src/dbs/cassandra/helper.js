const Client = require('./_client_')

async function lastVersion(config){
    const client = Client(config)
    const query = `select * from ${config.work_ks}.schema_version where id=0`
    const result = await client.execute(query)
    client.shutdown()
    return result.rows[0].version
}


module.exports = {
    lastVersion: lastVersion
}