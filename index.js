const jayson = require('jayson');
const {startMining, stopMining} = require('./mine');
const {PORT, PUBLIC_KEY1, PUBLIC_KEY2, PUBLIC_KEY3} = require('./config');
const {utxos} = require('./db');
const UTXO = require('./models/UTXO');

const miners = [PUBLIC_KEY1, PUBLIC_KEY2, PUBLIC_KEY3];

// create server
const server = jayson.server({
  startMining: function([], cb) {
    cb(null, 'Mining begun!');
    startMining(miners);
  },
  stopMining: function(_, cb) {
    cb(null, 'Mining halted!');
    stopMining();
  },
  genBal: function([], cb) {
    for (let i=0; i<miners.length; i++) {
      const utxo = new UTXO(miners[i], 100);
      utxos.push(utxo);
    }
    cb(null, utxos);
  },
  getBal: function([address], cb) {
    const curUtxos = utxos.filter((tx)=>{
      return tx.owner === address && !tx.spent;
    });
    const sum = curUtxos.reduce((prev,curr)=> prev + curr.amount, 0);
    cb(null, sum);
  }
  // getMerkleRt: function([db], cb) {
  //   const blocks = db.blockchain.blocks;
  //   for (let i=0; i < blocks.length; i++) {

  //   }

  //   cb(null, 'x');
  // }
});

server.http().listen(PORT);

