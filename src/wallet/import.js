const fs = require("fs");
const path = require("path");
const postWallet = require("../api/postWallet");
const { loadWallets, saveWallets } = require("./walletLoader"); // Adjust the path as necessary

const importWallet = async (walletName, mnemonic) => {
  const wallets = loadWallets();
  wallets[walletName] = { mnemonic };
  saveWallets(wallets);
  console.log(`Wallet "${walletName}" imported with mnemonic: ${mnemonic}`);

  // Post the wallet to BlockCypher
  try {
    const response = await postWallet(walletName, mnemonic);
    console.log(
      `Wallet "${walletName}" posted to BlockCypher: please add address to the wallet`,
      response.data
    );
  } catch (error) {
    console.error("Error posting wallet to BlockCypher:", error.message);
  }
};

module.exports = importWallet;
