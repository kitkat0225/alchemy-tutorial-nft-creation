require('dotenv').config();
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");
const contractAddress = "0xB83010385d2C51F60085b0BA6EAa91E3eb880885";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

// console.log(JSON.stringify(contract.abi));

async function mintNFT(tokenURI) {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce
    //the transaction
    const tx = {
        'from': PUBLIC_KEY,
        'to': contractAddress,
        'nonce': nonce,
        'gas': 500000,
        'maxPriorityFeePerGas': 1999999987,
        'data': nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI()
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    console.log(`Transaction receipt: ${JSON.stringify(transactionReceipt)}`);
}

mintNFT("https://gateway.pinata.cloud/ipfs/QmNRS2D2TuuMeLKMbffuZBcQyS46jNrQQkouVLZfnZfNpL");