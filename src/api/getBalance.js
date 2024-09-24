const axios = require("axios");
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const loadWallets = require("../wallet/walletLoader");

const walletsFile = path.join(__dirname, "../../wallets.json");

const getBalance = async (walletName) => {
  console.log("Getting balance...", walletName);
  const wallets = loadWallets();
  console.log("wallets", wallets[walletName]);
  const wallet = wallets[walletName];

  if (!wallet) {
    throw new Error(`Wallet "${walletName}" not found.`);
  }

  if (!wallet.addresses || wallet.addresses.length === 0) {
    throw new Error(`No addresses found for wallet "${walletName}".`);
  }

  const apiKey = process.env.BLOCKCYPHER_API_KEY;
  let totalBalance = 0;

  for (const address of wallet.addresses) {
    console.log(`Fetching balance for address "${address}"...`);
    const url = `https://api.blockcypher.com/v1/btc/test3/addrs/${address}/balance?token=${apiKey}`;

    try {
      const response = await axios.get(url);
      const balance = response.data.final_balance / 100000000; // Convert satoshis to BTC
      totalBalance += balance;
      console.log(`Balance for address "${address}": ${balance} BTC`);
    } catch (error) {
      console.error(
        `Error fetching balance for address "${address}": ${error.message}`
      );
    }
  }

  console.log(`Total balance for wallet "${walletName}": ${totalBalance} BTC`);
};

module.exports = getBalance;
