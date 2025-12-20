const { Blockchain, Transaction } = require("./blockchain");

const bakeryChain = new Blockchain();

bakeryChain.addTransaction(
    new Transaction("Bread", 20, "Baker John")
);

bakeryChain.addTransaction(
    new Transaction("Cake", 5, "Baker Mary")
);

bakeryChain.minePendingTransactions();

console.log(JSON.stringify(bakeryChain, null, 4));
