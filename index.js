require("dotenv").config();
const { Command, flags } = require("@oclif/command");
const createWallet = require("./src/wallet/create");
const importWallet = require("./src/wallet/import");
const listWallets = require("./src/wallet/list");
const getBalance = require("./src/api/getBalance");
const getTransactions = require("./src/api/getTransactions");
const generateAddress = require("./src/api/generateAddress");

class BitcoinCLI extends Command {
  async run() {
    const { flags } = this.parse(BitcoinCLI);

    try {
      if (flags.create) {
        this.log(`Creating wallet: ${flags.create}`);
        await createWallet(flags.create);
      } else if (flags.import && flags.mnemonic) {
        this.log(`Importing wallet: ${flags.import}`);
        await importWallet(flags.import, flags.mnemonic);
      } else if (flags.list) {
        this.log("Listing all wallets...");
        await listWallets();
      } else if (flags.balance) {
        this.log(`Getting balance for wallet: ${flags.balance}`);
        await getBalance(flags.balance);
      } else if (flags.transactions) {
        this.log(`Getting transactions for wallet: ${flags.transactions}`);
        await getTransactions(flags.transactions);
      } else if (flags.generateAddress) {
        this.log(`Generating address for wallet: ${flags.generateAddress}`);
        await generateAddress(flags.generateAddress);
      } else {
        this.log(
          "Use a valid flag: --create, --import, --list, --balance, --transactions, --generateAddress, --generateMultisig"
        );
      }
    } catch (error) {
      this.log(`Error: ${error.message}`);
    }
  }
}

BitcoinCLI.flags = {
  create: flags.string({ char: "c", description: "Create a new wallet" }),
  import: flags.string({
    char: "i",
    description: "Import a wallet from mnemonic",
  }),
  mnemonic: flags.string({ char: "m", description: "Mnemonic for the wallet" }),
  list: flags.boolean({ char: "l", description: "List all wallets" }),
  balance: flags.string({ char: "b", description: "Get wallet balance" }),
  transactions: flags.string({
    char: "t",
    description: "Get wallet transactions",
  }),
  generateAddress: flags.string({
    char: "g",
    description: "Generate a new address for the wallet",
  }),
};

module.exports = BitcoinCLI;

BitcoinCLI.run().catch(require("@oclif/errors/handle"));
