const bip39 = require("bip39");
const fs = require("fs");
const path = require("path");
const walletsFile = path.join(__dirname, "../../wallets.json");

const createWallet = async (walletName) => {
  const mnemonic = bip39.generateMnemonic();
  const wallets = loadWallets();
  wallets[walletName] = { mnemonic };
  saveWallets(wallets);
  console.log(`Wallet "${walletName}" created with mnemonic: ${mnemonic}`);
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
