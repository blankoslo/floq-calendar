var Promise = require('promise');

var pg = require('pg');
// TODO: This is the dev-server details. We don't care if this gets fucked up,
// but shouldn't be in git. Use env-variables.
var cs = process.env.DATABASE_URL || 'postgres://qqpzgylo:xVINSxGAIrwBxAMAsn6Ts1U63FZ7aQJY@horton.elephantsql.com:5432/qqpzgylo';

module.exports = {
    singleQuery: function(query, input) {
        return new Promise(function(fulfill, reject) {
            pg.connect(cs, function(err, client, done) {
                if (err) {
                    if (client) done(client);
                    reject(err);
                    return;
                }

                client.query(query, input, function(err, qRes) {
                    if (err) {
                        if (client) done(client);
                        reject(err);
                        return;
                    }

                    done(client);
                    fulfill(qRes);
                });
            });
        });
    }
};
