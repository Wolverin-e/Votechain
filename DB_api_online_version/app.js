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
const address = process.env.CONTRACT_ADDRESS;
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
var level2_security_exceptions = ['/all', '/login']
var refresh_token_key = process.env.DB_API_JWT_REFRESH_KEY
// var dict = {}

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
										jwt.verify(req.headers.api_auth_key, refresh_token_key, (err, decrypt) => {
											if(err){
												switch(err.name){
													case "JsonWebTokenError":
														console.log("403", req.ip);
														res.status(403).send("NOT AUTHORISED! 🤨🤨");
														break;
													case "TokenExpiredError":
														console.log("401 revoked", req.ip);
														res.status(404).send("AUTH REVOKED!");
														break;
													default:
														console.log("FINALSTAGE-ERR:", err);
														res.status(451).send("LEGALLY UNAVAILABLE");
												}
											} else {
												if( decrypt.original_token === req.headers.api_auth_key ){
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
	if(req.body.username && req.body.password){
		// console.log(req.body.username, req.body.password);
		const uname = await cryptico.decrypt(req.body.username, key).plaintext;
		const pass = await cryptico.decrypt(req.body.password, key).plaintext;
		
		con.query("SELECT * FROM voters WHERE aid = '"+uname+"'", (err, results, fields) => {
			if(!err){
				var usr = results[0];
				usr['dhash'] = crypto.AES.decrypt(results[0].dhash, pass).toString(crypto.enc.Utf8);
				usr['tkn'] = jwt.sign({
					usr: usr
				}, level2_auth_key, {
					algorithm: 'HS512', 
					expiresIn: "2m"
				})
				usr['rtkn'] = jwt.sign({
					original_token: usr['tkn']
				}, refresh_token_key, {
					algorithm: "HS512", 
					expiresIn: "30m"
				})
				if (usr && usr.dhash){
					res.send({succeed: true, usr: usr});
				} else {
					res.send({succeed: false})
				}
			} else {
				res.send({succeed: false})
			}
		})
	}
})

app.post('register', (req, res) => {

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