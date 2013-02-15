var paperboy = require('paperboy'),
	http = require('http'),
	path = require('path'),
	httpProxy = require('http-proxy'),
	proxy = new httpProxy.RoutingProxy(),
	webroot = path.join(__dirname, '/'),
	port = 1337;

http.createServer(function(req, res) {
	var ip = req.connection.remoteAddress;

	if( /rest/.test(req.url) ){
		var s = req.url.split('/');
		var code = s[2];
		var key = s[3];
		req.url = '/pub/remote_control?code='+code+'&key='+key;
		proxy.proxyRequest(req, res, {
			host: 'hd1.freebox.fr',
			port: 80
    	});
	}
	else {

		paperboy
			.deliver(webroot, req, res)
			.addHeader('X-Powered-By', 'Atari')
			.before(function() {
				console.log('Request received for ' + req.url);
			})
			.after(function(statusCode) {
				console.log(statusCode + ' - ' + req.url + ' ' + ip);
			})
			.error(function(statusCode, msg) {
				console.log([statusCode, msg, req.url, ip].join(' '));
				res.writeHead(statusCode, { 'Content-Type': 'text/plain' });
				res.end('Error [' + statusCode + ']');
			})
			.otherwise(function(err) {
				console.log([404, err, req.url, ip].join(' '));
				res.writeHead(404, { 'Content-Type': 'text/plain' });
				res.end('Error 404: File not found');
			});

	}


}).listen(port);
console.log('paperboy on his round at http://localhost:' + port);
