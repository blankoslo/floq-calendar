var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');
// TODO: This is the dev-server details. We don't care if this gets fucked up,
// but shouldn't be in git. Use env-variables.
var cs = 'postgres://qqpzgylo:xVINSxGAIrwBxAMAsn6Ts1U63FZ7aQJY@horton.elephantsql.com:5432/qqpzgylo';

// TODO: This might complete after app begins serving requests. Not a problem in
// practice, but not very clean perhaps.
var absence_types = function() {
    var out = [];
    pg.connect(cs, function(err, client, done) {
        if (err) {
            done();
            console.log('Unable to fetch absence types:', err);
            process.exit(1);
        }

        client.query('SELECT * FROM absence_types', function(err, result) {
            done();

            if (err) {
                console.log('Unable to fetch absence types:', err);
                process.exit(1);
            }
            out = result.rows;
            console.log("Absence types loaded from db:", out);
        });
    });

    return out;
}();


var api = express();

// Parses all request-bodies to JSON.
api.use(bodyParser.json());

api.post('/absence_days', function(req, res) {
    if (!req.body.date) {
        res.sendStatus(400);
        console.log('Received bad request.')
        return;
    }

    pg.connect(cs, function(err, client, done) {
        if (err) {
            done();
            console.log(err);
            res.status(500).send({success: false, data: err});
        }

        // TODO: employee and type are hardcoded for now.
        client.query(
            'INSERT INTO absence_days(employee, type, date) VALUES (1, 1, $1)',
            [req.body.date],
            function(err, result) {
                done();
                if (err) {
                    console.log(err);
                    res.status(500).send({success: false, data: err});
                } else {
                    // TODO: Remove.
                    console.log("result:", result);
                }
            }
        );
    });
});

module.exports = api;
