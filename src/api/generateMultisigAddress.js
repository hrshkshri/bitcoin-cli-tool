const axios = require("axios");
const fs = require("fs");
const path = require("path");
const bip39 = require("bip39");
const bitcoin = require("bitcoinjs-lib");
const BIP32Factory = require("bip32").default;
const ecc = require("tiny-secp256k1");

const bip32 = BIP32Factory(ecc);
const walletsFile = path.join(__dirname, "../../wallets.json");

const generateMultisigAddress = async (walletName) => {
  const wallets = loadWallets();
  const wallet = wallets[walletName];

  if (!wallet) {
    throw new Error(`Wallet "${walletName}" not found.`);
  }

  // Derive public keys for multisig
//   const pubkeys = await derivePublicKeys(wallet.mnemonic, 3);

//   if (pubkeys.length < 2) {
//     throw new Error("At least 2 public keys are required for multisig.");
//   }

//   const data = {
//     pubkeys: pubkeys, // Public keys for multisig
//     script_type: "multisig-2-of-3", // 2-of-3 multisig setup
//   };

//   console.log("Generating ...", data);

  try {
    const response = await axios.post(
      "https://api.blockcypher.com/v1/btc/test3/addrs",
    //   data,
    //   {
    //     headers: { "Content-Type": "application/json" },
    //   }
    );

    if (!wallet.addresses) {
      wallet.addresses = [];
    }
    wallet.addresses.push(response.data.address); // Save the generated multisig address to the wallet

    saveWallets(wallets);
    console.log(
      `New multisig address generated for wallet "${walletName}": ${response.data.address}`
    );
  } catch (error) {
    console.error("Error generating multisig address:", error.message);
  }
};

// I am just putting this here just in case we need it (dont know if we will)
const derivePublicKeys = async (mnemonic, numberOfKeys) => {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error("Invalid mnemonic provided.");
  }

  const seed = await bip39.mnemonicToSeed(mnemonic);
  const root = bip32.fromSeed(seed, bitcoin.networks.testnet);

  const pubkeys = [];

  for (let i = 0; i < numberOfKeys; i++) {
    const path = `m/44'/1'/0'/0/${i}`; // Standard BIP44 path for testnet
    const child = root.derivePath(path);
    pubkeys.push(child.publicKey.toString("hex")); // Add public key in compressed format
  }

  return pubkeys;
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

module.exports = generateMultisigAddress;
