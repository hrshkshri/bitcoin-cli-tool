const fs = require("fs");
const path = require("path");
const walletsFile = path.join(__dirname, "../../wallets.json");

const loadWallets = () => {
  if (!fs.existsSync(walletsFile)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(walletsFile));
};

const saveWallets = (wallets) => {
  fs.writeFileSync(walletsFile, JSON.stringify(wallets, null, 2));
};

module.exports = { loadWallets, saveWallets };
