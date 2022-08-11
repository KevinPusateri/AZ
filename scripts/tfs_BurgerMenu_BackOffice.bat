@echo off
set HTTP_PROXY=
set HTTPS_PROXY=
if /I %1==TEST (
    .\\node_modules\\.bin\\cypress run --spec cypress/e2e/navigationBurger/mw_navigation_burgerMenuBackOffice.js --env currentEnv=%1,isAviva=%2 --reporter cypress-mochawesome-reporter --reporter-options "reportDir=cypress/reports/burgerMenuBackOffice, inlineAssets=true, charts=true, embeddedScreenshots=true, reportPageTitle='Matrix Web Burger Menu BackOffice'"
) else (
    .\\node_modules\\.bin\\cypress run --browser E:\browsers_for_testing\FirefoxPortable102\App\Firefox\firefox.exe --spec cypress/e2e/navigationBurger/mw_navigation_burgerMenuBackOffice.js --env currentEnv=%1,isAviva=%2 --reporter cypress-mochawesome-reporter --reporter-options "reportDir=cypress/reports/burgerMenuBackOffice, inlineAssets=true, charts=true, embeddedScreenshots=true, reportPageTitle='Matrix Web Burger Menu BackOffice'"
)