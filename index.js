require("dotenv").config();
const { Command, flags } = require("@oclif/command");
const inquirer = require("inquirer");

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
        // If no flags are provided, start interactive mode
        await this.showInteractivePrompt();
      }
    } catch (error) {
      this.log(`Error: ${error.message}`);
    }
  }

  async showInteractivePrompt() {
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "Select an action:",
        choices: [
          { name: "Create a new wallet", value: "create" },
          { name: "Import a wallet from mnemonic", value: "import" },
          { name: "List all wallets", value: "list" },
          { name: "Get balance of a wallet", value: "balance" },
          { name: "Get transactions of a wallet", value: "transactions" },
          {
            name: "Generate a new address for a wallet",
            value: "generateAddress",
          },
        ],
      },
      {
        type: "input",
        name: "walletName",
        message: "Enter the wallet name:",
        when: (answers) =>
          [
            "create",
            "import",
            "balance",
            "transactions",
            "generateAddress",
          ].includes(answers.action),
      },
      {
        type: "input",
        name: "mnemonic",
        message: "Enter the mnemonic phrase:",
        when: (answers) => answers.action === "import",
      },
    ]);

    // Execute the corresponding action
    switch (answers.action) {
      case "create":
        this.log(`Creating wallet: ${answers.walletName}`);
        await createWallet(answers.walletName);
        break;
      case "import":
        this.log(`Importing wallet: ${answers.walletName}`);
        await importWallet(answers.walletName, answers.mnemonic);
        break;
      case "list":
        this.log("Listing all wallets...");
        await listWallets();
        break;
      case "balance":
        this.log(`Getting balance for wallet: ${answers.walletName}`);
        await getBalance(answers.walletName);
        break;
      case "transactions":
        this.log(`Getting transactions for wallet: ${answers.walletName}`);
        await getTransactions(answers.walletName);
        break;
      case "generateAddress":
        this.log(`Generating address for wallet: ${answers.walletName}`);
        await generateAddress(answers.walletName);
        break;
      default:
        this.log("Unknown action selected.");
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
