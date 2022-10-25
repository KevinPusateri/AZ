/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
const faker = require('faker')
const os = require('os')
const mysql = require('mysql')
const moment = require('moment')
const fs = require('fs')
const path = require('path')
const rimraf = require('../../node_modules/rimraf')
const unzipper = require('unzipper')
const xlsx = require('node-xlsx').default
const util = require('util')
const { exec } = require('child_process')
const execProm = util.promisify(exec)
var downloadFolder
var extensionsFolder

//#region Support Functions
const getMostRecentFile = (dir) => {
    const files = orderReccentFiles(dir);
    return files.length ? files[0] : undefined;
};

const orderReccentFiles = (dir) => {
    return fs.readdirSync(dir)
        .filter((file) => fs.lstatSync(path.join(dir, file)).isFile())
        .map((file) => ({ file, mtime: fs.lstatSync(path.join(dir, file)).mtime }))
        .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
};

const sendEmail = (currentSubject, currentMessage, additionalEmail = null) => {
    return new Promise((resolve, reject) => {
        const nodemailer = require('nodemailer')

        let transporter = nodemailer.createTransport({
            host: 'techuser.mail.allianz',
            port: 25,
            secure: false,
            tls: {
                rejectUnauthorized: false
            }
        })

        const email = {
            from: '"Test Automatici MW" <noreply@allianz.it>',
            to: (additionalEmail === null) ? 'test.factory.test@allianz.it' : 'test.factory.test@allianz.it,' + additionalEmail,
            subject: currentSubject,
            html: currentMessage + '</br></br>For additional info, write to andrea.oboe@allianz.it or kevin.pusateri@allianz.it</br></br>',
        };
        transporter.sendMail(email, function (err, info) {
            return err ? err.message : 'Message sent: ' + info.response;
        });
        resolve(true)
    })
}

async function runShellCmd(cmd) {
    let result
    try {
        result = await execProm(cmd)
    } catch (error) {
        result = error
    }

    return result.stdout
}
//#endregion

//#region Mysql
function mysqlStart(dbConfig, testCaseName, currentEnv, currentUser) {

    const connection = mysql.createConnection(dbConfig)
    connection.connect((err) => {
        if (err) throw err;
    })

    let currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    let machineName = os.hostname();
    var query = "INSERT INTO TC_Log (TestCaseName, Ambiente, Utenza, DataInizio, DataFine, MachineName, ResultOutcome) " +
        "VALUES ('Matrix.Tests." + testCaseName + "','" + currentEnv + "','" + currentUser + "','" + currentDateTime + "','" + currentDateTime + "','" + machineName + "','Unfinished')";

    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
            if (error) {
                console.error(error)
                reject(error)
            } else {
                connection.end()
                return resolve(results)
            }
        })
    })
}

function mysqlFinish(dbConfig, rowId, tests) {
    const connection = mysql.createConnection(dbConfig)
    connection.connect((err) => {
        if (err) throw err;
    })

    //Verify if all tests are passed or not
    let resultOutCome = 'Passed'
    let resultMessage = 'All Tests are OK!'
    let resultStack = ''
    for (let i = 0; i < tests.test.length; i++) {
        if (tests.test[i].resultOutCome !== 'Passed') {
            resultOutCome = tests.test[i].resultOutCome
            //Also get the error message
            resultMessage = tests.test[i].resultMessage.length > 1000 ? tests.test[i].resultMessage.substring(0, 999) : tests.test[i].resultMessage
            resultStack = tests.test[i].resultStack.length > 5000 ? tests.test[i].resultStack.substring(0, 4999) : tests.test[i].resultStack
        }
    }

    let currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss')

    var query = "UPDATE TC_Log SET NTC=" + tests.ntc + "," +
        "DataFine='" + currentDateTime + "'," +
        "ResultOutcome='" + resultOutCome + "'," +
        "ResultMessage='" + resultMessage + "'," +
        "ResultStack='" + resultStack + "' " +
        "WHERE Id=" + rowId

    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
            if (error) {
                console.error(error)
                reject(error)
            } else {
                connection.end()
                return resolve(results)
            }
        })
    })
}

function retriveTarghe(dbConfig) {
    const connection = mysql.createConnection(dbConfig)
    connection.connect((err) => {
        if (err) throw err;
    })

    var query = "SELECT * FROM NGRA2021_Casi_Assuntivi_Motor"
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
            if (error) {
                console.error(error)
                reject(error)
            } else {
                connection.end()
                return resolve(results)
            }
        })
    })
}

//aggiunto da Elio Cossu 17/10/2022
function mysqlSalvaPolizza(dbConfig, cliente, nPolizza, dataEmissione, dataScadenza, ramo, ambiti, ambiente) {
    const connection = mysql.createConnection(dbConfig)

    connection.connect((err) => {
        if (err) throw err;
    })

    var query = `INSERT INTO polizza (numero, cliente, dataEmissione, dataScadenza, ramo, prodotto, ambiente) VALUES('${nPolizza}','${cliente}','${dataEmissione}','${dataScadenza}','${ramo}','${ambiti}','${ambiente}')`

    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
            if (error) {
                console.error(error)
                reject(error)
            } else {
                connection.end()
                return resolve(results)
            }
        })
    })
}

function mysqlFindLastPolizza(dbConfig, prodotto, annullamento = false) {
    const connection = mysql.createConnection(dbConfig)
    connection.connect((err) => {
        if (err) throw err;
    })

    let strAnnullamento = "0"

    if (annullamento == true) {
        strAnnullamento = "1"
    }

    var query = "SELECT * FROM da.polizza WHERE prodotto='"+ prodotto +"' and annullamento='" + strAnnullamento + "' ORDER BY dataEmissione DESC LIMIT 1"

    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
            if (error) {
                console.error(error)
                reject(error)
            } else {
                connection.end()
                return resolve(results)
            }
        })
    })
}

function mysqlRegistraAnnullamento(dbConfig, id, numeroPolizza, prodotto) {
    const connection = mysql.createConnection(dbConfig)
    connection.connect((err) => {
        if (err) throw err;
    })

    var query = "UPDATE da.polizza SET annullamento='1' WHERE id='"+ id +"' and numero ='"+ numeroPolizza +"' and prodotto='"+ prodotto +"'"

    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
            if (error) {
                console.error(error)
                reject(error)
            } else {
                connection.end()
                return resolve(results)
            }
        })
    })
}
//#endregion

//Retrive logged win user
function userWinLogged() {
    return os.userInfo()
}

//#region Generazione Partita Iva Random
function reverse(n) {
    let revNum = 0,
        lastDigit = 0;
    while (n !== 0) {
        lastDigit = n % 10;
        n = parseInt(n / 10);
        revNum = revNum * 10 + lastDigit;
        if (revNum < Math.pow(-2, 31) || revNum > Math.pow(2, 31) - 1) return 0
    }
    //console.log("Reversed : " + revNum)
    return revNum
}

function getSumEven(n) {
    var nReversed = reverse(n);

    var sumEven = 0,
        c = 1;
    while (nReversed !== 0) {
        // If c is even number then it means 
        // digit extracted is at even place 
        if (c % 2 === 0)
            sumEven = Math.floor(sumEven + nReversed % 10);
        nReversed = Math.floor(nReversed / 10);
        c++;
    }

    //console.log("Get Sum Even Positioned: " + Math.floor(sumEven));
    return sumEven;
}

function getSumOddRaddoppiati(n) {
    var nReversed = reverse(n);

    var sumOddRaddoppiati = 0,
        c = 1;
    while (nReversed !== 0) {
        // If c is even number then it means 
        // digit extracted is at even place 
        if (c % 2 != 0) {
            var currentEvenPosition = Math.floor(nReversed % 10);
            currentEvenPosition = currentEvenPosition * 2;
            if (currentEvenPosition >= 10)
                currentEvenPosition = currentEvenPosition - 9;

            sumOddRaddoppiati = sumOddRaddoppiati + currentEvenPosition;
        }
        nReversed = Math.floor(nReversed / 10);
        c++;
    }

    //console.log("Get Sum Odd Raddoppiati: " + Math.floor(sumOddRaddoppiati));
    return sumOddRaddoppiati;
}

function generateRandomVatIn() {
    var vatIN;
    do {
        //Generiamo la partiva iva come da https://it.wikipedia.org/wiki/Partita_IVA
        //le prime sette cifre rappresentano il numero di matricola del soggetto assegnato dal relativo ufficio
        //provinciale, che si ottiene incrementando di una unità il numero assegnato al soggetto che lo precede;
        //Mettendo poi lo 0 in testa al numero lo considero come la 7 cifra
        var codiceUfficioProv = "032";
        let min = Math.ceil(111111);
        let max = Math.floor(999999);
        var firstSixPIConCodiceUfficio = Math.abs((Math.floor(Math.random() * (min - max + 1)) + min)).toString();

        firstSixPIConCodiceUfficio = firstSixPIConCodiceUfficio.concat(codiceUfficioProv);
        var firstSixConCodiceUfficioPIValue = parseInt(firstSixPIConCodiceUfficio);

        //console.log("First Six Con Codice Ufficio PI : " + firstSixConCodiceUfficioPIValue);

        //l'undicesima cifra, infine, rappresenta un codice di controllo
        //la somma delle cifre in posizione dispari non considerando l'ultima cifra (che è di controllo)
        //non avendo lo zero davanti al momento, inverto e faccio la somma di quelle pari
        var x = getSumEven(firstSixConCodiceUfficioPIValue);

        //la somma dei doppi delle cifre in posizione pari; se il doppio è maggiore di 10 sottraggo 9
        //non avendo lo zero davanti al momento, inverto e faccio la somma di quelli dispari raddoppiati
        var y = getSumOddRaddoppiati(firstSixConCodiceUfficioPIValue);

        var t = (x + y) % 10;
        var cifraDiControllo = (10 - t) % 10;

        var vatIN = ("0".concat(firstSixPIConCodiceUfficio)).concat(cifraDiControllo.toString());
    } while (vatIN.length < 11);

    return vatIN;
}

//#endregion

module.exports = (on, config) => {
    if (config.env.currentEnv === 'PREPROD')
        config.baseUrl = 'https://portaleagenzie.pp.azi.allianz.it/matrix/';
    else
        config.baseUrl = 'https://amlogin-dev.servizi.allianzit/nidp/idff/sso?id=datest&sid=1&option=credential&sid=1&target=https%3A%2F%2Fportaleagenzie.te.azi.allianzit%2Fmatrix%2F/';

    runShellCmd('echo %cd%\\cypress\\downloads').then(retrivedDownloadFolder => {
        downloadFolder = String(JSON.stringify(retrivedDownloadFolder.replace(/[\r\n]/g, "").replace('/\\/g', '\\\\'))).replace(/"/g, '')
    })

    runShellCmd('echo %cd%\\extensions').then(retrivedExtensionsFolder => {
        extensionsFolder = String(JSON.stringify(retrivedExtensionsFolder.replace(/[\r\n]/g, "").replace('/\\/g', '\\\\'))).replace(/"/g, '')
    })

    on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.family === 'firefox') {
            launchOptions.preferences['browser.download.dir'] = downloadFolder
            launchOptions.preferences['browser.download.folderList'] = 2
            launchOptions.preferences['browser.download.panel.shown'] = false
            launchOptions.preferences['browser.download.manager.focusWhenStarting'] = true
            launchOptions.preferences['browser.helperApps.neverAsk.saveToDisk'] = 'application/force-download,application/pdf,application/x-download,application/x-pdf,pdf/adobe,ext/xml,text/plain,text/html,application/octet-stream,application/xls,text/csv,application/X_SI,application/xls,application/ms-excel,application/x-msexcel,application/excel,application/x-excel,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            launchOptions.preferences['browser.download.manager.useWindow'] = true
            launchOptions.preferences['pdfjs.disabled'] = true
            launchOptions.preferences['devtools.console.stdout.content'] = false

            // For Firefox 102
            launchOptions.args.push('-safe-mode')

            //Necessario per queli applicativi (tipo LM) che utilizzano ancora applet java
            //Vado a prendere Allianz IO Web Ext
            launchOptions.extensions.push(extensionsFolder + "\\allianziowebext@allianz.it.xpi")
            return launchOptions

        } else if (browser.family === "chromium" && browser.name !== "electron") {
            launchOptions.preferences['download.default_directory'] = process.cwd() + "\\cypress\\downloads"
            launchOptions.preferences['download.prompt_for_download'] = false

            return launchOptions
        }
    })

    require('cypress-mochawesome-reporter/plugin')(on)

    on("task", {
        nuovoClientePersonaFisica() {
            user = {
                nome: faker.name.firstName(),
                cognome: faker.name.lastName()
            };
            //console.info("--> Generate Persona Fisica for test : " + JSON.stringify(user));

            return user;
        }
    });

    on("task", {
        nuovoClientePersonaGiuridica() {
            user = {
                ragioneSociale: faker.company.companyName(),
                partitaIva: generateRandomVatIn(),
                email: faker.internet.email()
            };
            return user;
        }
    });

    on("task", {
        startMysql({ dbConfig, testCaseName, currentEnv, currentUser }) {
            return mysqlStart(dbConfig, testCaseName, currentEnv, currentUser)
        }
    });

    on("task", {
        finishMysql({ dbConfig, rowId, tests }) {
            return mysqlFinish(dbConfig, rowId, tests)
        }
    });

    on("task", {
        getTargheInScadenzaAltraCompagnia({ dbConfig }) {
            return retriveTarghe(dbConfig)
        }
    });

    //aggiunto da Elio Cossu 17/10/2022
    on("task", {
        SalvaPolizza({ dbConfig, cliente, nPolizza, dataEmissione, dataScadenza, ramo, ambiti, ambiente }) {
            return mysqlSalvaPolizza(dbConfig, cliente, nPolizza, dataEmissione, dataScadenza, ramo, ambiti, ambiente)
        }
    });

    //mysqlFindLastPolizza
    on("task", {
        findLastPolizza({ dbConfig, prodotto, annullamento }) {
            return mysqlFindLastPolizza(dbConfig, prodotto, annullamento)
        }
    });

    on("task", {
        registraAnnullamento({ dbConfig, id, numeroPolizza, prodotto }) {
            return mysqlRegistraAnnullamento(dbConfig, id, numeroPolizza, prodotto)
        }
    });
    
    //devono essere valorizzati
    on("task", {
        cliente() {
            user = {
                Nome: "Piero",
                Cognome: "Verde",
                CodiceFiscale: "VRDPRI52A01L483M",
                Indirizzo_Residenza: "VIA ROMA 4",
                Comune_Residenza: "UDINE",
                Provincia_Residenza: "UD"
            };
            return user;
        }
    });


    on("task", {
        nuovoContatto() {
            contatto = {
                phone: faker.phone.phoneNumberFormat().replace(/-/g, ''),
                email: faker.internet.email().toLowerCase(),
                url: faker.internet.url()
            };
            //console.info("--> Generate Contatto for test : " + JSON.stringify(contatto));

            return contatto;
        }
    })

    on("task", {
        getHostName() {
            return new Promise((resolve) => {
                return resolve(os.hostname().toUpperCase())
            })
        }
    })

    on("task", {
        getWinUserLogged() {
            return userWinLogged()
        }
    });

    on("task", {
        getUserWinLogin() {
            return cy.getUserWinLogin()
        }
    })

    on("task", {
        getUsername() {
            return os.userInfo().username
        }
    })

    on("task", {
        getLatestDownloadedFile(broswerType) {
            let mostRecentFile = getMostRecentFile(downloadFolder)
            return path.join(downloadFolder, mostRecentFile.file)
        }
    })

    on("task", {
        unzipLatestLogTariffa({ filePath, currentCase, specName }) {
            const screenshotFolderCurrentCase = process.cwd() + "\\cypress\\screenshots\\" + specName + "\\" + currentCase.Identificativo_Caso.padStart(2, '0') + '_' + currentCase.Descrizione_Settore + "\\logs\\"
            fs.createReadStream(filePath)
                .pipe(unzipper.Extract({ path: screenshotFolderCurrentCase }))
            return screenshotFolderCurrentCase
        }
    })

    on("task", {
        moveToLogFolder({ filePath, currentCase, specName }) {
            const screenshotFolderCurrentCase = process.cwd() + "\\cypress\\screenshots\\" + specName + "\\" + currentCase.Identificativo_Caso.padStart(2, '0') + '_' + currentCase.Descrizione_Settore

            if (!fs.existsSync(screenshotFolderCurrentCase)) {
                fs.mkdirSync(screenshotFolderCurrentCase, { recursive: true });
            }
            fs.rename(filePath, screenshotFolderCurrentCase + "\\LogProxy.xml", function (err) {
            })

            return screenshotFolderCurrentCase
        }
    })

    on("task", {
        cleanScreenshotLog(specName) {
            let folderToDelete = process.cwd() + "\\cypress\\screenshots\\*"
            rimraf.sync(folderToDelete)

            //Also clean downloads folder
            rimraf.sync(process.cwd() + "\\cypress\\downloads\\*")
            return folderToDelete
        }
    })

    on("task", {
        getFolderDownload() {
            return downloadFolder
        }
    })

    on("task", {
        sendMail({ currentSubject, currentMessage, additionalEmail }) {
            return sendEmail(currentSubject, currentMessage, additionalEmail)
        }
    })


    on("task", {
        parseXlsx({ filePath }) {
            return new Promise((resolve, reject) => {
                try {
                    const jsonData = xlsx.parse(fs.readFileSync(filePath))
                    resolve(jsonData);
                } catch (e) {
                    reject(e)
                }
            })
        }
    })

    on('task', {
        log(message) {
            console.log(`    - ${message}`)
            return null
        },

        warn(message) {
            console.log("\x1b[33m%s\x1b[0m", `     - ${message}`);
            return null
        },

        warnTFS(message) {
            console.log(`      - ${message}`);
            return null
        }
    })

    return config;
};