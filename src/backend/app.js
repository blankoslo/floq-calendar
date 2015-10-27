var express = require('express');

var app = express();

app.get('/', function (req, res) {
    // TODO: This is pretty ad-hoc...
    res.send('<!doctype html><link rel="stylesheet" type="text/css" href="static/css/styles.css"/><div id="app"></div><script src="static/js/app.bundle.js"></script>');
});

app.use('/api', require('./api'));
app.use('/static', express.static('../frontend/dist/'));

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening at http://%s:%s', host, port);
});
