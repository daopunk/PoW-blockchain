const client = require('./client');

client.request('getAllBals', [], function (err, response) {
  if (err) throw err;
  console.log(response.result);
});
