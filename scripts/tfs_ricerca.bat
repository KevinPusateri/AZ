set HTTP_PROXY=
set HTTPS_PROXY=
.\\node_modules\\.bin\\cypress run --quiet --spec cypress/integration/ricerca/*.js --env currentEnv=%1,isAviva=%2 --reporter cypress-mochawesome-reporter --reporter-options "reportDir=cypress/reports/ricerca, inlineAssets=true, charts=true, embeddedScreenshots=true, reportPageTitle='Ricerca'"