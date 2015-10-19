var express = require('express');

var app = express();

app.get('/', function (req, res) {
    // TODO: This is pretty ad-hoc...
    res.send('<!doctype html><div id="app"></div><script src="bundle.js"></script>');
});

app.use('/api', require('./api'));

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening at http://%s:%s', host, port);
});
