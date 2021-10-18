const jayson = require('jayson');
const {startMining, stopMining} = require('./mine');
const {PORT, PUBLIC_KEY1, PUBLIC_KEY2, PUBLIC_KEY3} = require('./config');
const {utxos} = require('./db');
const Transaction = require('./models/Transaction');
const UTXO = require('./models/UTXO');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const miners = [PUBLIC_KEY1, PUBLIC_KEY2, PUBLIC_KEY3];

const isValid = (sender, msgHash, sign) => {
  const key = ec.keyFromPublic(sender, 'hex');
  return key.verify(msgHash, sign);
}

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
  },

  getAllBals: function([], cb) {
    let sums = [];
    for (let miner of miners) {
      const curUtxos = utxos.filter((tx) => {
        return tx.owner === miner && !tx.spent;
      });
      const sum = curUtxos.reduce((prev, curr) => prev + curr.amount, 0);
      const obj = {};
      obj[miner] = sum;
      sums.push(obj);
    }
    cb(null, sums);
  },

  sendAmount: function ([senderPublic, senderPrivate, recipient, amount], cb) {
    const key = ec.keyFromPrivate(senderPrivate);
    const message = {
      senderPublic,
      amount,
      recipient,
      key
    }
    const msgHash = SHA256(message).toString();
    const sign = key.sign(msgHash);

    const curUtxos = utxos.filter((tx) => {
      return tx.owner === senderPublic && !tx.spent;
    });
    const sum = curUtxos.reduce((prev, curr) => prev + curr.amount, 0);

    if (isValid(senderPublic, msgHash, sign) && sum >= amount) {
      let inputs = [];
      let outputs = [];
      let i=0;
      while (inputs.reduce((p, c) => p + c.amount, 0) < amount) {
        let utxo = UTXO(recipient, curUtxos[i].amount)
        outputs.push(utxo);
        inputs.push(curUtxos[i]);
      }
      let sumI = inputs.reduce((p, c) => p + c.amount, 0);
      let sumO = outputs.reduce((p, c) => p + c.amount, 0);
      let diff = sumO - sumI;
      if (diff > 0) {
        let difference = UTXO(senderPublic, diff);
        outputs.push(difference);
      }

      const tx = new Transaction(inputs, outputs);
      tx.execute();
    }

    cb(null, utxos);
  }
});

server.http().listen(PORT);

