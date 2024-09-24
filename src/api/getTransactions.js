const axios = require("axios");
const bip39 = require("bip39");
const { BIP32Factory } = require("bip32");
const bitcoin = require("bitcoinjs-lib");
const ecc = require("tiny-secp256k1");
const fs = require("fs");
const path = require("path");

const bip32 = BIP32Factory(ecc);
require("dotenv").config();

const walletsFile = path.join(__dirname, "../../wallets.json");

// Fetch transactions for all addresses of the wallet
const getTransactions = async (walletName) => {
  const wallet = getWalletByName(walletName);
  if (!wallet) {
    throw new Error("Wallet not found");
  }

  if (!wallet.addresses || wallet.addresses.length === 0) {
    console.log(`No addresses found for wallet "${walletName}".`);
    return;
  }

  // Fetch transactions for each address
  for (const address of wallet.addresses) {
    console.log(
      `Fetching transactions for ${walletName} at address: ${address}`
    );

    const apiKey = process.env.BLOCKCYPHER_API_KEY;
    const url = `https://api.blockcypher.com/v1/btc/test3/addrs/${address}/full?token=${apiKey}`;

    try {
      const response = await axios.get(url);
      console.log(`Transactions for address ${address}:`, response.data.txs);
    } catch (error) {
      console.error(
        `Error fetching transactions for address ${address}:`,
        error.message
      );
    }
  }
};

// Fetch wallet by name
const getWalletByName = (walletName) => {
  const wallets = JSON.parse(fs.readFileSync(walletsFile));
  return wallets[walletName];
};

module.exports = getTransactions;
