const { Blockchain, Block } = require("./blockchain")

const testCoin = new Blockchain();
testCoin.addBlock(new Block(1, "10/12/25", {amount: 4}))
testCoin.addBlock(new Block(2, "11/12/25", {amount: 4}))

console.log(JSON.stringify(testCoin, null, 4))