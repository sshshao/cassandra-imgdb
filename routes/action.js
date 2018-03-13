const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['127.0.0.1:9042'], keyspace: 'hw4' });


exports.deposit = function(req, res) {
    console.log(req.body);
    console.log(req.file);
    
    if(req.body.filename != null && req.file != null) {
        var query = 'INSERT INTO imgs (filename, contents) VALUES (?, textAsBlob(?))';
        var params = [req.body.filename, JSON.stringify(req.file)];
        client.execute(query, params, { prepare: true }, function(err, result) {
            if(err) throw err;
            console.log(result);
            res.send({
                'status': 'END'
            });
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
        var query = 'SELECT filename, contents FROM imgs WHERE filename = ?';
        client.execute(query, [req.query.filename], function(err, result) {
            if(err) throw err;
            if(result.rows.length == 1) {
                var filename = result.rows[0].filename;
                var contents = JSON.parse(result.rows[0].contents);

                if(contents.mimetype == 'image/jpg') {
                    res.setHeader('content-type', 'image/jpeg');
                }
                else {                
                    res.setHeader('content-type', contents.mimetype);
                }
                res.send({
                    'status': 'OK',
                    'filename': filename,
                    'contents': contents
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