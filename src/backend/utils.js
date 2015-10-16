module.exports = {
    handleDBErr: function(err, client, done, res) {
        if (!err) return false; 

        // An error occured.
        // If we've received a client, hand it back to the pool.
        if (client) done(client);

        if (res) {
            // The error occured in the context of a request.
            res.status(500).json({success: false, data: err});
        }

        return true;
    }
}
