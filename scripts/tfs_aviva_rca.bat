@echo off
set HTTP_PROXY=
set HTTPS_PROXY=
if /I %1==TEST (
    .\\node_modules\\.bin\\cypress run --quiet --browser E:\browsers_for_testing\GoogleChromePortable\App\Chrome-bin\chrome.exe --spec cypress/e2e/motor_RCA/AVIVA/mw_RCA_aviva.js --env currentEnv=%1 --reporter cypress-mochawesome-reporter --reporter-options "reportDir=cypress/reports/aviva_rca, inlineAssets=true, charts=true, embeddedScreenshots=true, reportPageTitle='RCA AVIVA'"
) else (
    .\\node_modules\\.bin\\cypress run --quiet --browser E:\browsers_for_testing\FirefoxPortable102\App\Firefox\firefox.exe --spec cypress/e2e/motor_RCA/AVIVA/mw_RCA_aviva.js --env currentEnv=%1 --reporter cypress-mochawesome-reporter --reporter-options "reportDir=cypress/reports/aviva_rca, inlineAssets=true, charts=true, embeddedScreenshots=true, reportPageTitle='RCA AVIVA'"