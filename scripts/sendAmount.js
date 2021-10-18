const client = require('./client');
const { argv } = require('yargs');

const { senderPublic, senderPrivate, recipient, amount } = argv;

client.request('sendAmount', [senderPublic, senderPrivate, recipient, amount], function (err, response) {
  if (err) throw err;
  console.log(response.result);
});

/*
node sendAmount 
--senderPublic=04a32d73b3c2d32a9f0a19897cccfe738050e3535b5545120c11e7da0d909667c072d927c5498b3f125571297848838e0b73fea1047cdadfbe25de3e2e0a66ca4f
--senderPrivate=2ae3b3436ba5f6c2cbdf5ef18fe1f35c60bf95732243e687393404f724153fe8
--recipient=04f8d04e7e98665d06f5cbf9715edf81f2c93bea9333a4ba94bfb114a9ad5c08900ac402893e04ad07d2947b7202375dbbd6b56e9742e3337b813fac22544242f7
--amount=97

node sendAmount
--senderPublic=04a32d73b3c2d32a9f0a19897cccfe738050e3535b5545120c11e7da0d909667c072d927c5498b3f125571297848838e0b73fea1047cdadfbe25de3e2e0a66ca4f,
2ae3b3436ba5f6c2cbdf5ef18fe1f35c60bf95732243e687393404f724153fe8,
04f8d04e7e98665d06f5cbf9715edf81f2c93bea9333a4ba94bfb114a9ad5c08900ac402893e04ad07d2947b7202375dbbd6b56e9742e3337b813fac22544242f7,
97
*/
