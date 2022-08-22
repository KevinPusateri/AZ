@echo off
set HTTP_PROXY=
set HTTPS_PROXY=
if /I %1==TEST (
    .\\node_modules\\.bin\\cypress run --quiet --spec cypress/e2e/motor_AI/mw_controllo_fattori.js --env currentEnv=%1,isAviva=%2 --reporter cypress-mochawesome-reporter --reporter-options "reportDir=cypress/reports/mw_controllo_fattori, inlineAssets=true, charts=true, embeddedScreenshots=true, reportPageTitle='Motore AI'"
) else (
    .\\node_modules\\.bin\\cypress run --quiet --browser E:\browsers_for_testing\FirefoxPortable102\App\Firefox\firefox.exe --spec cypress/e2e/motor_AI/mw_controllo_fattori.js --env currentEnv=%1 --reporter cypress-mochawesome-reporter --reporter-options "reportDir=cypress/reports/mw_controllo_fattori, inlineAssets=true, charts=true, embeddedScreenshots=true, reportPageTitle='Motore AI'"
)