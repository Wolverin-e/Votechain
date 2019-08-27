const fetch = require('node-fetch');

let data = {name: "Mitul Patel"};

fetch("http://192.168.0.102:3000/DB/", {
	method: "POST", 
	body: JSON.stringify(data), 
	headers: {
		'Accept': 'application/json', 
		'Content-Type': 'application/json'
	}
}).then(res => {
	console.log("PostED!", res);
});