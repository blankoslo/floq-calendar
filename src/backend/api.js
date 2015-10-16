var express = require('express');
var bodyParser = require('body-parser');

var db = require('./db.js');

// TODO: This might complete after app begins serving requests. Not a problem in
// practice, but not very clean perhaps.
var absence_types = function() {
    var out = [];

    var success = function(qRes) {
        out = qRes.rows;
        console.log("Absence types loaded from db:", out);
    }

    var failure = function(err) {
        console.log('Unable to query absence types:', err);
        process.exit(1);
    }

    db.query('SELECT * FROM absence_types', null, success, failure);

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

    var success = function(qRes) {
        res.json({success: true, data: qRes.rows[0]});
    }

    var failure = function(err) {
        console.log('Unable to query absence days:', err);
        res.status(500).json({success: false, data: err});
    }

    var data = req.body;
    db.query('INSERT INTO absence_days(employee, type, date)'
            // TODO: Perhaps we should return the full row.
            + ' VALUES ($1, $2, $3) RETURNING id',
            [data.employee, data.absence_type, data.date],
            success,
            failure
    );
});

api.post('/absence_days/range', function(req, res) {
    // TODO: Do a more complete check for well-formed requests.
    if (!req.body.fromDate || !req.body.toDate) {
        res.sendStatus(400);
        console.log('Received bad request.')
        return;
    }

    var success = function(qRes) {
        res.json({success: true, data: qRes.rows});
    }

    var failure = function(err) {
        console.log('Unable to query absence days:', err);
        res.status(500).json({success: false, data: err});
    }

    var data = req.body;
    db.query('INSERT INTO absence_days(employee, type, date)'
            + ' SELECT $1, $2, d::date'
            + ' FROM generate_series($3::date, $4, \'1 day\') AS d'
            + ' RETURNING id',
            [data.employee, data.absence_type, data.fromDate, data.toDate],
            success,
            failure
    );
});

module.exports = api;
