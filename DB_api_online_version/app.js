const express = require('express');
const mysql = require("mysql");

////////////////////////////////////// ENCRYPTION
const cryptico = require("cryptico-js");
const key = cryptico.generateRSAKey("6.8000112240", 2048);

///////////////////////////////////// WEB3
const Web3 = require('web3');
const url = 'http://localhost:7545';
const web3 = new Web3(new Web3.providers.HttpProvider(url));
var Tx = require('ethereumjs-tx').Transaction;
const address = "0x69cc0f585f890658a0f98c1db84447895534fd0c";
const abi = [{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"candidates","outputs":[{"internalType":"uint256","name":"aid","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"territory","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_aid","type":"uint256"},{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_territory","type":"string"}],"name":"add_candidate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"vote_tokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_candidate_id","type":"uint256"}],"name":"get_votes","outputs":[{"internalType":"uint256","name":"votes","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"no_of_candidates","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_aid","type":"uint256"},{"internalType":"uint256","name":"_candidate_id","type":"uint256"}],"name":"transfer_vote","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
account = "0xf3e9089020137b315948b6b917160f0330f71833";
priv_key = Buffer.from("ea0775962dad90a9d6a6888ef1256b846e534887e4df81a067621b29130b854a", 'hex');

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

app.listen(3001, () => {
	console.log('Started on 3001!');
});