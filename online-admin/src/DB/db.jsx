const fetch = require('node-fetch');

var DB = (query) => {
	return fetch(process.env.REACT_APP_ADMIN_API, {
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