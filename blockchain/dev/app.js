import { Blockchain, Transaction } from "./blockchain.js";
import { saveBlockchain, loadBlockchain } from "./storage.js";

// Load blockchain when page opens
let bakeryChain = loadBlockchain(Blockchain);

bakeryChain.addTransaction(
    new Transaction("Bread", 20, "Baker John")
);

bakeryChain.minePendingTransactions();

// Save blockchain
saveBlockchain(bakeryChain);

// Show in console
console.log(bakeryChain.chain);
