const fs = require("fs");
const path = require("path");
const postWallet = require("../api/postWallet");
const walletsFile = path.join(__dirname, "../../wallets.json");

const importWallet = async (walletName, mnemonic) => {
  const wallets = loadWallets();
  wallets[walletName] = { mnemonic };
  saveWallets(wallets);
  console.log(`Wallet "${walletName}" imported with mnemonic: ${mnemonic}`);

  // Post the wallet to BlockCypher
  try {
    const response = await postWallet(walletName, mnemonic);
    console.log(`Wallet "${walletName}" posted to BlockCypher: please add address to the wallet`, response.data);
  } catch (error) {
    console.error("Error posting wallet to BlockCypher:", error.message);
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

module.exports = importWallet;
