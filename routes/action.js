const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['h1', 'h2'], keyspace: 'hw4' });


exports.deposit = function(req, res) {

}

exports.retrieve = function(req, res) {

}