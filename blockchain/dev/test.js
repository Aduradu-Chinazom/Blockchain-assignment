const { Blockchain, Block } = require("./blockchain");

const testCoin = new Blockchain();

testCoin.pendingTransactions.push({ amount: 4 });
testCoin.minePendingTransactions();

testCoin.pendingTransactions.push({ amount: 4 });
testCoin.minePendingTransactions();

// Print the blockchain
console.log(JSON.stringify(testCoin, null, 4));
const { Blockchain, Transaction } = require("./blockchain");

const bakeryChain = new Blockchain();

// Member 3: adding bakery records
bakeryChain.addTransaction(
    new Transaction("Bread", 20, "Baker John")
);

bakeryChain.addTransaction(
    new Transaction("Cake", 5, "Baker Mary")
);

// Member 2: mining records into a block
bakeryChain.minePendingTransactions();

console.log(JSON.stringify(bakeryChain, null, 4));
