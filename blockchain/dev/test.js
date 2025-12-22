const { Blockchain, Transaction } = require("./blockchain");

const bakeryChain = new Blockchain();

bakeryChain.addTransaction(new Transaction("Bread", 20, "Baker John"));
bakeryChain.addTransaction(new Transaction("Cake", 5, "Baker Mary"));

bakeryChain.minePendingTransactions();


//Member 4

//check if chain is valid
console.log("Is blockchain valid? " + bakeryChain.isChainValid());

// Tamper with the blockchain
bakeryChain.chain[1].transactions[0].quantity = 1000; 
console.log("Is blockchain valid after tampering? " + bakeryChain.isChainValid());

console.log(JSON.stringify(bakeryChain, null, 4));
