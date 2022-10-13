@echo off
set HTTP_PROXY=
set HTTPS_PROXY=

if /I %1==TEST (
    .\\node_modules\\.bin\\cypress run --quiet --browser E:\browsers_for_testing\GoogleChromePortable\App\Chrome-bin\chrome.exe --spec cypress/e2e/backoffice/FNOL/*.js --env currentEnv=%1,isAviva=%2 --reporter cypress-mochawesome-reporter --reporter-options "reportDir=cypress/reports/FNOL, inlineAssets=true, charts=true, embeddedScreenshots=true, reportPageTitle='FNOL BMP'"
) else (
    .\\node_modules\\.bin\\cypress run --quiet --browser E:\browsers_for_testing\FirefoxPortable102\App\Firefox\firefox.exe --spec cypress/e2e/backoffice/FNOL/*.js --env currentEnv=%1,isAviva=%2 --reporter cypress-mochawesome-reporter --reporter-options "reportDir=cypress/reports/FNOL, inlineAssets=true, charts=true, embeddedScreenshots=true, reportPageTitle='FNOL BMP'"
)

REM if /I %1==TEST (
REM     .\\node_modules\\.bin\\cypress run --quiet --browser E:\browsers_for_testing\GoogleChromePortable\App\Chrome-bin\chrome.exe --spec cypress/e2e/backoffice/FNOL/%3.js --env currentEnv=%1,isAviva=%2 --reporter cypress-mochawesome-reporter --reporter-options "reportDir=cypress/reports/%3, inlineAssets=true, charts=true, embeddedScreenshots=true, reportPageTitle='Denuncia BMP - Smoke'"
REM ) else (
REM    .\\node_modules\\.bin\\cypress run --quiet --browser E:\browsers_for_testing\FirefoxPortable102\App\Firefox\firefox.exe --spec cypress/e2e/backoffice/FNOL/%3.js --env currentEnv=%1,isAviva=%2 --reporter cypress-mochawesome-reporter --reporter-options "reportDir=cypress/reports/%3, inlineAssets=true, charts=true, embeddedScreenshots=true, reportPageTitle='Denuncia BMP - Smoke'"
REM )