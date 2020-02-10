const express = require('express');
const mysql = require("mysql");
const https = require("https");
const fs = require('fs');

////////////////////////////////////// ENCRYPTION
const cryptico = require("cryptico-js");
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


const con = mysql.createPool({
	host: process.env.DB_HOST, 
	user: process.env.DB_USER, 
	password: process.env.DB_PASSWORD, 
	database: process.env.DB_DATABASE_NAME
});
// con.connect();

const app = express();

//////////////////////////////  CORS HEADERS
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', '*');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});
//////////////////////////////

app.use(express.json());

app.post('/add', (req, res) => {
	var decrypted_name = cryptico.decrypt(req.body.add, key).plaintext;
	var decrypted_about = cryptico.decrypt(req.body.about, key).plaintext;
	contract.methods.add_candidate(decrypted_name, decrypted_about).send({ 
		from: account, 
		gasLimit: web3.utils.toHex(800000), 
		gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
	}).on('confirmation', (confirmation_number, receipt) => {
		if(confirmation_number < 2){
			console.log("ADDED CANDIDATE: "+decrypted_name);
			res.send({added: true});
		}
	}).on('err', err => {
		res.send({added: false});
	})
});

app.post('/getReceipt', async (req, res) => {
	var transaction_hash = await cryptico.decrypt(req.body.txHash, key).plaintext;
	// console.log("txh", transaction_hash);
	web3.eth.getTransaction(transaction_hash).then(tx => {
		res.send({status:true, receipt: tx});
	}).catch(err => {
		res.send({status: false})
	})
})

app.post('/deploy', (req, res) => {
	const _deployer = cryptico.decrypt(req.body.deployer, key).plaintext;
	const data = process.env.CONTRACT_DATA;

	votechainContract = new web3.eth.Contract(abi, {
		from: account, 
		gas: 4700000, 
		gasPrice: web3.utils.toHex(web3.utils.toWei('20', 'gwei'))
	})

	votechainContract.deploy({
		data: data, 
		arguments: [_deployer]
	}).send().on('receipt', receipt => {
		console.log("NEW CONTRACT: "+receipt.contractAddress+"\n"+receipt.transactionHash);
		res.send({contract_address: receipt.contractAddress});
	})
});

app.get('/result',async (req, res) => {
	var votes = await contract.methods.get_all_votes().call();
	res.send(votes);
});

app.get('/candidates', async (req, res) => {
	var candidates = await contract.methods.get_candidates().call();
	res.send(candidates);
})

app.get('/all', async (req, res) => {
	var candidates = await contract.methods.get_candidates_about().call();
	res.send(candidates);
})

app.post('/', (req, res) => {
	con.query(req.body.qry, (err, results, fields) => {
		if (err) throw err;
		res.send({qry_res: results});
	})
});

app.listen(process.env.REACT_APP_ADMIN_API_PORT, () => {
	console.log("Started on "+process.env.REACT_APP_ADMIN_API_PORT+" over HTTP only!");
});

// https.createServer({
// 	key: fs.readFileSync(process.env.SSL_CERT_PATH+'privkey.pem'), 
// 	cert: fs.readFileSync(process.env.SSL_CERT_PATH+'fullchain.pem')
// }, app).listen(process.env.REACT_APP_ADMIN_API_PORT, () => {
// 	console.log("Started on "+process.env.REACT_APP_ADMIN_API_PORT+" over HTTPS only!");
// })
