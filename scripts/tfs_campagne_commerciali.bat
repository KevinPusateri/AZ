set HTTP_PROXY=
set HTTPS_PROXY=
.\\node_modules\\.bin\\cypress run --quiet --spec cypress/integration/campagne_commerciali/*.js --env currentEnv=%1,isAviva=false --reporter cypress-mochawesome-reporter --reporter-options "reportDir=cypress/reports/campagne_commerciali, inlineAssets=true, charts=true, embeddedScreenshots=true, reportPageTitle='Campagne Commerciali'"