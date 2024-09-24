const bip39 = require("bip39");
const fs = require("fs");
const path = require("path");
const postWallet = require("../api/postWallet");
const walletsFile = path.join(__dirname, "../../wallets.json");

const createWallet = async (walletName) => {
  const mnemonic = bip39.generateMnemonic();
  const wallets = loadWallets();

  // Prepare the wallet object to save locally
  const walletData = { mnemonic };

  // Save the wallet locally
  wallets[walletName] = walletData;
  saveWallets(wallets);

  // Post the wallet to BlockCypher
  try {
    const response = await postWallet(walletName, mnemonic);
    console.log(
      `Wallet "${walletName}" created on BlockCypher:`,
      response.data
    );
  } catch (error) {
    console.error("Error creating wallet on BlockCypher:", error.message);
  }

  console.log(
    `Wallet "${walletName}" saved locally with mnemonic. ${mnemonic}, please add address to wallet.`
  );
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
