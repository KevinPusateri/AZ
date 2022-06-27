set HTTP_PROXY=
set HTTPS_PROXY=
.\\node_modules\\.bin\\cypress run --quiet --spec cypress/integration/navigation/mw_navigation_sales.js --env currentEnv=%1,isAviva=%2 --reporter cypress-mochawesome-reporter --reporter-options "reportDir=cypress/reports/mw_navigation_sales, inlineAssets=true, charts=true, embeddedScreenshots=true, reportPageTitle='Navigation Sales'"