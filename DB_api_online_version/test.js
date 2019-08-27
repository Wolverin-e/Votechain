const Web3 = require('web3');
const url = 'http://localhost:7545';
const web3 = new Web3(new Web3.providers.HttpProvider(url));
var Tx = require('ethereumjs-tx').Transaction;
const address = "0xd590ca7c6b84ec4b4221429dd3b980cb843d3295";
const abi = [{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"candidates","outputs":[{"name":"aid","type":"uint256"},{"name":"name","type":"string"},{"name":"territory","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_aid","type":"uint256"},{"name":"_name","type":"string"},{"name":"_territory","type":"string"}],"name":"add_candidate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"vote_tokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"no_of_candidates","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_aid","type":"uint256"},{"name":"_candidate_id","type":"uint256"}],"name":"transfer_vote","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_name","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
account = "0xf3e9089020137b315948b6b917160f0330f71833";
priv_key = Buffer.from("ea0775962dad90a9d6a6888ef1256b846e534887e4df81a067621b29130b854a", 'hex');

const contract = new web3.eth.Contract(abi, address);
web3.eth.getAccounts(console.log);
// const data = contract.methods.transfer_vote(1234567890012345, 1).encodeABI();
// web3.eth.getTransactionCount(account, (err, txCount) => {
// 	console.log(web3.utils.toHex(txCount));
// 	const txObject = {
// 		nonce: web3.utils.toHex(txCount), 
// 		gasLimit: web3.utils.toHex(800000), 
// 		gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
// 		to: address, 
// 		data: data
// 	}
// 	const tx = new Tx(txObject);
// 	tx.sign(priv_key);
// 	const serializedTx = tx.serialize();
// 	const raw = '0x'+serializedTx.toString('hex');
// 	web3.eth.sendSignedTransaction(raw, (err, txHash)=>{
// 		console.log("err:", err, "Hash:", txHash);
// 		vhash = txHash;
// 	});
// });