@echo off
set HTTP_PROXY=
set HTTPS_PROXY=
if /I %1==TEST (
    .\\node_modules\\.bin\\cypress run --quiet --spec cypress/e2e/navigation/mw_navigation_numbers.js --env currentEnv=%1,isAviva=%2 --reporter cypress-mochawesome-reporter --reporter-options "reportDir=cypress/reports/mw_navigation_numbers, inlineAssets=true, charts=true, embeddedScreenshots=true, reportPageTitle='Navigation Numbers'"
) else (
    .\\node_modules\\.bin\\cypress run --quiet --browser E:\browsers_for_testing\FirefoxPortable102\App\Firefox\firefox.exe --spec cypress/e2e/navigation/mw_navigation_numbers.js --env currentEnv=%1,isAviva=%2 --reporter cypress-mochawesome-reporter --reporter-options "reportDir=cypress/reports/mw_navigation_numbers, inlineAssets=true, charts=true, embeddedScreenshots=true, reportPageTitle='Navigation Numbers'"
)