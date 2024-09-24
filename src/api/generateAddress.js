const axios = require("axios");
const bip39 = require("bip39");
const bitcoin = require("bitcoinjs-lib");
const BIP32Factory = require("bip32").default;
const ecc = require("tiny-secp256k1");
const fs = require("fs");
const path = require("path");
const { loadWallets, saveWallets } = require("../wallet/walletLoader");

const bip32 = BIP32Factory(ecc);
const walletsFile = path.join(__dirname, "../../wallets.json");

const generateAddress = async (walletName) => {
  const wallets = loadWallets();
  const wallet = wallets[walletName];

  if (!wallet) {
    throw new Error(`Wallet "${walletName}" not found.`);
  }

  try {
    // Generate a new address
    const response = await axios.post(
      "https://api.blockcypher.com/v1/btc/test3/addrs"
    );

    const newAddress = response.data.address;

    // Initialize addresses array if it doesn't exist
    if (!wallet.addresses) {
      wallet.addresses = [];
    }

    // Save the new address locally
    wallet.addresses.push(newAddress);
    saveWallets(wallets);
    console.log(
      `New address generated for wallet "${walletName}": ${newAddress}`
    );

    // Add the new address to the wallet on BlockCypher
    console.log(`Adding address to wallet "${walletName}" at BlockCypher...`);
    const data = { addresses: [newAddress] };

    const token = process.env.BLOCKCYPHER_API_KEY; // Fetch the token from environment variables
    const addAddressResponse = await axios.post(
      `https://api.blockcypher.com/v1/btc/test3/wallets/${walletName}/addresses?token=${token}`,
      data
    );

    console.log(
      `Address added to wallet "${walletName}" on BlockCypher:`,
      addAddressResponse.data
    );
  } catch (error) {
    console.error("Error generating or adding address:", error.message);
  }
};

module.exports = generateAddress;
