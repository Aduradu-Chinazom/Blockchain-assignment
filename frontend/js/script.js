import { Blockchain, Block, Transaction } from "../../blockchain/dev/blockchain.js";
import { saveBlockchain, loadBlockchain } from "../../blockchain/dev/storage.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("script.js loaded");

    let bakeryChain = loadBlockchain(Blockchain, Block, Transaction);

    const addTransactionButton = document.querySelector('#addTransaction .btn');
    const productInput = document.querySelector('#productInput');
    const quantityInput = document.querySelector('#quantityInput');
    const bakerInput = document.querySelector('#bakerInput');


    addTransactionButton.addEventListener('click', () => {
        const productName = productInput.value.trim();
        const quantity = parseInt(quantityInput.value);
        const bakerName = bakerInput.value.trim();

        if (!productName || !bakerName || isNaN(quantity) || quantity <= 0) {
            alert("Please fill in all fields correctly");
            return;
        }

        const tx = new Transaction(productName, quantity, bakerName);
        bakeryChain.addTransaction(tx);
        saveBlockchain(bakeryChain);

        productInput.value = '';
        quantityInput.value = '';
        bakerInput.value = '';
    });

    const mineBlockButton = document.querySelector('#mineBlock .btn');
    mineBlockButton.addEventListener('click', () => {
        bakeryChain.minePendingTransactions();
        saveBlockchain(bakeryChain);
        alert("Block mined successfully!");
    });

    window.addEventListener('beforeunload', () => {
        saveBlockchain(bakeryChain);
    });
});
console.log(addTransactionButton, mineBlockButton);

