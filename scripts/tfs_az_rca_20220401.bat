set HTTP_PROXY=
set HTTPS_PROXY=
.\\node_modules\\.bin\\cypress run --browser E:\browsers_for_testing\GoogleChromePortable\App\Chrome-bin\chrome.exe --quiet --spec cypress/integration/motor_RCA/AZ/mw_RCA_20220401.js --reporter cypress-mochawesome-reporter --reporter-options "reportDir=cypress/reports/az_rca_20220401, inlineAssets=true, charts=true, reportPageTitle='AZ RCA Aprile 2022'"