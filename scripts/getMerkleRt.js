const client = require('./client');
const db = require('../db');

client.request('getMerkleRoot', [db], function (err, response) {
  if (err) throw err;
  console.log(response.result);
});
