const fs = require('fs')
const pdfparse = require('pdf-parse')

const pdffile = fs.readFileSync('sample.pdf')

pdfparse(pdffile).then(function (data){
    debugger
    console.log(data.numpages)
    console.log(data.info)
    console.log(data.text)
})