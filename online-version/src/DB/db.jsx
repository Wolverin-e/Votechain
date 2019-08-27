const fetch = require('node-fetch');

var DB = (query) => {
	return fetch("http://192.168.0.102:3001/", {
		method: "POST", 
		body: JSON.stringify({qry: query}), 
		headers: {
			'Accept': 'application/json', 
			'Content-Type': 'application/json'
		}
	})
	.then(dataWithPromise => dataWithPromise.json())
}

export default DB;