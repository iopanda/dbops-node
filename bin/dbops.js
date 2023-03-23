#!/usr/bin/env node
const { Command } = require('commander')
const klawSync = require('klaw-sync')
const path = require('path')

const constants = require('../src/common/constants')
const fs = require('fs-extra')

const program = new Command()
program.version(constants.version)

program.name('dbops').description('this is for db operators').version('0.0.1')

program.command('init')
    .description('init dbops environment')
    .option('-f --force')
    .action(async () => {
        fs.ensureFileSync(constants.path.CONFIG_FILE)
        fs.writeJsonSync(constants.path.CONFIG_FILE, constants.default_config_json)
    })

program.command('install')
    .option('-n, --name <db_config_name>')
    .action(opts => {
        const config = fs.readJsonSync(constants.path.CONFIG_FILE)[opts.name]
        const main = require(`../src/dbs/${config.type}/main`)
        main.install(config)
    })

program.command('commit')
    .option('-k, --keyspace <keyspace>', 'target keyspace')
    .option('-d, --dir <dir>', 'script dirs')
    .option('-n, --name <name>', 'db name')
    .action(async opts => {
        const scripts = {}
        const config = fs.readJsonSync(constants.path.CONFIG_FILE)[opts.name]
        const helper = require(`../src/dbs/${config.type}/helper`)
        const main = require(`../src/dbs/${config.type}/main`)
        let dir = opts.dir
        if(!dir.startsWith('/')) dir = `${constants.path.CWD}/${dir}`
        const lastVersion = await helper.lastVersion(config)
        const files = klawSync(dir, {nodir: true, depthLimit: 0, filter: it => 
            it.path.endsWith('.sql') && path.basename(it.path).split('.')[0] > lastVersion
        }).map(it => path.parse(it.path)).map(it => {
            it.version = it.name.split('.')[0]
            it.type = it.name.split('.')[1]
            it.content = fs.readFileSync(`${it.dir}/${it.base}`).toString()
            return it
        }).forEach(it => {
            if(!scripts[it.version]){
                scripts[it.version] = {
                    version: it.version,
                    info: '',
                    commit: [],
                    rollback: []
                }
            }
            scripts[it.version][it.type] = it.content.split(";").map(it => it.trim()).filter(it => it != '')
        })
        let sortedScripts = []
        for(let k in scripts){
            sortedScripts.push(scripts[k])
        }
        sortedScripts = sortedScripts.sort((a,b) => a.version > b.version ? 1 : -1)
        main.commit(config, sortedScripts)
    })

program.parse(process.argv)