const SHA256 = require('crypto-js/sha256');

class Block {
  constructor() {
    this.timestamp = Date.now();
    this.transactions = [];
    this.nonce = 0;
  }

  addTransaction(tx) {
    this.transactions.push(tx);
  }

  hash() {
    return SHA256(
      this.timestamp+""+
        this.transactions+""+
        this.nonce+""+
        this.previousHash+""+
        JSON.stringify(this.transactions)
    ).toString();
  }

  execute() {
    this.transactions.forEach((tx) => tx.execute());
  }
}

module.exports = Block;
