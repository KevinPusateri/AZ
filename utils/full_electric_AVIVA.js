const mysql = require('mysql')
const axios = require('axios')
const qs = require('querystring')
const xml2js = require('xml2js')

const dbConfig = {
    "host": "PALZMSQDBPRLV01.srv.allianz",
    "port": 5551,
    "user": "MY_taut_VeeC9",
    "password": "BtG4VXvfuaj5kX3cDONqHBpyt0sLcE",
    "database": "applogs"
}

let targheToSend = []

//#region Support functions
const retriveTarghe = () => {
    const connection = mysql.createConnection(dbConfig)
    connection.connect((err) => {
        if (err) throw err;
    })

    var query = "SELECT Targa FROM NGRA2021_Casi_Assuntivi_Motor"
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

const writeData = (targa, data) => {
    const connection = mysql.createConnection(dbConfig)
    connection.connect((err) => {
        if (err) throw err;
    })

    var query = "UPDATE NGRA2021_Casi_Assuntivi_Motor SET Codice_fiscale='" + data.Codice_Fiscale + "'," +
        "Nome='" + data.Nome + "'," +
        "Cognome='" + data.Cognome + "'," +
        "Data_nascita=STR_TO_DATE('" + data.Data_Nascita + "','%d/%m/%Y')," +
        "Data_immatricolazione=STR_TO_DATE('" + data.Data_Immatricolazione + "','%Y-%m-%d')," +
        "Tipo_targa='" + data.Descrizione_Veicolo + "'," +
        "Toponimo='" + data.Toponimo.replace("'", "''") + "'," +
        "Indirizzo='" + data.Indirizzo.replace("'", "''") + "'," +
        "Comune_residenza='" + data.Comune.replace("'", "''") + "'," +
        "Compagnia_provenienza='" + data.Compagnia_Provenienza + "'," +
        "Data_scadenza=STR_TO_DATE('" + data.Data_Fine_Copertura + "','%Y-%m-%d')," +
        "Targa='" + targa.trim() + "'," +
        "Prov_targa='" + data.Provincia + "' " +
        "WHERE Targa='" + targa + "'"

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

const deleteMissedTarga = (targa) => {
    const connection = mysql.createConnection(dbConfig)
    connection.connect((err) => {
        if (err) throw err;
    })

    var query = `DELETE FROM NGRA2021_Casi_Assuntivi_Motor WHERE Targa='${targa}'`

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

const sendEmail = () => {
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
            from: '"Full Electric Mago" <noreply@allianz.it>',
            to: 'mail_tf@allianz.it,chiara.costa@allianz.it',
            subject: 'Full Electric - Compagnia 14',
            html: generateTable() + '</br></br>For additional info, write to andrea.oboe@allianz.it or kevin.pusateri@allianz.it</br></br>Thanks also to Angelo Merlo for query support</br></br>',
        };
        transporter.sendMail(email, function (err, info) {
            return err ? err.message : 'Message sent: ' + info.response;
        });
        resolve(true)
    })
}

const generateTable = () => {

    //Get headers
    const keys = Object.keys(targheToSend[0])

    //Build table header
    const header = `<thead><tr>` + keys
        .map(key => `<th style="border: 1px solid black">${key}</th>`)
        .join('') + `</thead></tr>`

    // Build the table body
    const body = `<tbody>` + targheToSend
        .map(row => `<tr>${Object.values(row)
            .map(cell => `<td style="border: 1px solid black">${cell}</td>`)
            .join('')}</tr>`
        ).join('')

    // Build the final table
    return table = `
    <table style="border: 1px solid black">
        ${header}
        ${body}
    </table>
    `
}

const retriveInfo = targa => {
    return new Promise((resolve, reject) => {
        axios({
            url: `http://online.azi.allianzit/WebdaniaFES/services/vehicle/${targa}/sita/`,
            method: 'get',
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((respSita) => {
                if (respSita.status === 200) {
                    //Recuperiamo il codice fiscale del contraente
                    let contractorFiscalCode = respSita.data.itemList[0].contractorFiscalCode

                    axios.post(`http://be2be.pp.azi.allianzit/Anagrafe/AnagrafeWS/AnagrafeSvc.asmx/Normalize`,
                        qs.stringify({
                            xmlParameters: `<Normalize><Input action='ReverseCodiceFiscale'><Fields><Field name='COD_FISC'>${contractorFiscalCode}</Field></Fields></Input></Normalize>`
                        }), {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    }).then((reverseCF) => {
                        xml2js.parseString(reverseCF.data, (err, result) => {
                            if (err)
                                throw err

                            var xmlRsponse = result.string._

                            xml2js.parseString(xmlRsponse, (err, resultOfNorm) => {
                                if (err)
                                    throw err

                                //Rimuoviamo dalla data di nascita l'orario e convertiamo nel formato yyyy-mm-dd
                                let dataNascita = JSON.stringify(resultOfNorm.Normalize.Output[0].CPersona[0].DataNascita[0]).replace('"', '').split(' ')[0]

                                axios({
                                    url: `http://online.azi.allianzit/WebdaniaFES/services/vehicle/${targa}/sivi/`,
                                    method: 'get',
                                    timeout: 30000,
                                    headers: {
                                        'Content-Type': 'application/json',
                                    }
                                }).then((respSivi) => {

                                    axios({
                                        url: `http://online.azi.allianzit/WebdaniaFES/services/vehicle/${targa}/atrc/`,
                                        method: 'get',
                                        timeout: 30000,
                                        headers: {
                                            'Content-Type': 'application/json',
                                        }
                                    }).then((respAtrc) => {

                                        axios.post(`http://be2be.pp.azi.allianzit/Anagrafe/AnagrafeWS/Services/EgonServices.asmx/AutocompleteStreet`,
                                            qs.stringify({
                                                Comune: `${respSivi.data.itemList[0].municipalName}`,
                                                Token: 'RO'
                                            }), {
                                            headers: {
                                                "Content-Type": "application/x-www-form-urlencoded"
                                            }
                                        }).then((respEgon) => {

                                            xml2js.parseString(respEgon.data, (err, result) => {
                                                if (err)
                                                    throw err

                                                var xmlRsponseEgon = result.string._

                                                xml2js.parseString(xmlRsponseEgon, (err, resultOfEgon) => {
                                                    if (err)
                                                        throw err

                                                    try {
                                                        let addresses = resultOfEgon.DataWP.DataNormalized[0].String
                                                        let randomAddress = addresses[Math.floor(Math.random() * addresses.length)]._

                                                        let toponimo = randomAddress.substring(0, randomAddress.indexOf(' '))
                                                        let indirizzo = randomAddress.substring(randomAddress.indexOf(' ') + 1)

                                                        axios({
                                                            url: `http://online.azi.allianzit/WebdaniaFES/services/vehicle/${targa}/sivi/detail/0`,
                                                            method: 'get',
                                                            timeout: 30000,
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                            }
                                                        }).then(detailedSivi => {
                                                            let currentInfos = {
                                                                'Targa': targa,
                                                                'Alimentazione': detailedSivi.data.fuelTypeDescr,
                                                                'Codice_Fiscale': contractorFiscalCode,
                                                                'Cognome': respAtrc.data.itemList[0].socialNameSurname,
                                                                'Nome': respAtrc.data.itemList[0].contractorName,
                                                                'Data_Nascita': dataNascita,
                                                                'Provincia': respSivi.data.itemList[0].provRes,
                                                                'Comune': respSivi.data.itemList[0].municipalName,
                                                                'Data_Immatricolazione': respSivi.data.itemList[0].registerDate,
                                                                'Data_Fine_Copertura': respSita.data.itemList[0].coverageEndDate,
                                                                'Descrizione_Veicolo': respSivi.data.itemList[0].vehicleTypeDescription,
                                                                'Toponimo': toponimo,
                                                                'Indirizzo': indirizzo,
                                                                'Compagnia_Provenienza': respSita.data.itemList[0].companyDescr,
                                                                'Cl_Prov': respAtrc.data.itemList[0].provenanceClass,
                                                                'Cl_Ass': respAtrc.data.itemList[0].assignmentClass,
                                                                'CU_Prov': respAtrc.data.itemList[0].provenanceClassCU,
                                                                'CU_Ass': respAtrc.data.itemList[0].assignmentClassCU
                                                            }

                                                            //Aggiungiamo all'array da mandare via mail
                                                            targheToSend.push(currentInfos)

                                                            //Aggiungiamo
                                                            resolve(currentInfos)
                                                        })

                                                    } catch (error) {
                                                        reject(`${targa}`)
                                                    }
                                                })
                                            })
                                        })
                                    })
                                        .catch(error => {
                                            reject(`${targa}`)
                                        })
                                })
                                    .catch(error => {
                                        reject(`${targa}`)
                                    })
                            })
                        })
                    })
                        .catch(error => {
                            reject(`${targa}`)
                        })
                }
            })
            .catch(error => {
                reject(`${targa}`)
            })
    })
}
//#endregion

const main = async () => {
    console.log("Recuperiamo le targhe su cui fare analisi...\n\n")
    let currentTarghe = await retriveTarghe()

    for (let i = 0; i < currentTarghe.length; i++) {
        try {
            let currentTarga = currentTarghe[i].Targa.trim()
            const currentTargaInfos = await retriveInfo(currentTarga)
            console.log(`--- Info per targa ${currentTarga} ---`)
            console.log(currentTargaInfos)
            writeData(currentTarga, currentTargaInfos)
        } catch (targaToRemove) {
            deleteMissedTarga(targaToRemove)
        }
    }

    console.log('\n\nGenerazione ed invio mail...\n\n')

    await sendEmail()

    console.log('--- DONE ---')
}

main()