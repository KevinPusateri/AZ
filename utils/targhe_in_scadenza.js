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

    var query = "SELECT Targa FROM NGRA2021_Casi_Assuntivi_Motor WHERE Caso_assuntivo=0"
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
        "Data_nascita=STR_TO_DATE('" + data.dataNascita + "','%d/%m/%Y')," +
        "Data_immatricolazione=STR_TO_DATE('" + data.registerDate + "','%Y-%m-%d')," +
        "Tipo_veicolo='" + data.vehicleTypeDescription + "'," +
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
                            resolve({
                                'contractorFiscalCode': contractorFiscalCode,
                                'dataNascita': dataNascita,
                                'provRes': respSivi.data.itemList[0].provRes,
                                'istatProvinceCode': respSivi.data.itemList[0].istatProvinceCode,
                                'istatMunicipalCode': respSivi.data.itemList[0].istatMunicipalCode,
                                'municipalName': respSivi.data.itemList[0].municipalName,
                                'registerDate': respSivi.data.itemList[0].registerDate,
                                'vehicleTypeDescription': respSivi.data.itemList[0].vehicleTypeDescription
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