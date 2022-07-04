const CryptoJS = require('crypto-js')
var readline = require('readline')

const secret = unescape('\\u0054\\u0033\\u0073\\u0037\\u0046\\u0034\\u0063\\u0074\\u0030\\u0072\\u0079\\u0032\\u0030\\u0032\\u0031\\u0024'.replace(/\\/g, "%"))
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.stdoutMuted = true;

rl.question('Password: ', function (password) {
    console.log('\n\nYour encrypted psw is : ' + CryptoJS.AES.encrypt(password, secret));
    rl.close();
});

rl._writeToOutput = function _writeToOutput(stringToWrite) {
    if (rl.stdoutMuted)
        rl.output.write("*");
    else
        rl.output.write(stringToWrite);
};