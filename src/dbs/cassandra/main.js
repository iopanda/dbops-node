const cqlLib = require('./_cqls_')
const Client = require('./_client_')
const constants = require('../../common/constants')
const helper = require('./helper')

async function check(client){
    const cql = cqlLib.checkInstall(constants.keyspace)
    client.execute(cql).then(res => {
        if(res.rows.length === 1){
            console.log('installed')
        } else {
            console.log('dbops is not installed')
        }
    }, rej => console.error(rej)).finally(() => {
        client.shutdown()
    })
}

async function install(config){
    const client = Client(config)
    const cqls = cqlLib.install(config.work_ks)
    for(let i=0; i<cqls.length; i++){
        await client.execute(cqls[i]).then(() => {
            //console.log(`EXEC: [${cqls[i]}].. Done`)
        }, rej => console.error(rej))
    }
    client.shutdown()
}

async function commit(config, scripts){
    const client = Client(config)
    for(let i=0; i<scripts.length; i++){
        const cqls = cqlLib.commit(config, scripts[i])
        for(let j=0; j<cqls.length; j++){
            console.log(cqls[j])
            await client.execute(cqls[j])
        }
        for(let j=0; j<scripts[i].commit.length; j++){
            await client.execute(scripts[i].commit[j])
        }
    }
    client.shutdown()
}

module.exports = {
    check: check,
    install: install,
    commit: commit
}

