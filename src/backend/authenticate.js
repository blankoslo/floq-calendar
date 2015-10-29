var https = require('https');

var db = require('./db.js');
       
var authUri = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token='

var authenticate = function() {
    // Used to cache valid tokens.
    // TODO: This is temporary, until we do authentications ourselves.
    // TODO: If not, use some session middleware or something.
    var valid_tokens = {};


    function doAuthenticate(req, res, next) {
        var token = req.headers.authorization;

        var failure = function(err) {
            console.log('Error in authentication:', err);
            res.status(401).json({success: false, data: err});
        }

        // This is in no way authorization, simply responding to usual problems.
        if (!token || token == 'undefined' || token == 'null') {
            failure('No token supplied');
            return;
        }

        var handleGoogleResponse = (data) => {
            if (data.hd !== 'blankoslo.no') {
                failure('Wrong domain');
                return;
            }

            req.googleuser = data;
            next();
        }

        var authReq = https.get(authUri+token, (authRes) => {
            var body = '';

            authRes.on('data', (block) => {
                body += block;
            });

            authRes.on('end', () => {
                handleGoogleResponse(JSON.parse(body));
            });
        }).on('error', failure);
    }

    return doAuthenticate;
};

module.exports = authenticate;
