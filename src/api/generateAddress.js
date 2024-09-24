const bip39 = require('bip39');
const bitcoin = require('bitcoinjs-lib');
const BIP32Factory = require('bip32').default;
const ecc = require('tiny-secp256k1');
const fs = require('fs');
const path = require('path');

const bip32 = BIP32Factory(ecc);

const walletsFile = path.join(__dirname, '../../wallets.json');

const generateAddress = async (walletName) => {
  const wallets = loadWallets();
  const wallet = wallets[walletName];

  if (!wallet) {
    throw new Error(`Wallet "${walletName}" not found.`);
  }

  const mnemonic = wallet.mnemonic;

  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic provided.');
  }

  const seed = await bip39.mnemonicToSeed(mnemonic);
  console.log('Seed generated:', seed.toString('hex'));

  const root = bip32.fromSeed(seed);

  const path = `m/44'/1'/0'/0/${wallet.addresses ? wallet.addresses.length : 0}`; // Testnet path
  const child = root.derivePath(path);
  const { address } = bitcoin.payments.p2pkh({ pubkey: child.publicKey, network: bitcoin.networks.testnet });  // Ensure it's for testnet

  if (!wallet.addresses) {
    wallet.addresses = [];
  }

  wallet.addresses.push(address);
  saveWallets(wallets);
  console.log(`New address generated for wallet "${walletName}": ${address}`);
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

module.exports = generateAddress;