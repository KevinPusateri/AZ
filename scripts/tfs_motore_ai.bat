set HTTP_PROXY=
set HTTPS_PROXY=
.\\node_modules\\.bin\\cypress run --browser E:\browsers_for_testing\GoogleChromePortable\App\Chrome-bin\chrome.exe --quiet --spec cypress/integration/motor_AI/mw_controllo_fattori.js --env currentEnv=%1 --reporter cypress-mochawesome-reporter --reporter-options "reportDir=cypress/reports/mw_controllo_fattori, inlineAssets=true, charts=true, embeddedScreenshots=true, reportPageTitle='Motore AI'"