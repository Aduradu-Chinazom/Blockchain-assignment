const sha256 = require("sha256");

class Transaction {
    constructor(productName, quantity, bakerName, timestamp = Date.now()) {
        this.productName = productName;
        this.quantity = quantity;
        this.bakerName = bakerName;
        this.timestamp = timestamp;
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
    }
}

class Blockchain {
    constructor() {
        const savedData = this.loadFromLocalStorage();

        if (savedData) {
            this.chain = savedData.chain;
            this.pendingTransactions = savedData.pendingTransactions;
            this.difficulty = savedData.difficulty;
        } else {
            this.chain = [this.createGenesisBlock()];
            this.pendingTransactions = [];
            this.difficulty = 2;
            this.saveToLocalStorage();
        }
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
        this.saveToLocalStorage();
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
        this.saveToLocalStorage();
    }

    minePendingTransactions() {
        const block = new Block(
            this.chain.length,
            Date.now(),
            this.pendingTransactions
        );
        this.addBlock(block);
        this.pendingTransactions = [];
        this.saveToLocalStorage();
        return block;
    }

    // Member 4
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }

            for (const tx of currentBlock.transactions) {
                if (!tx.isValid()) return false;
            }
        }
        return true;
    }

    saveToLocalStorage() {
        const data = {
            chain: this.chain,
            pendingTransactions: this.pendingTransactions,
            difficulty: this.difficulty
        };
        localStorage.setItem("bakeryBlockchain", JSON.stringify(data));
    }

    loadFromLocalStorage() {
        try {
            const data = JSON.parse(localStorage.getItem("bakeryBlockchain"));
            if (!data) return null;

            data.chain = data.chain.map(block => {
                const rebuiltBlock = new Block(
                    block.index,
                    block.timestamp,
                    block.transactions,
                    block.previousHash
                );
                rebuiltBlock.hash = block.hash;
                rebuiltBlock.nonce = block.nonce;
                return rebuiltBlock;
            });

            data.pendingTransactions = data.pendingTransactions.map(tx =>
                new Transaction(
                    tx.productName,
                    tx.quantity,
                    tx.bakerName,
                    tx.timestamp
                )
            );

            return data;
        } catch (error) {
            console.error("Corrupted blockchain storage. Resetting...");
            localStorage.removeItem("bakeryBlockchain");
            return null;
        }
    }
}

module.exports = { Blockchain, Block, Transaction };
