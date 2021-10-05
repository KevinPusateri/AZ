/**
 * @author Kevin Pusateri <kevin.pusateri@allianz.it>
 */

/// <reference types="Cypress" />
/// <reference types="cypress-downloadfile"/>
//#region Configuration
Cypress.config('defaultCommandTimeout', 60000)


describe('Download File and Assert the content', () => {
    // it('Download & Extract Text', () => {
    //     cy.downloadFile('https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg', 'mydownloads', 'example.jpg')
    //         .then(() => {
    //             cy.task("getImageText", { fileName: "./mydownloads/example.jpg", lang: "eng", logger: true })
    //                 .then(text => {
    //                     expect(text).to.contains("Are you enjoying Cypress")
    //                 })
    //         })
    // });

    // it('Download & Compare Images', () => {
    //     cy.downloadFile('https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg', 'mydownloads', 'example.jpg')
    //         .then(() => {
    //             cy.task("compareImages", { fileName1: "./mydownloads/example.jpg", fileName2: "DifferentImage.jpg" })
    //                 .then(isMatching => {
    //                     expect(isMatching).to.be.true;
    //                 })
    //         })
    // });



    // it('tests a pdf', () => {
    //     cy.task('getPdfContent', 'resocontoPulini.pdf').then(content => {
    //         console.log(content)
    //         cy.fixture('resocontoPulini.json').then((data) => {
    //             console.log(data)
    //         })
    //         cy.task('getPdfContent', 'resocontoSantucci.pdf').then(content => {
    //             cy.fixture('resocontoSantucci.json').then((data) => {
    //                 cy.readFile('cypress/fixtures/resocontoPulini.json').then(pulini => {
    //                     cy.readFile('cypress/fixtures/resocontoSantucci.json').then(santucci => {
    //                         var textPulini = pulini.formImage.Pages[0].Texts
    //                         var textSantucci = pulini.formImage.Pages[0].Texts
    //                         console.log(pulini)
    //                         // console.log(textSantucci)
    //                         // assert.include(TextPulini,TextSantucci)
    //                     })
    //                 })
    //             })
    //         })
    //     })
    // }) 


    it.only('tests a pdf', () => {
        cy.task('getPdfContentProva', 'pdf/resocontoPulini.pdf').then(pulini => {
            var testoPulini = pulini.text.replaceAll(': ','').replaceAll(':','').split('\n')
            // if (testoPulini.includes('Codice Fiscale: ')) {
                //     assert.isOk('Bravo')
                // }
                // else
                //     assert.fail('NOOO')
                cy.task('getPdfContentProva', 'pdf/resocontoSantucci.pdf').then(santucci => {
                    var testoSantucci = santucci.text.replaceAll(': ','').replaceAll(':','').split('\n')
                    console.log(testoSantucci)
                    // var testoSantucci =santucci.text
                expect(testoPulini).to.match(/Codice Fiscale/)
                expect(testoPulini).to.match(/Nascita/)
                expect(testoPulini).to.match(/Residenza/)
                expect(testoPulini).to.match(/Doc.Personale/)
                expect(testoPulini).to.match(/Professione/)
                expect(testoPulini).to.match(/Telefono fisso/)
                expect(testoPulini).to.match(/Mobile/)
            })
        })
    })
});