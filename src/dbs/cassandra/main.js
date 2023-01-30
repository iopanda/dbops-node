const client = require('./_client_')
const cqlLib = require('./_cqls_')
const config = require('../../common/config')

async function check(){
    const cql = cqlLib.checkInstall(config.keyspace)
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

async function install(){
    const cqls = cqlLib.install(config.keyspace)
    for(let i=0; i<cqls.length; i++){
        await client.execute(cqls[i]).then(() => {
            console.log(`EXEC: [${cqls[i]}].. Done`)
        }, rej => console.error(rej))
    }
    client.shutdown()
}

// check()
install()

module.exports = {
    check: check
}

