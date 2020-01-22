const cryptico = require('cryptico-js');
const server_public_key = process.env.REACT_APP_DB_API_SUB_TLS_RSA_PUBLIC_KEY;
//6.8000112240--2048
//key = cryptico.generateRSAKey(pass, Bits);
//cryptico.decrypt(cipher-text, key);

var Hasher = str => {
	return cryptico.encrypt(str, server_public_key);
}

export default Hasher;