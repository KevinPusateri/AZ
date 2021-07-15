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
const prompt = require('prompt-sync')()
let PARALLEL_RUN_COUNT = process.argv.slice(2)[0]
const integrationDirectory = path.join(__dirname, String("./cypress/integration/ricerca/"))


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

function getCollectionName() {
	var collectionChooser = -1;
	do {
		collectionChooser = parseInt(prompt('Enter your choice : '), 10);
	} while (isNaN(collectionChooser) || collectionChooser > indexCollection - 1 || collectionChooser < 0);

	return filenames[collectionChooser];
}

/**
 * Returns an array with arrays of the given size.
 *
 * @param myArray {Array} Array to split
 * @param chunkSize {Integer} Size of every group
*/
function chunkArray(myArray, chunk_size) {
	var results = [];

	while (myArray.length) {
		results.push(myArray.splice(0, chunk_size));
	}

	return results;
}


const scheduleCypressnRun = async (paramRequests) => {

	return Promise.all(
		paramRequests.map(
			currentRequest => cypress.run(currentRequest.paramsRun).then(result => {
				if (result.failures) {
					console.error('Could not execute tests ' + currentRequest.specName)
					console.error(result.message)
				}

				console.info('\n------ ' + currentRequest.specName + ' --------')
				console.info('\nTotal Test : ' + result.totalTests)
				console.log('Total Test Passed : ' + result.totalPassed)
				console.log('Total Test Failed : ' + result.totalFailed)
				console.log('Total Test Skipped : ' + result.totalSkipped)
			}).catch(err => {
				console.error(err.message)
				process.exit(1)
			})
		)
	)
}

const runTests = async (specs) => {

	var batchSpecs = chunkArray(specs, PARALLEL_RUN_COUNT);

	for (let i = 0; i < batchSpecs.length; i++) {
		let typeRun
		(PARALLEL_RUN_COUNT === '1' || option == 2) ? typeRun = 'serial' : typeRun = 'parallel'
		console.log('\n--> Start run in ' + typeRun + '... Please wait for results...');
		const paramRequests = batchSpecs[i].map((spec) => {
			let specName = String(spec).replace(/^.*[\\\/]/, '').replace('.js', '');
			return cypressParamsRun = {
				specName: specName,
				paramsRun: {
					quiet: true,
					spec: spec,
					headed: headed,
					reporter: 'junit',
					reporterOptions: {
						"mochaFile": "./results//Report_" + specName + ".xml",
						"toConsole": false
					}
				}
			};
		});
		await scheduleCypressnRun(paramRequests);
		console.log('*************************************')
	}
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

	await runTests(fullTests);

	console.log('Test MW Ricerca FE Cypress Completed!');
	process.exit(0)
}

main();