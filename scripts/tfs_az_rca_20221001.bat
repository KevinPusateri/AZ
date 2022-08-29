@echo off
set HTTP_PROXY=
set HTTPS_PROXY=
if /I %1==TEST (
    .\\node_modules\\.bin\\cypress run --quiet --browser E:\browsers_for_testing\GoogleChromePortable\App\Chrome-bin\chrome.exe --spec cypress/e2e/motor_RCA/AZ/mw_RCA_20221001.js --env currentEnv=%1,selectedSettori=%2 --reporter cypress-mochawesome-reporter --reporter-options "reportDir=cypress/reports/az_rca_20221001, inlineAssets=true, charts=true, embeddedScreenshots=true, reportPageTitle='AZ RCA Ottobre 2022'"
) else (
    .\\node_modules\\.bin\\cypress run --quiet --browser E:\browsers_for_testing\FirefoxPortable102\App\Firefox\firefox.exe --spec cypress/e2e/motor_RCA/AZ/mw_RCA_20221001.js --env currentEnv=%1,selectedSettori=%2 --reporter cypress-mochawesome-reporter --reporter-options "reportDir=cypress/reports/az_rca_20221001, inlineAssets=true, charts=true, embeddedScreenshots=true, reportPageTitle='AZ RCA Ottobre 2022'"
)