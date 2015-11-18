var express = require('express');

var app = express();

app.get('/', function (req, res) {
    // TODO: This is pretty ad-hoc...
    res.send('<!doctype html><link rel="stylesheet" type="text/css" href="static/css/styles.css"/><meta name="google-signin-client_id" content="1085640931155-0f6l02jv973og8mi4nb124k6qlrh470p.apps.googleusercontent.com"/><div id="app"></div><script src="https://apis.google.com/js/platform.js?onload=googleLoaded" async defer></script><script src="static/js/app.bundle.js"></script>');
});

app.use('/api', require('./api'));
app.use('/static', express.static('../frontend/dist/'));

var server = app.listen(process.env.PORT || 3001, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening at http://%s:%s', host, port);
});
