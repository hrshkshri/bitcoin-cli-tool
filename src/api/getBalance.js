const axios = require("axios");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const walletsFile = path.join(__dirname, "../../wallets.json");

const getBalance = async (walletName) => {
  console.log("Getting balance...", walletName);
  const wallets = loadWallets();
  console.log("wallets", wallets[walletName]);
  const wallet = wallets[walletName];

  if (!wallet) {
    throw new Error(`Wallet "${walletName}" not found.`);
  }

  if (!wallet.addresses) {
    throw new Error(`No address found for wallet "${walletName}".`);
  }

  const apiKey = process.env.BLOCKCYPHER_API_KEY;
  console.log(
    `Fetching balance for wallet "${walletName}" with address "${wallet.address}"...`
  );

  const url = `https://api.blockcypher.com/v1/btc/test3/addrs/${wallet.address}/balance?token=${apiKey}`;

  try {
    const response = await axios.get(url);
    console.log(
      `Balance for wallet "${walletName}": ${
        response.data.final_balance / 100000000
      } BTC`
    );
  } catch (error) {
    console.error("Error fetching balance:", error.message);
  }
};

const loadWallets = () => {
  if (!fs.existsSync(walletsFile)) {
    console.log("Wallets file not found. Creating new one...");
    return {};
  }
  return JSON.parse(fs.readFileSync(walletsFile));
};

module.exports = getBalance;
