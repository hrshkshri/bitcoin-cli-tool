const axios = require("axios");

const postWallet = async (walletName, mnemonic) => {
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

  return response;
};

module.exports = postWallet;
