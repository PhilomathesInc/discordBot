const http = require('http');
const server = http.createServer((req, res) => {
	res.writeHead(200);
	res.end('ok');
});

const keepAlive = () => {
	server.listen((3000), () => {
		console.log('Server is listening on port 3000');
	});
};

module.exports = keepAlive;
