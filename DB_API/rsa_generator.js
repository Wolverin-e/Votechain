// node rsa_generator pass-phrase level

const args = process.argv.slice(2);
const cryptico = require("cryptico-js");
const key = cryptico.generateRSAKey(args[0], args[1]);

console.log(cryptico.publicKeyString(key));