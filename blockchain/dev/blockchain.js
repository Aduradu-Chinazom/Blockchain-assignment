const sha256 = require("sha256");
const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "blockchain_data.json");

/* =========================
   TRANSACTION
   ========================= */
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

/* =========================
   BLOCK
   ========================= */
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

/* =========================
   BLOCKCHAIN
   ========================= */
class Blockchain {
    constructor() {
        const savedData = this.loadFromStorage();

        if (savedData) {
            this.chain = savedData.chain;
            this.pendingTransactions = savedData.pendingTransactions;
            this.difficulty = savedData.difficulty;
        } else {
            this.chain = [this.createGenesisBlock()];
            this.pendingTransactions = [];
            this.difficulty = 2;
            this.saveToStorage();
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
        this.saveToStorage();
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
        this.saveToStorage();
    }

    minePendingTransactions() {
        const block = new Block(
            this.chain.length,
            Date.now(),
            this.pendingTransactions
        );
        this.addBlock(block);
        this.pendingTransactions = [];
        this.saveToStorage();
        return block;
    }

    /* =========================
       MEMBER 4: VALIDATION
       ========================= */
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                console.log(`Block ${currentBlock.index} has invalid hash.`);
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                console.log(`Block ${currentBlock.index} previous hash does not match.`);
                return false;
            }

            for (const tx of currentBlock.transactions) {
                if (!tx.isValid()) {
                    console.log(`Block ${currentBlock.index} has invalid transaction.`);
                    return false;
                }
            }
        }
        return true;
    }

    /* =========================
       MEMBER 5: FILE STORAGE
       ========================= */
    saveToStorage() {
        const data = {
            chain: this.chain,
            pendingTransactions: this.pendingTransactions,
            difficulty: this.difficulty
        };
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 4));
    }

    loadFromStorage() {
        try {
            if (!fs.existsSync(DATA_FILE)) return null;

            const rawData = fs.readFileSync(DATA_FILE);
            const data = JSON.parse(rawData);

            // rebuild blocks
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

            // rebuild transactions
            data.pendingTransactions = data.pendingTransactions.map(tx =>
                new Transaction(
                    tx.productName,
                    tx.quantity,
                    tx.bakerName,
                    tx.timestamp
                )
            );

            return data;
        } catch (err) {
            console.error("Corrupted blockchain file. Resetting...");
            if (fs.existsSync(DATA_FILE)) {
                fs.unlinkSync(DATA_FILE);
            }
            return null;
        }
    }
}

module.exports = { Blockchain, Block, Transaction };
