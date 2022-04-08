const XLSX = require('xlsx')
const fs = require('fs')
const path = require('path')

//path files
let xlsxFilePath = '../docs/aviva/AVIVA_Flex_CVT_14-1960.xlsx'
let exportFilePath = '../docs/aviva/AVIVA_Flex_CVT_14-1960.json'

let workbook = XLSX.readFile(xlsxFilePath)
let sheet = workbook.Sheets[workbook.SheetNames[0]]

let json = JSON.stringify(XLSX.utils.sheet_to_json(sheet))

fs.writeFile(exportFilePath, json, 'utf8', (err) => {
    if (err)
        return console.log(err)
    console.log(`Conversione file ${path.resolve(xlsxFilePath)} completata!`)
    console.log(`File salato in ${path.resolve(exportFilePath)}`)
})