const Block = require('./models/Block');
const db = require('./db');
const Transaction = require('./models/Transaction');
const UTXO = require('./models/UTXO');

const BLOCK_REWARD = 12;
const TARGET_DIFFICULTY = BigInt("0x0000"+"F".repeat(60));
let PREV_HASH = 0;
let mining = false;

function startMining(miners) {
  mining = true;
  mine(miners);
}

function stopMining() {
  mining = false;
}

function mine(miners) {
  if(!mining) return;
  const addresses = shuffleMiners(miners);
  
  let block = new Block();
  block.previousHash = PREV_HASH;
  block.id = db.blockchain.blockHeight() ? db.blockchain.blockHeight()+1 : 1;

  let turn = 0;
  let address = addresses[0];
  while (BigInt('0x' + block.hash()) >= TARGET_DIFFICULTY) {
    if (turn < addresses.length-1) {
      turn++;
      address = addresses[turn];
    } else {
      turn = 0;
      address = addresses[turn];
    } 
    block.nonce++;
  }

  const coinbaseUtxo = new UTXO(address, BLOCK_REWARD);
  const coinbaseTx = new Transaction([], [coinbaseUtxo]);

  block.addTransaction(coinbaseTx);

  block.execute();

  if (block.id === db.blockchain.blocks.length+1) {
    db.blockchain.addBlock(block);
  } else mine();

  console.log(`
  miner: ${address}
  mined block: #${block.id}
  hash: ${block.previousHash}
  nonce: ${block.nonce}
  prevHash: ${block.hash()}\n`);

  console.log(db.utxos);

  setTimeout(function () {
    mine(addresses);
  }, 3500);
}

function shuffleMiners(miners) {
  let currInd = miners.length;
  let randInd;

  while (currInd != 0) {
    randInd = Math.floor(Math.random() * currInd);
    currInd--;

    [miners[currInd], miners[randInd]] = [
      miners[randInd],
      miners[currInd],
    ];
  }
  return miners;
}

module.exports = {
  startMining,
  stopMining
};