export function saveBlockchain(blockchain) {
    const data = {
        chain: blockchain.chain,
        pendingTransactions: blockchain.pendingTransactions,
        difficulty: blockchain.difficulty
    };

    localStorage.setItem("bakeryBlockchain", JSON.stringify(data));
}

export function loadBlockchain(Blockchain, Block, Transaction) {
    const stored = localStorage.getItem("bakeryBlockchain");

    if (!stored) {
        return new Blockchain();
    }

    try {
        const parsed = JSON.parse(stored);
        const blockchain = new Blockchain();

        blockchain.chain = parsed.chain.map(b => {
            const block = new Block(
                b.index,
                b.timestamp,
                b.transactions.map(
                    tx => new Transaction(tx.productName, tx.quantity, tx.bakerName)
                ),
                b.previousHash
            );
            block.hash = b.hash;
            block.nonce = b.nonce;
            return block;
        });

        blockchain.pendingTransactions = parsed.pendingTransactions.map(
            tx => new Transaction(tx.productName, tx.quantity, tx.bakerName)
        );

        blockchain.difficulty = parsed.difficulty;

        return blockchain;
    } catch {
        localStorage.removeItem("bakeryBlockchain");
        return new Blockchain();
    }
}
