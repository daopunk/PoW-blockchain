const client = require('./client');
const {argv} = require('yargs');

const {address} = argv;

client.request('getBal', [address], function (err, response) {
  if (err) throw err;
  console.log(response.result);
});

/*
node getBal --address=04a32d73b3c2d32a9f0a19897cccfe738050e3535b5545120c11e7da0d909667c072d927c5498b3f125571297848838e0b73fea1047cdadfbe25de3e2e0a66ca4f

node getBal --address=04f8d04e7e98665d06f5cbf9715edf81f2c93bea9333a4ba94bfb114a9ad5c08900ac402893e04ad07d2947b7202375dbbd6b56e9742e3337b813fac22544242f7

node getBal --address=046e0274d590a6ab016f2bd0db59778112e5de6f06a58f08c61f618835b7fd4c2e503d3110467cd7759c47093a885c75fdecb35df57e900824b6a077abba8b2b81
*/
