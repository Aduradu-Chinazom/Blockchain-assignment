const sha256 = require("sha-256");

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.transactions = [];
        this.hash = '';
        this.nonce = 0;
    }

    calculateHash() {
        return sha256.hash(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data).toString() + this.nonce)
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 1 // can be adjusted
        this.pendingTransactions = [];
    }

    createGenesisBlock() {
        return new Block(0, "17/12/25", "Genesis Block", "0")
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
}

module.exports = {Blockchain, Block};

