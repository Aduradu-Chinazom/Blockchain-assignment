const sha256 = require("sha256");

class Transaction {
    constructor(productName, quantity, bakerName) {
        this.productName = productName;
        this.quantity = quantity;
        this.bakerName = bakerName;
        this.timestamp = Date.now();
    }

    isValid() {
        if (!this.productName || !this.bakerName) return false;
        if (this.quantity <= 0) return false;
        return true;
    }
}

class Block {
    constructor(index, timestamp, transactions, previousHash = "") {
        this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = "";
        this.nonce = 0;
    }

    calculateHash() {
        return sha256(
            this.index +
            this.previousHash +
            this.timestamp +
            JSON.stringify(this.transactions) +
            this.nonce
        );
    }

    mineBlock(difficulty) {
        const target = "0".repeat(difficulty);
        while (this.hash.substring(0, difficulty) !== target) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined:", this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
    }

    createGenesisBlock() {
        const genesis = new Block(0, Date.now(), [], "0");
        genesis.hash = genesis.calculateHash();
        return genesis;
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addTransaction(transaction) {
        if (!transaction || !transaction.isValid()) {
            throw new Error("Invalid transaction data");
        }
        this.pendingTransactions.push(transaction);
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    minePendingTransactions() {
        const block = new Block(
            this.chain.length,
            Date.now(),
            this.pendingTransactions
        );
        this.addBlock(block);
        this.pendingTransactions = [];
        return block;
    }
}

module.exports = { Blockchain, Block, Transaction };
