var pg = require('pg');
// TODO: This is the dev-server details. We don't care if this gets fucked up,
// but shouldn't be in git. Use env-variables.
var cs = 'postgres://qqpzgylo:xVINSxGAIrwBxAMAsn6Ts1U63FZ7aQJY@horton.elephantsql.com:5432/qqpzgylo';

function handleError(err, client, done) {
    if (!err) return false; 

    // An error occured.
    // If we've received a client, hand it back to the pool.
    if (client) done(client);

    return true;
}

module.exports = {
    query: function(query, input, success, failure) {
        pg.connect(cs, function(err, client, done) {
            if (handleError(err, client, done)) {
                failure(err);
                return;
            }

            client.query(query, input, function(err, qRes) {
                if (handleError(err, client, done)) {
                    failure(err);
                    return;
                }

                done(client);
                success(qRes);
            });
        });
    }
};
