const {utxos} = require('../db');

class Transaction {
  constructor(inputs, outputs) {
    this.inputs = inputs;
    this.outputs = outputs;
  }

  execute() {
    this.inputs.forEach((txo)=>{
      txo.spend();
    });
    this.outputs.forEach((utxo)=>{
      utxos.push(utxo);
    });
  }  
}

module.exports = Transaction;