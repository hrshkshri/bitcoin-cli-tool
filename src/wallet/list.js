const fs = require("fs");
const path = require("path");
const walletsFile = path.join(__dirname, "../../wallets.json");

const listWallets = () => {
  if (!fs.existsSync(walletsFile)) {
    console.log("No wallets found.");
    return;
  }

  const wallets = JSON.parse(fs.readFileSync(walletsFile));
  console.log("Wallets:", wallets);
};

module.exports = listWallets;
