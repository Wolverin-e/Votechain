const express = require('express');
const mysql = require("mysql");
const https = require("https");
const fs = require('fs');
////////////////////////////////////// ENCRYPTION
const cryptico = require("cryptico-js");
const key = cryptico.generateRSAKey("6.8000112240", 2048);

///////////////////////////////////// WEB3
const Web3 = require('web3');
const url = 'http://localhost:8545';
const web3 = new Web3(new Web3.providers.HttpProvider(url));
var Tx = require('ethereumjs-tx').Transaction;
const address = "0xca7780067d937f045a13a3835f69610f84ae8734";
const abi = [{"constant":false,"inputs":[{"name":"_aid","type":"uint16"},{"name":"_to","type":"uint8"}],"name":"transfer_vote","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_aid","type":"uint16"}],"name":"has_voted","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_from","type":"uint8"}],"name":"get_votes","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"}],"name":"add_candidate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_deployer_name","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
account = "0xee3af18b95f983e1a6104803dd8562074759ae77";
// remove 0x from begginning of private key..
priv_key = Buffer.from("9f2dacdc65cd4efa74bbd601288eb65b785cbc681618dd1189355d2585d99455", 'hex');

const contract = new web3.eth.Contract(abi, address);
//////////////////////////////////////


const con = mysql.createConnection({
	host: 'localhost', 
	user: 'root', 
	password: 'mypass', 
	database: 'votechain'
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
			console.log(sql);
			con.query(sql, (err, results, fields) => {
				if (err) throw err;
			})
		}).then(()=>{
			res.send({voted: true});
			console.log(items);
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
}, app).listen(3001, () => {
	console.log("Started on 3001 over HTTPS only!");
})