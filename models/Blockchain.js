class Blockchain {
  constructor() {
    this.blocks = [];
  }

  addBlock(block) {
    if (this.blocks.length) {
      block.previousHash = this.blocks[this.blocks.length - 1]
        .hash()
        .toString();
    }
    this.blocks.push(block);
  }

  blockHeight() {
    return this.blocks.length;
  }
}

module.exports = Blockchain;