const express = require('express');
const mysql = require("mysql");
const https = require("https");
const fs = require('fs');

////////////////////////////////////// ENCRYPTION
const cryptico = require("cryptico-js");
const key = cryptico.generateRSAKey(process.env.REACT_APP_API_PRIVATE_KEY, process.env.REACT_APP_API_ENCRYPTION_LEVEL);

///////////////////////////////////// WEB3
const Web3 = require('web3');
var Tx = require('ethereumjs-tx').Transaction;
const url = process.env.REACT_APP_RPC;
const web3 = new Web3(new Web3.providers.HttpProvider(url));
const address = process.env.REACT_APP_CONTRACT_ADDRESS;
const abi = JSON.parse(process.env.REACT_APP_CONTRACT_ABI);
const account = process.env.REACT_APP_ACCOUNT;
const priv_key = Buffer.from(process.env.REACT_APP_ACCOUNT_PRIVATE_KEY, 'hex');
const contract = new web3.eth.Contract(abi, address);
//////////////////////////////////////


const con = mysql.createConnection({
	host: process.env.REACT_APP_DB_HOST, 
	user: process.env.REACT_APP_DB_USER, 
	password: process.env.REACT_APP_DB_PASSWORD, 
	database: process.env.REACT_APP_DB_DATABASE_NAME
});
con.connect();

const app = express();
app.use(express.json());

app.post('/vote', (req, res) => {
	var decrypted = cryptico.decrypt(req.body.vhash, key);
	var items = decrypted.plaintext.split('---');
	const taid = parseInt(items[0], 10);
	const cid = parseInt(items[1], 10);
	console.log(taid, cid);
	const data = contract.methods.transfer_vote(taid, cid).encodeABI();
	var vHash;
	web3.eth.getTransactionCount(account, (err, txCount) => {
		const txObject = {
			nonce: web3.utils.toHex(txCount), 
			gasLimit: web3.utils.toHex(800000), 
			gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
			to: address, 
			data: data
		}

		const tx = new Tx(txObject);
		tx.sign(priv_key);
		const serializedTx = tx.serialize();
		const raw = '0x'+serializedTx.toString('hex');

		web3.eth.sendSignedTransaction(raw, (err, txHash)=>{
			sql = "UPDATE voters SET vhash='"+txHash+"' WHERE aid='"+items[0]+"'"
			// console.log(sql);
			con.query(sql, (err, results, fields) => {
				if (err) throw err;
			})
		}).then(()=>{
			res.send({voted: true});
			// console.log(items);
		});
	});
});

app.get('/result',async (req, res) => {
	var votes = [0, 0, 0, 0];
	votes[0] = await contract.methods.get_votes(1).call();
	votes[1] = await contract.methods.get_votes(2).call();
	votes[2] = await contract.methods.get_votes(3).call();
	votes[3] = await contract.methods.get_votes(4).call();
	await res.send(votes);
});

app.post('/', (req, res) => {
	con.query(req.body.qry, (err, results, fields) => {
		if (err) throw err;
		res.send({qry_res: results});
	})
});

// app.listen(3001, () => {
// 	console.log('Started on 3001!');
// });

https.createServer({
	key: fs.readFileSync('srvr.key'), 
	cert: fs.readFileSync('srvr.cert')
}, app).listen(process.env.REACT_APP_DB_API_PORT, () => {
	console.log("Started on "+process.env.REACT_APP_DB_API_PORT+" over HTTPS only!");
})