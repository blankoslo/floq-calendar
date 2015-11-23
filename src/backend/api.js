var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var db = require('./db.js');

var common = require('common');

var api = express();

// Allow CORS
api.use(cors());
api.options('*', cors());

// Makes sure token is correct.
function authWrapper(req, res, next) {
    common.authenticate(req.headers.authorization)
        .then(
            (data) => {
                req.googleuser = data;
                next();
            },
            (err) => {
                res.status(401).json({
                    success: false,
                    data: err
                });
            }
        )
}
api.use(authWrapper);

// Parses all request-bodies to JSON.
api.use(bodyParser.json());

// TODO: This should be handled by the 'employees' API!
api.get('/employees/loggedin', function(req, res) {
    var success = function(qRes) {
        res.json({success: true, data: qRes.rows[0]});
    }

    var failure = function(err) {
        console.log('Unable to find employee:', err);
        res.status(500).json({success: false, data: err});
    }

    var email = req.googleuser.email;
    query = 'SELECT * FROM employees WHERE email = $1'
    db.singleQuery(query, [email])
        .then(success, failure);
});

api.get('/employees', function(req, res) {
    var success = function(qRes) {
        res.json({success: true, data: qRes.rows});
    }

    var failure = function(err) {
        console.log('Unable to query employees:', err);
        res.status(500).json({success: false, data: err});
    }

    db.singleQuery(
            'SELECT id, first_name, last_name FROM employees ORDER BY first_name')
                .then(success, failure);
});

api.get('/absence_types', function(req, res) {
    var success = function(qRes) {
        res.json({success: true, data: qRes.rows});
    }

    var failure = function(err) {
        console.log('Unable to query absence days:', err);
        res.status(500).json({success: false, data: err});
    }

    db.singleQuery('SELECT * FROM absence_types').then(success, failure);
});

// None of the absence_days endpoints use the typical /absence_days/:id-pattern,
// since we support doing operations on multiple days at once.

api.post('/absence_days', function(req, res) {
    var success = function(qRes) {
        res.json({success: true, data: qRes.rows[0]});
    }

    var failure = function(err) {
        console.log('Unable to query absence days:', err);
        res.status(500).json({success: false, data: err});
    }

    var data = req.body;

    // Dealing with a single date.
    if (req.body.date) {
        db.singleQuery('INSERT INTO absence_days(employee, type, date)'
                // TODO: Perhaps we should return the full row.
                + ' VALUES ($1, $2, $3) RETURNING *',
                [data.employee, data.type, data.date])
                    .then(success, failure);
        return;
    // Dealing with a date range.
    } else if (req.body.fromDate && req.body.toDate) {
        db.singleQuery('INSERT INTO absence_days(employee, type, date)'
                + ' SELECT $1, $2, d::date'
                + ' FROM generate_series($3::date, $4, \'1 day\') AS d'
                + ' RETURNING *',
                [data.employee, data.absence_type, data.fromDate, data.toDate])
                    .then(success, failure);
        return;
    }

    // TODO: Do a more complete check for well-formed requests.
    res.sendStatus(400);
    console.log('Received bad request.')
});

api.get('/absence_days', function(req, res) {
    // TODO: `success` and `failure` are equal in all calls.
    // Pull out as "middleware"?
    var success = function(qRes) {
        res.json({success: true, data: qRes.rows});
    }

    var failure = function(err) {
        console.log('Unable to query absence days:', err);
        res.status(500).json({success: false, data: err});
    }

    var data = req.query;
    var query = 'SELECT * FROM absence_days WHERE date >= $1 AND date <= $2';
    var paramList = [data.from, data.to];
    if (data.employee) {
        query += ' AND employee = $3 ORDER BY date';
        paramList.push(data.employee);
    } else {
        // Get for all employees, so we should order results.
        query += ' ORDER BY employee, date';
    }

    db.singleQuery(query, paramList).then(success, failure);
});


api.put('/absence_days', function(req, res) {
    var success = function(qRes) {
        res.json({success: true, data: qRes.rows});
    }

    var failure = function(err) {
        console.log('Unable to query absence days:', err);
        res.status(500).json({success: false, data: err});
    }

    var data = req.body;

    db.singleQuery(
            'UPDATE absence_days SET type = $1 WHERE id = $2 RETURNING *',
            [data.type, data.id])
                .then(success, failure);
});


api.delete('/absence_days', function(req, res) {
    // TODO: Do a more complete check for well-formed requests.
    if (!req.body.id) {
        res.sendStatus(400);
        console.log('Received bad request.')
        return;
    }

    var success = function(qRes) {
        res.json({success: true, data: qRes.rows});
    }

    var failure = function(err) {
        console.log('Unable to delete absence day:', err);
        res.status(500).json({success: false, data: err});
    }

    var data = req.body;
    // FIXME: Using ANY here because node-postgres does not include a nice way
    // to properly escape arrays. This is a bit suboptimal, and should be fixed.
    // See: http://stackoverflow.com/questions/10720420/node-postgres-how-to-execute-where-col-in-dynamic-value-list-query
    // for discussion.
    db.singleQuery(
            'DELETE FROM absence_days WHERE id = ANY($1::int[]) RETURNING id',
            [data.id])
                .then(success, failure);
});

module.exports = api;
