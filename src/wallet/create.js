const axios = require("axios"); // Make sure to import axios
const bip39 = require("bip39");
const fs = require("fs");
const path = require("path");
const walletsFile = path.join(__dirname, "../../wallets.json");

const createWallet = async (walletName) => {
  const mnemonic = bip39.generateMnemonic();
  const wallets = loadWallets();

  // Prepare the wallet object to save locally
  const walletData = { mnemonic };

  // Save the wallet locally
  wallets[walletName] = walletData;
  saveWallets(wallets);

  try {
    // Post the wallet to BlockCypher
    const response = await axios.post(
      `https://api.blockcypher.com/v1/btc/test3/wallets?token=${process.env.BLOCKCYPHER_API_KEY}`,
      {
        name: walletName,
        mnemonic: mnemonic,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log(
      `Wallet "${walletName}" created on BlockCypher:`,
      response.data
    );

    saveWallets(wallets);
    console.log(
      `Wallet "${walletName}" saved locally with mnemonic. ${mnemonic}, please add address to wallet.`
    );
  } catch (error) {
    console.error("Error creating wallet on BlockCypher:", error.message);
  }
};

const loadWallets = () => {
  if (!fs.existsSync(walletsFile)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(walletsFile));
};

const saveWallets = (wallets) => {
  fs.writeFileSync(walletsFile, JSON.stringify(wallets, null, 2));
};

module.exports = createWallet;
