const cryptico = require('cryptico-js');
const server_public_key = 'ZY5IElQwWQDV1EUwgtNoxiquknNKO9VskMPMY0xwWsdfsD4OblOjLZfKJEcISgpYVnF5t+A2OteNBY3qNYa2PWpkXPQwAwGnCqDcPYqNCYzgmjUNIe9xSsU4ra25EcvIpvKadALUP7ezGc3rK0p2GEbXJhHYij+7jWBEEKuy9hlNyXI0L+DkSIm7p4eac0XaIii8JQjfoNR0JZbBkAQQgRD1yyAICOPylkLGJExvVnovyBUh1Cb6LAc3SMrTx+mK14oGUrGBp6kABRTQgbV/YeRso+VNKS97oYecNQgQkwemAXXMkJoaejo9cyN0mTZNacxHR3OmVYQlDacrCbnYMw=='
//6.8000112240--2048
//key = cryptico.generateRSAKey(pass, Bits);
//cryptico.decrypt(cipher-text, key);

var Hasher = str => {
	return cryptico.encrypt(str, server_public_key);
}

export default Hasher;