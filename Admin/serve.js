const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');
const app = express();

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(express.static(path.join(__dirname, 'build')));
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
// app.listen(9000);

https.createServer({
	key: fs.readFileSync(process.env.SSL_CERT_PATH+'srvr.key'), 
	cert: fs.readFileSync(process.env.SSL_CERT_PATH+'srvr.cert')
}, app).listen(Number(process.env.REACT_APP_ADMIN_PORT), () => {
	console.log("Started on "+process.env.REACT_APP_ADMIN_PORT+" over HTTPS only!");
})