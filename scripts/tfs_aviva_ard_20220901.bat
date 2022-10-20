@echo off
set HTTP_PROXY=
set HTTPS_PROXY=
if /I %1==TEST (
    .\\node_modules\\.bin\\cypress run --quiet --browser E:\browsers_for_testing\GoogleChromePortable\App\Chrome-bin\chrome.exe --spec cypress/e2e/motor_ARD/mw_ARD_20220901_aviva.js --env currentEnv=%1 --reporter cypress-mochawesome-reporter --reporter-options "reportDir=cypress/reports/mw_ARD_20220901_aviva, inlineAssets=true, charts=true, embeddedScreenshots=true, reportPageTitle='AVIVA ARD Settembre 2022'"
) else (
    .\\node_modules\\.bin\\cypress run --quiet --browser E:\browsers_for_testing\FirefoxPortable102\App\Firefox\firefox.exe --spec cypress/e2e/motor_ARD/mw_ARD_20220901_aviva.js --env currentEnv=%1 --reporter cypress-mochawesome-reporter --reporter-options "reportDir=cypress/reports/mw_ARD_20220901_aviva, inlineAssets=true, charts=true, embeddedScreenshots=true, reportPageTitle='AVIVA ARD Settembre 2022'"
)