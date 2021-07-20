//Created by Andrea 'Bobo' Oboe 2021
//www.andreaoboe.com

//#region DO NOT EDIT
const path = require('path');
const async = require('async');
const fs = require('fs');
const archiver = require('archiver');
var rimraf = require('rimraf');
const nodemailer = require('..//node_modules//nodemailer');
const moment = require('moment');
const currentDT = moment().format('YYYY-MM-DD_HH.mm.ss');
const dirLogs = '..//cypress//screenshots//ricerca//';
//#endregion

const htmlExportLogMailTo = process.argv.slice(2)[0]

const zipDirectory = async (source, out) => {
	const archive = archiver('zip', { zlib: { level: 9 } });
	const stream = fs.createWriteStream(out);

	return new Promise((resolve, reject) => {
		archive
			.directory(source, false)
			.on('error', err => reject(err))
			.pipe(stream)
			;

		stream.on('close', () => resolve());
		archive.finalize();
	});
}

const sendMail = async () => {
	let transporter = nodemailer.createTransport({
		host: 'mail.azi.allianzit',
		port: 25,
		secure: false,
		tls: {
			rejectUnauthorized: false
		}
	});

	let mailSubject = 'Report Screenshot MW FE RICERCA PREPROD';

	await transporter.sendMail({
		from: '"MW FE Testing" <noreply@allianz.it>',
		to: htmlExportLogMailTo,
		subject: mailSubject,
		text: mailSubject,
		html: '<b>Report ' + mailSubject + '</b></br></br>For additional info, write to andrea.oboe@allianz.it or kevin.pusateri@allianz.it</br></br>',
		attachments: [
			{
				filename: 'MW_FE_RICERCA_PREPROD.zip',
				path: '..//MW_FE_RICERCA_PREPROD.zip'

			}
		]
	});
}

async function main() {
	if (fs.existsSync(dirLogs)) {
		await zipDirectory(dirLogs, '..//MW_FE_RICERCA_PREPROD.zip');
		await sendMail();
	}
	else
		console.log('Nothing to send : NO ERRORS :) ')
}

main();