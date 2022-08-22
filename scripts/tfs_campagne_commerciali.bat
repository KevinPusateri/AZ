@echo off
set HTTP_PROXY=
set HTTPS_PROXY=
if /I %1==TEST (
    .\\node_modules\\.bin\\cypress run --quiet --browser E:\browsers_for_testing\GoogleChromePortable\App\Chrome-bin\chrome.exe --spec cypress/e2e/campagne_commerciali/mw_campagne_commerciali.js --env currentEnv=%1,isAviva=false --reporter cypress-mochawesome-reporter --reporter-options "reportDir=cypress/reports/campagne_commerciali, inlineAssets=true, charts=true, embeddedScreenshots=true, reportPageTitle='Campagne Commerciali'"
) else (
    .\\node_modules\\.bin\\cypress run --quiet --browser E:\browsers_for_testing\FirefoxPortable102\App\Firefox\firefox.exe --spec cypress/e2e/campagne_commerciali/mw_campagne_commerciali.js --env currentEnv=%1,isAviva=false --reporter cypress-mochawesome-reporter --reporter-options "reportDir=cypress/reports/campagne_commerciali, inlineAssets=true, charts=true, embeddedScreenshots=true, reportPageTitle='Campagne Commerciali'"
)