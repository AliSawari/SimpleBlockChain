// A simple BlockChain example via Nodejs
// this example shows the core functionality of a BlockChain system and how it works
// want to add  more options? here's the GitHub rep: https://github.com/AliSawari/SimpleBlockChain
// THIS EXAMPLE IS INSPIRED BY : youtu.be/zVqczFZr124

// Warning: there are some certain issues with the code
// check out issues!!

// requiring Hash function
const {createHmac} = require('crypto');
const util = require('util');



// simplify some functions
function str(val){
  //return JSON.stringify(val);
  return util.inspect(val);
}

//Make an object a string that evaluates to an equivalent object
//  Note that eval() seems tricky and sometimes you have to do
//  something like eval("a = " + yourString), then use the value
//  of a.
//
//  Also this leaves extra commas after everything, but JavaScript
//  ignores them.
function convertToText(obj) {
    //create an array that will later be joined into a string.
    var string = [];

    //is object
    //    Both arrays and objects seem to return "object"
    //    when typeof(obj) is applied to them. So instead
    //    I am checking to see if they have the property
    //    join, which normal objects don't have but
    //    arrays do.
    if (typeof(obj) == "object" && (obj.join == undefined)) {
        string.push("{");
        for (prop in obj) {
            string.push(prop, ": ", convertToText(obj[prop]), ",");
        };
        string.push("}");

    //is array
    } else if (typeof(obj) == "object" && !(obj.join == undefined)) {
        string.push("[")
        for(prop in obj) {
            string.push(convertToText(obj[prop]), ",");
        }
        string.push("]")

    //is function
    } else if (typeof(obj) == "function") {
        string.push(obj.toString())

    //all other values can be done with JSON.stringify
    } else {
        string.push(JSON.stringify(obj))
    }

    return string.join("")
}

// the block class is used to init a new Block
// index is the position of the block in the chain
// data is the user's secret input of data
// timeStamp is the time that the block has been created
// prevHash is the hash of the previous block
// hash is the hash calculated by the calcHash method
// nonce is the random number which is being used in a hash function in order ->
// to reach a certain amount of zeros in the beginning of the hash (AKA : Proof of Work)
class Block {
  constructor(index, data, prevHash){
    this.index = index;
    this.data = data;
    this.timeStamp = Date.now();
    this.prevHash = prevHash;
    this.nonce = 0;
    this.hash = this.calcHash();
  }

  calcHash(){
    // this method is used to take some values, put them in an object then stringify that object
    // toBeHashed value is the stringified type of our data and it'll be passed to the hash function
    let {index, data, timeStamp, prevHash, nonce} = this;
    let simple = {index, data, timeStamp, prevHash, nonce};
    // let toBeHashed = str(simple);
    let toBeHashed = convertToText(simple);
    return createHmac('sha256', toBeHashed).digest('hex');
  }

  mine(diff){
    // this method makes sure that for each defined Difficulty there is zeros in beginning of the hash
    // this method is the implementation of Proof of Work. which makes mining each block take longer time
    // you see here nonce will be incremented by one. that will affect the output of the hash function untill
    // there are enough zeros to pass the if statement

    // while(this.hash.substring(0, diff) !== Array(diff + 1).join('0')){
    //   this.nonce = this.nonce + 1;
    //   this.hash = this.calcHash();
    // }

    if(this.hash.substring(0, diff) === Array(diff + 1).join('0')){
      return console.log(`\nBlock Mined: ${this.hash}`);
    } else {
      this.nonce = this.nonce + 1;
      this.hash = this.calcHash();
      return this.mine(diff);
    }
  }
}


// this is the BlockChain class. used to init a new BlockChain
// notice how the BlockChain is inited by a Genesis block. this block is the first block
// thats why it has index of 0 and previous Hash of 0
// chain is the array that holds the block objects
// diff is the current Difficulty of the BlockChain. it will be passed to the mine method in the block
// to define the amount of zeros in the beginning of a hash
class BlockChain {
  constructor(){
    this.chain = [new Block(0, "Genesis Block", 0)];
    this.diff = 1;
  }

  getLatestBlock(){
    // returns the latest block
    return this.chain[this.chain.length - 1];
  }

  addBlock(data){
    // takes the users input data and pass it to a new block
    // this.chain.length = index + 1
    // get Latest Block's hash
    // mines the block with the specified Difficulty
    // adds the block to the chain
    // updates the Difficulty
    let newBlock = new Block(this.chain.length, data, this.getLatestBlock().hash);
    newBlock.mine(this.diff);
    this.chain.push(newBlock);
    this.updateDiff();
  }

  updateDiff(){
    // this method gets called each time a new block is added to the chain
    // it increases the Difficulty by the amount of the blocks
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
    // returns some information about the BlockChain
    console.log(`\nBlockChain blocks: ${this.chain.length}`);
    console.log(`\nBlockChain Difficulty: ${this.diff}`);
    console.log('\nChain: \n', this.chain);
  }

  isChainValid(){
    // this method makes sure everything is perfectly legal and correct
    let rt = true;
    for(let x = 1; x < this.chain.length; x++){
      let current = this.chain[x];
      let prev = this.chain[x - 1];
      // each block has a correct value of hash based on it's properties
      if(current.hash !== current.calcHash()){
        rt = false;
        return rt;
      }
      // each block points to a previous block using hashes
      if(current.prevHash !== prev.hash){
        rt = false;
        return rt;
      }
    }

    return rt;
  }
}

// EXAMPLES :

// my new BlockChain :)
var AliCoin = new BlockChain();

// adding some blocks
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

// getting information
AliCoin.info();

// making sure the BlockChain is correct
// using timeout to make sure all blocks are mined
setTimeout(() => {
  console.log("Is our BlockChain Valid? ", AliCoin.isChainValid())
}, 7);


// add a block each second
setInterval(() => {
  AliCoin.addBlock({
    amount: 3
  });
  console.log(AliCoin.getLatestBlock());
},1000);


// Go ahead and change the data of one block and see if the chain
// is still Valid or not
// like this :

// aww Peter is so greedy! he wants a 100000 AliCoin :))
//
// AliCoin.chain[3].data = {
//   from: 'Ali',
//   to: 'Peter',
//   amount: 100000
// }
// console.log("Is our BlockChain Valid? ", AliCoin.isChainValid())


// the code above will resolve false! because the current hash says peter received
// 900 AliCoins. while the actual calculated hash says he received a shit ton of coins :|

// even if he recalculate his hash like this:
/*
AliCoin.chain[3].hash = AliCoin.chain[3].calcHash();
console.log("Is our BlockChain Valid? ", AliCoin.isChainValid())
*/

// its still unvalid :^ because when we recalculate our hash with different values
// the next block will not point to our regenerated fake block and will break up the chain :D


// TEST IT OUT YOURSELF AND LET ME KNOW WHAT YOU THINK IN THE COMMENTS
