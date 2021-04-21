//Created by Andrea 'Bobo' Oboe 2021
//www.andreaoboe.com

//#region DO NOT EDIT
const path = require('path');
const async = require('async');
const fs = require('fs');
const archiver = require('..//node_modules//archiver');
var rimraf = require('..//node_modules//rimraf');
const nodemailer = require('..//node_modules//nodemailer');
var FtpDeploy = require('ftp-deploy');
const moment = require('moment');
const currentDT = moment().format('YYYY-MM-DD_HH.mm.ss');
const dirLogs = '..//cypress//screenshots//';
//#endregion

const htmlExportLogMailTo = 'andrea.oboe@allianz.it, kevin.pusateri@allianz.it';

const sendFTP = async() => {

	var ftpDeploy = new FtpDeploy();

	var config = {
		user: "qa",
		password: "Febbraio2021$",
		host: "H2019LE00038J",
		port: 21,
		localRoot: __dirname + '\\' + dirLogs,
		remoteRoot: 'matrix/MW_FE_PP_' + currentDT + '/',
		include: ["*", "**/*"],      // this would upload everything except dot files
		//include: ["*.php", "dist/*", ".*"],
		// e.g. exclude sourcemaps, and ALL files in node_modules (including dot files)
		exclude: ["*.zip"],
		// delete ALL existing files at destination before uploading, if true
		deleteRemote: false,
		// Passive mode is forced (EPSV command is not sent)
		forcePasv: true,
		// use sftp or ftp
		sftp: false
	};

	await ftpDeploy
		.deploy(config)
		.then(res => console.log("FTP Upload Finished:", res))
		.catch(err => console.log(err));
}

const zipDirectory = async(source, out) => {
	const archive = archiver('zip', { zlib: { level: 9 }});
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


const sendMail = async() =>{
	let transporter = nodemailer.createTransport({
		host: 'mail.azi.allianzit',
		port: 25,
		secure: false
	});

	let mailSubject = 'Report MW FE PREPROD';

	await transporter.sendMail({
		from: '"MW FE Testing" <noreply@allianz.it>',
		to: htmlExportLogMailTo,
		subject: mailSubject,
		text: mailSubject,
		html: '<b>Report ' + mailSubject + '</b></br></br>For additional info, write to andrea.oboe@allianz.it or kevin.pusateri@allianz.it</br></br>',
		attachments: [
			{
				filename: 'MW_FE_PREPROD.zip',
				path: '..//MW_FE_PREPROD.zip'
					
			}
		]
	});
}

async function main()
{
	if(fs.existsSync(dirLogs))
	{
		fs.readdir(dirLogs,(err, files) =>{
			if(files.length)
			{
				await zipDirectory(dirLogs, '..//MW_FE_PREPROD.zip');
				await sendMail();
				await sendFTP();
			}
		})
	}
}

main();