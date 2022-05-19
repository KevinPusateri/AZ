//Created by Andrea 'Bobo' Oboe 2022
//www.andreaoboe.com

if (process.argv.slice(2).length < 1) {
    console.log('\nMissing arguments. Please Use like this:\n');
    console.log("\x1b[35m%s\x1b[0m", '[0] -> headed (true or false) [OPTIONAL, default is false]\n');
    console.log("\x1b[32m%s\x1b[0m", '[1] -> currentEnv (PREPROD or TEST) [OPTIONAL, default is PREPROD]\n');
    console.log("\x1b[32m%s\x1b[0m", '[1] -> isTFS (false or true) [OPTIONAL, default is false]\n');

    process.exit(0);
}

let headed = false
if (process.argv.slice(2).length >= 1 && process.argv.slice(2)[0] === 'true') {
    headed = true
    console.log('\nHeaded is ON\n')
}

let currentEnv = 'PREPROD'
if (process.argv.slice(2).length >= 2 && process.argv.slice(2)[1] === 'TEST') {
    currentEnv = 'TEST'
    console.log('Environment is TEST\n')
}

let isTFS = false
if (process.argv.slice(2).length >= 3 && process.argv.slice(2)[2] === 'true') {
    isTFS = true
    console.log('TFS is ON\n')
}

//#region DO NOT EDIT
const path = require('path')
const cypress = require('cypress')
const pMap = require('p-map');
require('events').EventEmitter.defaultMaxListeners = 15
const rcaSpec = path.join(__dirname, String("./cypress/integration/motor_RCA/AZ/mw_RCA_20220401.js"))
//#endregion DO NOT EDIT

async function main() {

    const paramsRun = []
    let specName = String(rcaSpec).replace(/^.*[\\\/]/, '').replace('.js', '')
    paramsRun.push({
        specName: specName,
        cypressParams: {
            browser: 'chrome',
            quiet: true,
            spec: rcaSpec,
            headed: headed,
            config: {
                video: false,
                env: {
                    isTFS: isTFS
                }
            }
        }
    })

    const mapper = async paramRun => {
        console.log("Start run for " + paramRun.specName + "...")
        return await cypress.run(paramRun.cypressParams)
    }

    await pMap(paramsRun, mapper, {})

    process.exit(0)
}

main()