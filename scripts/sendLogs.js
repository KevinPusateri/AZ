//Created by Andrea 'Bobo' Oboe 2021
//www.andreaoboe.com

//#region DO NOT EDIT
const path = require('path');
const async = require('async');
const fs = require('fs');
const archiver = require('archiver');
var rimraf = require('rimraf');
const nodemailer = require('nodemailer');
const moment = require('moment');
const currentDT = moment().format('YYYY-MM-DD_HH.mm.ss');
//#endregion

const stream = process.argv.slice(2)[0]
const htmlExportLogMailTo = process.argv.slice(2)[1]
const currentEnv = process.argv.slice(2)[2]
const reportLogs = '..//cypress//reports//';
const xmlLogs = '..//cypress//screenshots//'

const zipDirectory = async (reportFolder, out) => {
	const archive = archiver('zip', { zlib: { level: 9 } });
	const stream = fs.createWriteStream(out);

	return new Promise((resolve, reject) => {
		archive
			.directory(reportFolder, true, { date: new Date() })
			.on('error', err => reject(err))
			.pipe(stream)
			;

		stream.on('close', () => resolve());
		archive.finalize();
	});
}

const sendMail = async () => {
	let transporter = nodemailer.createTransport({
		host: 'techuser.mail.allianz',
		port: 25,
		secure: false,
		tls: {
			rejectUnauthorized: false
		}
	});

	let mailSubject = 'Report Logs ' + stream.toUpperCase() + ' ' + currentEnv;

	await transporter.sendMail({
		from: '"Report Testing" <noreply@allianz.it>',
		to: htmlExportLogMailTo,
		subject: mailSubject,
		text: mailSubject,
		html: '<b>Report ' + mailSubject + '</b></br></br>For additional info, write to kevin.pusateri@allianz.it</br></br>',
		attachments: [
			{
				filename: 'MW_FE_' + stream.toUpperCase() + `_html_${currentEnv}.zip`,
				path: '..//MW_FE_' + stream.toUpperCase() + `_html_${currentEnv}.zip`
			},
			{
				filename: 'MW_FE_' + stream.toUpperCase() + `_xml_${currentEnv}.zip`,
				path: '..//MW_FE_' + stream.toUpperCase() + `_xml_${currentEnv}.zip`
			}
		]
	});
}

async function main() {
	if (fs.existsSync(reportLogs)) {
		await zipDirectory(reportLogs, '..//MW_FE_' + stream.toUpperCase() + `_html_${currentEnv}.zip`)
		await zipDirectory(xmlLogs, '..//MW_FE_' + stream.toUpperCase() + `_xml_${currentEnv}.zip`);

		await sendMail();
	}
	else
		console.log('Nothing to send; please check ')
}

main();