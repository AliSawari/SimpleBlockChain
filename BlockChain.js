const {createHmac} = require('crypto');

function str(val){
  return JSON.stringify(val, null, 2);
}

class Block {
  constructor(index, data, prevHash){
    this.index = index;
    this.data = data;
    this.timeStamp = Date.now();
    this.prevHash = prevHash;
    this.hash = this.calcHash();
    this.nonce = 0;
  }

  calcHash(){
    let {index, data, timeStamp, prevHash, nonce} = this;
    let simple = {index, data, timeStamp, prevHash, nonce};
    let toBeHashed = str(simple);
    return createHmac('sha256', toBeHashed).digest('hex');
  }

  mine(diff){
    while(this.hash.substring(0, diff) !== Array(diff + 1).join('0')){
      this.nonce = this.nonce + 1;
      this.hash = this.calcHash();
    }

    console.log("\nBlock Mined: ", this.hash);
  }
}

class BlockChain {
  constructor(){
    this.chain = [new Block(0, "Genesis Block", 0)];
    this.diff = 1;
  }

  getLatestBlock(){
    return this.chain[this.chain.length - 1];
  }

  addBlock(data){
    let newBlock = new Block(this.chain.length, data, this.getLatestBlock().hash);
    newBlock.mine(this.diff);
    this.chain.push(newBlock);
    this.updateDiff();
  }

  updateDiff(){
    let n = this.chain.length;
    if(n >= 1 && n < 20){
      this.diff = 1;
    }
    if(n >= 20 && n < 50){
      this.diff = 2;
    }
    if(n >= 20 && n < 50){
      this.diff = 3;
    }
    if(n >= 50 && n < 100){
      this.diff = 4;
    }
    if(n >= 100 && n < 200){
      this.diff = 5;
    }
    if(n >= 200 && n < 500){
      this.diff = 6;
    }
  }

  info(){
    console.log(`\nBlockChain blocks: ${this.chain.length}`);
    console.log(`\nBlockChain Difficulty: ${this.diff}`);
    console.log('\nChain: \n', this.chain);
  }

  isChainValid(){
    let rt = true;
    for(let x = 1; x < this.chain.length; x++){
      let current = this.chain[x];
      let prev = this.chain[x - 1];
      
      if(current.hash !== current.calcHash()){
        rt = false;
        return rt;
      }

      if(current.prevHash !== prev.hash){
        rt = false;
        return rt;
      }
    }

    return rt;
  }
}

var AliCoin = new BlockChain();

AliCoin.addBlock({
  from: 'Ali',
  to: 'World',
  amount: 250
});

AliCoin.addBlock({
  from: 'Peter',
  to: 'John',
  amount: 590
});

AliCoin.addBlock({
  from: 'Ali',
  to: 'Peter',
  amount: 900
});

AliCoin.addBlock({
  from: 'John',
  to: 'World',
  amount: 120
});

AliCoin.info();

console.log("Is our BlockChain Valid? ", AliCoin.isChainValid())

// setInterval(() => {
//   AliCoin.addBlock({
//     coins: 2
//   });
//   console.log("This Block: ", AliCoin.getLatestBlock());
// }, 500);