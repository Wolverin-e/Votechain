const express = require('express');
const mysql = require("mysql");
const https = require("https");
const fs = require('fs');
const jwt = require('jsonwebtoken');

////////////////////////////////////// ENCRYPTION
const cryptico = require("cryptico-js");
const crypto = require("crypto-js");
const key = cryptico.generateRSAKey(process.env.SUB_TLS_RSA_PRIVATE_KEY, Number(process.env.SUB_TLS_RSA_ENCRYPTION_LEVEL));

///////////////////////////////////// WEB3
const Web3 = require('web3');
const url = process.env.RPC_URL;
const web3 = new Web3(new Web3.providers.HttpProvider(url));
const address = process.env.REACT_APP_CONTRACT_ADDRESS;
const abi = JSON.parse(process.env.CONTRACT_ABI);
const account = process.env.ETH_ACCOUNT;
// const priv_key = Buffer.from(process.env.ACCOUNT_PRIVATE_KEY.slice(2), 'hex');
const contract = new web3.eth.Contract(abi, address);
//////////////////////////////////////


const con = mysql.createConnection({
	host: process.env.DB_HOST, 
	user: process.env.DB_USER, 
	password: process.env.DB_PASSWORD, 
	database: process.env.DB_DATABASE_NAME
});
con.connect();

const app = express();
app.use(express.json());

//////////////////////////////
var allowed_methods = ['GET', 'POST'];
var level1_auth_key = process.env.REACT_APP_DB_API_ACCESS_KEY
var level1_security_exceptions = []
var level2_auth_key = process.env.DB_API_JWT_PRIVATE_KEY
var level2_security_exceptions = ['/all', '/login', '/register']
var refresh_token_key = process.env.DB_API_JWT_REFRESH_KEY
// var dict = {}
const token_expiry_time = Number(process.env.DB_API_JWT_EXPIRY_TIME)
const token_refresh_time = Number(process.env.DB_API_JWT_REFRESH_TIME)
const jwt_time_scale = process.env.DB_API_JWT_TIME_SCALE
const jwt_encryption_algorithm = process.env.DB_API_JWT_ENCRYPTION_ALG

const get_token = id => {
	return jwt.sign({
		id: id
	}, level2_auth_key, {
		algorithm: jwt_encryption_algorithm, 
		expiresIn: token_refresh_time+jwt_time_scale
	})
}

const get_refresh_token = (tkn, r_time = token_expiry_time) => {
	return jwt.sign({
		original_token: tkn
	}, refresh_token_key, {
		algorithm: jwt_encryption_algorithm, 
		expiresIn: r_time+jwt_time_scale
	})
}

app.use((req, res, next) => {
	if( allowed_methods.includes(req.method) ){
		if( level1_security_exceptions.includes(req.path) ){
			next();
		} else if(req.headers.api_key === level1_auth_key){
			if( level2_security_exceptions.includes(req.path) ){
				next();
			} else {
				if( req.headers.api_auth_key ){
					jwt.verify(req.headers.api_auth_key, level2_auth_key, (err, decrypted) => {
						if(err) {
							switch(err.name){
								case "JsonWebTokenError":
									console.log("403", req.ip);
									res.status(403).send("NOT AUTHORISED! 🤨🤨");
									break;
								case "TokenExpiredError":
									if(req.headers.api_auth_refresh_key){
										jwt.verify(req.headers.api_auth_refresh_key, refresh_token_key, (errr, decrypt) => {
											if(errr){
												switch(errr.name){
													case "JsonWebTokenError":
														console.log("403", req.ip);
														res.status(403).send("NOT AUTHORISED! 🤨🤨");
														break;
													case "TokenExpiredError":
														console.log("401 revoked", req.ip);
														res.status(401).send("AUTH REVOKED!");
														break;
													default:
														console.log("FINALSTAGE-ERR:", errr);
														res.status(451).send("LEGALLY UNAVAILABLE");
												}
											} else {
												if( decrypt.original_token === req.headers.api_auth_key ){
													jwt.verify(req.headers.api_auth_key, level2_auth_key, {ignoreExpiration: true}, (errrr, decrypt) => {
														const new_tkn = get_token(decrypt.id);
														const new_ref_tkn = get_refresh_token(new_tkn, token_expiry_time-Math.floor(((new Date())-(new Date(err.expiredAt)))/Number(process.env.DB_API_JWT_TIME_SCALE_NUMERIC)));
														// console.log(new_tkn, new_ref_tkn)
														res.set({
															"new_tkn": new_tkn, 
															"new_ref_tkn": new_ref_tkn
														});
													})
													next();
												} else {
													console.log("403", req.ip);
													res.status(403).send("NOT AUTHORISED! 🤨🤨");
												}
											}
										})
									} else {
										console.log("423", req.ip);
										res.status(423).send("THIS STUFF IS MEANT FOR BIG BOYS!! 🤨🤨");
									}
									break;
								default:
									console.log("FINALSTAGE-ERR:", err);
									res.status(451).send("LEGALLY UNAVAILABLE");
							}
						} else {
							next();
						}
					})
				} else {
					console.log("423", req.ip);
					res.status(423).send("THIS STUFF IS MEANT FOR BIG BOYS!! 🤨🤨");
				}
			}
		} else {
			console.log("401", req.ip);
			res.status(401).send("NICE TRY! 🤨🤨");
		}
	} else {
		console.log("405", req.ip);
		res.status(405).send("NICE TRY! 🤨🤨");
	}
});

////////////////////////////////

app.post('/vote', (req, res) => {
	try{
		var decrypted = cryptico.decrypt(req.body.vhash, key);
		var items = decrypted.plaintext.split('---');
		const taid = parseInt(items[0], 10);
		const cid = parseInt(items[1], 10);
		contract.methods.transfer_vote(taid, cid).send({
			from: account, 
			gasLimit: web3.utils.toHex(800000), 
			gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
		}).on('receipt', receipt => {
			// console.log(receipt);
			sql = "UPDATE voters SET vhash='"+receipt.transactionHash+"' WHERE aid='"+items[0]+"'"
			con.query(sql, (err, results, fields) => {
				if (err) {
					res.send({voted: false, err: err})
					throw err;
				} else {
					res.send({voted: true});
				}
			})
		}).catch(err => {
			res.send({voted: false, err: err})
		})
	}
	catch(err){
		res.status(401).send("GO MESS WITH SOMEONE ELSE!");
		return;
	}
});

var votes, all;
const api_call = async () => {
	all = await contract.methods.get_candidates_about().call();
	votes = all.map(x => x[2]);
	// console.log(votes);
}
api_call();

setInterval(()=>{
	api_call();
}, Number(process.env.DB_API_RESULTS_REFRESH_TIME))

app.get('/result',async (req, res) => {
	res.send(votes);
});

app.get('/all', async (req, res) => {
	res.send(all);
})


app.post('/', (req, res) => {
	con.query(req.body.qry, (err, results, fields) => {
		if (err) throw err;
		res.send({qry_res: results});
	})
});

app.post('/login', async (req, res) => {
	if(req.body.username && req.body.password ){
		const uname = await cryptico.decrypt(req.body.username, key).plaintext;
		const pass = await cryptico.decrypt(req.body.password, key).plaintext;
		if(/^[1-9][0-9]{15}$/.test(uname)){
			con.query("SELECT * FROM voters WHERE aid = "+uname, (err, results) => {
				var usr = results[0];
				if(!err && usr){
					dhash = crypto.AES.decrypt(results[0].dhash, pass).toString(crypto.enc.Utf8);
					if (usr && dhash){
						usr['tkn'] = get_token(usr.id);
						usr['rtkn'] = get_refresh_token(usr['tkn']);
						res.send({succeed: true, usr: usr});
					} else {
						res.send({succeed: false})
					}
				} else {
					res.send({succeed: false})
				}
			})
		} else {

		}
	}
})

app.post('/register', async (req, res) => {
	if(req.body.aid && req.body.name && req.body.email && req.body.number && req.body.dhash ){
		const aid = await cryptico.decrypt(req.body.aid, key).plaintext;
		const name = await cryptico.decrypt(req.body.name, key).plaintext;
		const email = await cryptico.decrypt(req.body.email, key).plaintext;
		const number = await cryptico.decrypt(req.body.number, key).plaintext;
		const dhash = await cryptico.decrypt(req.body.dhash, key).plaintext;
		if(/^[1-9][0-9]{15}$/.test(aid) && /^[A-Za-z]+ ?[A-Za-z]*$/.test(name) && /^[A-Za-z0-9]+@([A-Za-z]+.)+[A-Za-z]+$/.test(email) && /^[1-9][0-9]{9}$/.test(number)){
			con.query("SELECT aid FROM voters WHERE aid="+aid, (err, results) => {
				if(!err && !results.length){
					con.query("INSERT INTO voters (aid, name, email, number, vhash, dhash) VALUES ("+aid+", "+con.escape(name)+", "+con.escape(email)+", "+number+", '', "+con.escape(dhash)+")", (err, results) => {
						if(err){
							console.log(err);
							res.send({registered: false})
						} else {
							res.send({registered:true})
						}
					});
				} else {
					res.send({already_registered: true, registered: false});
				}
			})
		} else {
			res.status(401).send("NICE TRY!");
		}
	} else {
		res.status(406).send("NICE TRY!");
	}
})

// app.listen(3001, () => {
// 	console.log('Started on 3001!');
// });

app.use( (req, res, next) => {
	console.log("404 replacedby 406: ", req.ip)
	res.status(406).send("NOT ACCEPTABLE! 🤨🤨");
})

https.createServer({
	key: fs.readFileSync(process.env.SSL_CERT_PATH+'srvr.key'), 
	cert: fs.readFileSync(process.env.SSL_CERT_PATH+'srvr.cert')
}, app).listen(process.env.REACT_APP_DB_API_PORT, () => {
	console.log("Started on "+process.env.REACT_APP_DB_API_PORT+" over HTTPS only!");
})