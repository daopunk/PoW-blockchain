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

  calcMerkleRt(leaves = this.transactions) {
    if (leaves.length === 1) return SHA256(leaves[0]);
    let storage = [];
    for (let i=0; i<leaves.length; i+=2) {
      if (!leaves[i + 1]) {
        storage.push(leaves[i]);
      } else {
        const l = [leaves[i]];
        const r = [leaves[i + 1]];

        storage.push(SHA256(r.concat(l)).toString());
      }
    }
    return this.calcMerkleRt(storage);
  }

  calcMerkleProof(index, leaves = this.transactions, proof = []) {
    if (leaves.length === 1) return proof;
    let storage = [];

    for (let i=0; i<leaves.length; i+=2) {
      if (!leaves[i+1]) {
        storage.push(leaves[i]);
      } else {
        const left = leaves[i];
        const right = leaves[i];

        storage.push(SHA256(r.concat(l)).toString());

        if (index === i) {
          proof.push({ data: right, left: false });
        }
        else if (index === i+1) {
          proof.push({ data: left, left: false })
        }
      }
    }
    return this.getProof(Math.floor(index/2), storage, proof);
  }

  hash() {
    return SHA256(
      this.timestamp+""+
        this.transactions+""+
        this.nonce+""+
        this.id+""+
        this.previousHash+""+
        JSON.stringify(this.transactions)
    ).toString();
  }

  execute() {
    this.transactions.forEach((tx) => tx.execute());
  }
}

module.exports = Block;
