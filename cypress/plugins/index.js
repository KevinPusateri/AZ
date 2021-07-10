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

//#region Mysql
function mysqlStart(testCaseName, currentEnv, currentUser, config) {

    const connection = mysql.createConnection(config.env.db)
    connection.connect((err) => {
        if (err) throw err;
        console.log('%c --> Connected to ' + config.env.db.host, 'color: green; font-weight: bold;');
    })

    let currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    let machineName = os.hostname();
    var query = "INSERT INTO TC_Log (TestCaseName, Ambiente, Utenza, DataInizio, DataFine, MachineName, ResultOutcome) " +
        "VALUES ('" + testCaseName + "','" + currentEnv + "','" + currentUser + "','" + currentDateTime + "','" + currentDateTime + "','" + machineName + "','Unfinished')";

    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
            if (error) {
                console.error(error)
                reject(error)
            }
            else {
                connection.end()
                return resolve(results)
            }
        })
    })
}
//#endregion

//#region Generazione Partita Iva Random
function reverse(n) {
    let revNum = 0, lastDigit = 0;
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

    var sumEven = 0, c = 1;
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

    var sumOddRaddoppiati = 0, c = 1;
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
    on("task", {
        nuovoClientePersonaFisica() {
            user = {
                nome: faker.name.firstName(),
                cognome: faker.name.lastName()
            };
            console.info("--> Generate Persona Fisica for test : " + JSON.stringify(user));

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

    on('task', {
        mysqlStart({ testCaseName, currentEnv, currentUser }) {
            return mysqlStart(testCaseName, currentEnv, currentUser, config);
        },
    })
    on("task", {
        mysqlStart({ testCaseName, ambiente, utenza }) {
            con.connect((err) => {
                if (err) throw err;
                console.info("--> Connected to PALZMSQDBPRLV01.srv.allianz for Mysql Report Testing...");

                con.query(sql, function (err, result) {
                    if (err)
                        throw err;
                    else
                        return result.insertId;
                });
            });
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
                phone: faker.phone.phoneNumberFormat().replace(/-/g,''),
                email: faker.internet.email().toLowerCase(),
                url: faker.internet.url()
            };
            console.info("--> Generate Contatto for test : " + JSON.stringify(contatto));

            return contatto;
        }
    })
};