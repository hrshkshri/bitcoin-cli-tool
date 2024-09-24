const axios = require("axios");
require("dotenv").config();

const getTransactions = async (walletName) => {
  const wallet = getWalletByName(walletName);
  if (!wallet) {
    throw new Error("Wallet not found");
  }

  const address = getFirstAddress(wallet.mnemonic);
  const apiKey = process.env.BLOCKCYPHER_API_KEY;
  const url = `https://api.blockcypher.com/v1/btc/test3/addrs/${address}/full?token=${apiKey}`;

  try {
    const response = await axios.get(url);
    console.log(`Transactions for ${walletName}:`, response.data.txs);
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
  }
};

const getWalletByName = (walletName) => {
  const wallets = JSON.parse(fs.readFileSync(walletsFile));
  return wallets[walletName];
};

const getFirstAddress = (mnemonic) => {
  // Logic to generate address from mnemonic (BIP44 derivation)
};

module.exports = getTransactions;
