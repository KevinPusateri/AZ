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

    var query = "UPDATE NGRA2021_Casi_Assuntivi_Motor SET Codice_fiscale='" + data.contractorFiscalCode + "'," +
        "Nome='" + data.contractorName + "'," +
        "Cognome='" + data.socialNameSurname + "'," +
        "Data_nascita=STR_TO_DATE('" + data.dataNascita + "','%d/%m/%Y')," +
        "Data_immatricolazione=STR_TO_DATE('" + data.registerDate + "','%Y-%m-%d')," +
        "Tipo_targa='" + data.vehicleTypeDescription + "'," +
        "Toponimo='" + data.toponimo + "'," +
        "Indirizzo='" + data.indirizzo + "'," +
        "Comune_residenza='" + data.municipalName + "'," +
        "Compagnia_provenienza='" + data.companyDescr + "'," +
        "Data_scadenza=STR_TO_DATE('" + data.coverageEndDate + "','%Y-%m-%d')," +
        "Targa='" + targa.trim() + "'," +
        "Prov_targa='" + data.provRes + "' " +
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
const retriveInfo = (targa) => {

    return new Promise((resolve, reject) => {
        axios({
            url: `http://online.azi.allianzit/WebdaniaFES/services/vehicle/${targa}/sita/`,
            method: 'get',
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((respSita) => {
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

                                            let addresses = resultOfEgon.DataWP.DataNormalized[0].String

                                            //Selezioniamo un indirizzo random (per semplicità che abbiamo solo uno spazio)
                                            let filteredAddresses = addresses.filter(function(address){
                                                return address._.split(' ').length -1 === 1
                                            })
                                            let toponimo = filteredAddresses[Math.floor(Math.random() * filteredAddresses.length)]._.split(' ')[0]
                                            let indirizzo = filteredAddresses[Math.floor(Math.random() * filteredAddresses.length)]._.split(' ')[1]

                                            resolve({
                                                'contractorFiscalCode': contractorFiscalCode,
                                                'socialNameSurname': respAtrc.data.itemList[0].socialNameSurname,
                                                'contractorName': respAtrc.data.itemList[0].contractorName,
                                                'dataNascita': dataNascita,
                                                'provRes': respSivi.data.itemList[0].provRes,
                                                'municipalName': respSivi.data.itemList[0].municipalName,
                                                'registerDate': respSivi.data.itemList[0].registerDate,
                                                'coverageEndDate': respSita.data.itemList[0].coverageEndDate,
                                                'vehicleTypeDescription': respSivi.data.itemList[0].vehicleTypeDescription,
                                                'toponimo': toponimo,
                                                'indirizzo': indirizzo,
                                                'companyDescr': respSita.data.itemList[0].companyDescr
                                            })
                                        })


                                    })
                                })

                            })
                        })
                    })
                })
            })
        })
    })
}
//#endregion

console.log("Recuperiamo le targhe su cui fare analisi...\n\n")
let currentTarghe = retriveTarghe()
currentTarghe.then(function (result) {
    for (let i = 0; i < result.length; i++) {
        let currentTarga = result[i].Targa.trim()
        retriveInfo(currentTarga).then(resp => {
            console.log(`--- Info per targa ${currentTarga} ---`)
            console.log(resp)
            writeData(currentTarga, resp)
        })
    }
})