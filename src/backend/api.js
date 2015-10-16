var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');
// TODO: This is the dev-server details. We don't care if this gets fucked up,
// but shouldn't be in git. Use env-variables.
var cs = 'postgres://qqpzgylo:xVINSxGAIrwBxAMAsn6Ts1U63FZ7aQJY@horton.elephantsql.com:5432/qqpzgylo';

var utils = require('./utils.js');

// TODO: This might complete after app begins serving requests. Not a problem in
// practice, but not very clean perhaps.
var absence_types = function() {
    var out = [];
    pg.connect(cs, function(err, client, done) {
        if (utils.handleDBErr(err, client, done)) {
            console.log('Unable to fetch absence types:', err);
            process.exit(1);
        }

        client.query('SELECT * FROM absence_types', function(err, qRes) {
            done();

            if (utils.handleDBErr(err, client, done)) {
                console.log('Unable to fetch absence types:', err);
                process.exit(1);
            }

            out = qRes.rows;
            console.log("Absence types loaded from db:", out);
        });
    });

    return out;
}();


var api = express();

// Parses all request-bodies to JSON.
api.use(bodyParser.json());

api.post('/absence_days', function(req, res) {
    // TODO: Do a more complete check for well-formed requests.
    if (!req.body.date) {
        res.sendStatus(400);
        console.log('Received bad request.')
        return;
    }

    pg.connect(cs, function(err, client, done) {
        if (utils.handleDBErr(err, client, done, res)) {
            console.log('An error occured when connecting to db:', err);
            return;
        }

        var data = req.body;
        client.query(
            'INSERT INTO absence_days(employee, type, date)'
            // TODO: Perhaps we should return the full row.
            + ' VALUES ($1, $2, $3) RETURNING id',
            [data.employee, data.absence_type, data.date],
            function(err, qRes) {
                if (utils.handleDBErr(err, client, done, res)) {
                    console.log('An error occured when INSERTing to db:', err);
                    return;
                }

                done(client);
                res.json({success: true, data: qRes.rows[0]});
            }
        );
    });
});

api.post('/absence_days/range', function(req, res) {
    // TODO: Do a more complete check for well-formed requests.
    if (!req.body.fromDate || !req.body.toDate) {
        res.sendStatus(400);
        console.log('Received bad request.')
        return;
    }

    pg.connect(cs, function(err, client, done) {
        if (utils.handleDBErr(err, client, done, res)) {
            console.log('An error occured when connecting to db:', err);
            return;
        }

        var data = req.body;
        client.query(
            'INSERT INTO absence_days(employee, type, date)'
            + ' SELECT $1, $2, d::date'
            + ' FROM generate_series($3::date, $4, \'1 day\') AS d'
            + ' RETURNING id',
            [data.employee, data.absence_type, data.fromDate, data.toDate],
            function(err, qRes) {
                if (utils.handleDBErr(err, client, done, res)) {
                    console.log('An error occured when INSERTing to db:', err);
                    return;
                }

                done(client);
                res.json({success: true, data: qRes.rows});
            }
        );
    });
});

module.exports = api;
