const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['127.0.0.1:9042'], keyspace: 'hw4' });


exports.deposit = function(req, res) {
    if(req.body.filename != null && req.body.contents != null) {
        var query = 'INSERT INTO imgs (filename, contents) VALUES (?, ?)';
        var params = [req.body.filename, req.body.contents];
        client.execute(query, params, { prepare: true }, function(err, result) {
            if(err) throw err;
            console.log(result);
            res.send({
                'status': 'END'
            });
        });
    }
}

exports.retrieve = function(req, res) {
    if(req.query.filename != null) {
        var query = 'SELECT filename, contents FROM imgs WHERE filename = ?';
        client.execute(query, [req.query.filename], function(err, result) {
            if(err) throw err;
            if(result.rows.length == 1) {
                console.log('[*]filename %s', result.rows[0].filename);
                console.log('[*]contents %s', result.rows[0].contents);
                res.send({
                    'status': 'OK'
                });
            }
            else {
                res.send({
                    'status': 'ERROR'
                });
            }
        });
    }
    else {
        res.send({
            'status': 'PARAM ERROR'
        });
    }
}