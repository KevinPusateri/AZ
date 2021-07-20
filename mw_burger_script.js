//Created by Andrea 'Bobo' Oboe 2021
//www.andreaoboe.com

/* Args input sequence
slice(2)[0] -> level of parallelism (if 1, tests are executed sequential)
slice(2)[1] -> headed (true or false)
slice(2)[2] -> scheduled (true or false)
*/

if (process.argv.slice(2).length < 1) {
	console.log('\nMissing arguments. Please Use like this:\n');
	console.log("\x1b[33m%s\x1b[0m", '[0] -> level of parallelism (if 1, specs are executed sequential); MAX is 3\n');
	console.log("\x1b[35m%s\x1b[0m", '[1] -> headed (true or false) [OPTIONAL, default is false]\n');
	console.log("\x1b[34m%s\x1b[0m", '[2] -> scheduled (true or false) [OPTIONAL, default is false]\n');

	process.exit(0);
}
else {
	//Verify first arg is a number
	if (isNaN(process.argv.slice(2)[0])) {
		console.log("\x1b[31m%s\x1b[0m", 'Please specify a number for parallelism (Max is 3)\n');
		process.exit(0);
	}
}

if (process.argv.slice(2)[0] > 3) {
	console.log("\x1b[31m%s\x1b[0m", 'Max Level of parallelism for this kind of tests is 3!\n');
	process.exit(0);
}

let headed = false
if (process.argv.slice(2).length >= 2 && process.argv.slice(2)[1] === 'true') {
	headed = true
	console.log('\nHeaded is ON\n')
}

let scheduled = false
if (process.argv.slice(2).length >= 2 && process.argv.slice(2)[2] === 'true') {
	scheduled = true
	console.log('Scheduled is ON\n')
}

//#region DO NOT EDIT
const path = require('path')
const async = require('async')
const fs = require('fs')
const cypress = require('cypress')
const { addListener, exit } = require('process')
const { resolve } = require('path');
const { clear } = require('console');
const pMap = require('p-map');
const prompt = require('prompt-sync')()
require('events').EventEmitter.defaultMaxListeners = 15
let PARALLEL_RUN_COUNT = process.argv.slice(2)[0]
const integrationDirectory = path.join(__dirname, String("./cypress/integration/navigationBurger/"))
//#endregion DO NOT EDIT

//#region Chooser Type run all or single collections
var filenames = fs.readdirSync(integrationDirectory);
var indexCollection = 0;
let option = '';
if (!scheduled) {
	console.log("\x1b[35m%s\x1b[0m", '\n1. Test all Specs\n');
	console.log("\x1b[36m%s\x1b[0m", '2. Test a Single Spec\n');
	var runChooser = -1;
	do {
		runChooser = parseInt(prompt('Enter your choice : '), 10);
	} while (isNaN(runChooser) || runChooser > 2 || runChooser < 1);

	switch (runChooser) {
		case 1:
			option = 1;
			break;
		case 2:
			option = 2;
			break;
	}
	if (option == 2) {
		showAllCollectionToDecide();
		var specName = getCollectionName(filenames);
	}
}
else
	option = 1;
//#endregion

function showAllCollectionToDecide() {

	// Function to get current filenames 
	// in directory 

	console.log("\nFilenames in directory:");
	filenames.forEach((file) => {
		console.log(indexCollection + " - File:", file);
		indexCollection++;
	});


}

function millisToMinutesAndSeconds(millis) {
	var minutes = Math.floor(millis / 60000);
	var seconds = ((millis % 60000) / 1000).toFixed(0);
	return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function getCollectionName() {
	var collectionChooser = -1;
	do {
		collectionChooser = parseInt(prompt('Enter your choice : '), 10);
	} while (isNaN(collectionChooser) || collectionChooser > indexCollection - 1 || collectionChooser < 0);

	return filenames[collectionChooser];
}

async function main() {

	var fullTests = [];
	if (option == '1') {
		let specs = fs.readdirSync(integrationDirectory);

		specs.forEach((spec) => {
			fullTests.push(integrationDirectory + spec);
		});
	} else
		fullTests.push(integrationDirectory + specName);

	const paramsRun = []
	for (let i = 0; i < fullTests.length; i++) {
		let specName = String(fullTests[i]).replace(/^.*[\\\/]/, '').replace('.js', '')
		paramsRun.push({
			specName: specName,
			cypressParams: {
				quiet: true,
				spec: fullTests[i],
				headed: headed,
				reporter: 'junit',
				reporterOptions: {
					"mochaFile": "./results//Report_" + specName.toUpperCase() + ".xml",
					"toConsole": false
				},
				config: {
					video: false
				}
			}
		})
	}

	const mapper = async paramRun => {
		console.log("Start run for " + paramRun.specName + "...")
		return await cypress.run(paramRun.cypressParams)
	}

	const results = await pMap(paramsRun, mapper, { concurrency: parseInt(PARALLEL_RUN_COUNT) })

	let totalTests = 0
	let totalPassed = 0
	let totalFailed = 0
	let totalSkipped = 0
	let totalDuration = 0
	for (let i = 0; i < results.length; i++) {
		totalTests += results[i].totalTests
		totalPassed += results[i].totalPassed
		totalFailed += results[i].totalFailed
		totalSkipped += results[i].totalSkipped
		totalDuration += results[i].totalDuration
	}
	console.log('********************************************************')
	console.log('\nTotal Test Executed : ' + totalTests)
	console.log('Total Test Passed : ' + totalPassed)
	console.log('Total Test Failed : ' + totalFailed)
	console.log('Total Test Skipped : ' + totalSkipped)
	console.log('Total Runtime Duration => ' + millisToMinutesAndSeconds(totalDuration))
	console.log('********************************************************')
	console.log('Test MW Navigation Burger FE Cypress Completed!');
	process.exit(0)
}

main()