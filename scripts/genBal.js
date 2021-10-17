const client = require('./client');

client.request('genBal', [], function (err, response) {
  if (err) throw err;
  console.log(response.result);
});
