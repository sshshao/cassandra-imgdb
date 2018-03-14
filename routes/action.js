const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['127.0.0.1:9042'], keyspace: 'hw4' });


exports.deposit = function(req, res) {
    console.log(req.body);
    console.log(req.file);
    
    if(req.body.filename != null && req.file != null) {
        var filename = req.body.filename;
        var data = req.file.buffer.toString('ascii');
        var type = req.file.mimetype;

        var params = [filename, type, data];
        var query = 'INSERT INTO imgs (filename, type, contents) VALUES (?, ?, textAsBlob(?))';
        client.execute(query, params, { prepare: true }, function(err, result) {
            if(err) throw err;
            res.setHeader('content-type', type);
            console.log("SENDING " + new Buffer(data, 'ascii'));
            res.end(new Buffer(data, 'ascii'));
        });
    }
    else {
        res.send({
            'status': 'PARAM ERROR'
        });
    }
}

exports.retrieve = function(req, res) {
    if(req.query.filename != null) {
        var query = 'SELECT filename, type, contents FROM imgs WHERE filename = ?';
        client.execute(query, [req.query.filename], function(err, result) {
            if(err) throw err;
            if(result.rows.length == 1) {
                var mimetype = result.rows[0].type;
                var contents = result.rows[0].contents;
                console.log("RETROEVED" + contents);

                res.setHeader('content-type', mimetype);
                res.end(contents, 'ascii');
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