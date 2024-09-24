# Bitcoin Wallet CLI Tool

## Features

- **Create Wallet:** Generate a new BIP39 wallet and store it locally.
- **Import Wallet:** Import a wallet using a BIP39 mnemonic phrase.
- **List Wallets:** View all wallets stored locally.
- **Check Balance:** Retrieve the total Bitcoin balance of a wallet.
- **View Transactions:** List all Bitcoin transactions associated with a wallet.
- **Generate Address:** Generate an unused Bitcoin address for a wallet.

## Requirements

- Node.js
- BlockCypher API key

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd bitcoin-wallet-cli
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your BlockCypher API key:

   ```bash
    BLOCKCYPHER_API_KEY=your-api-key
   ```

4. Run the CLI tool:

   ```bash
   node index.js
   ```

## Usage

The CLI tool provides a menu-driven interface for managing Bitcoin wallets. Use the arrow keys to navigate the menu and press `Enter` to select an option.

1. **Create Wallet:** Generate a new BIP39 wallet and store it locally.

2. **Import Wallet:** Import a wallet using a BIP39 mnemonic phrase.

3. **List Wallets:** View all wallets stored locally.

4. **Check Balance:** Retrieve the total Bitcoin balance of a wallet.

5. **View Transactions:** List all Bitcoin transactions associated with a wallet.

6. **Generate Address:** Generate an unused Bitcoin address for a wallet.

## How It Works

1. **Create Wallet:**

```
node index.js --create <wallet-name>
```

- This will generate a new BIP39 mnemonic phrase and store it locally in a JSON file as well as post it on blockcypher.

2. **Import Wallet:**

```
node index.js --import <wallet-name> --mnemonic <mnemonic-phrase>
```

- This will import a wallet using a BIP39 mnemonic phrase and store it locally in a JSON file and post it on blockcypher.

3. **Generate Address:**

```
node index.js --generateAddress <wallet-name>
```

- This will generate an unused Bitcoin address for a wallet and post it on blockcypher.

4. **List Wallets:**

```
node index.js --list
```

- This will list all wallets stored locally.

5. **Check Balance:**

```
node index.js --balance <wallet-name>
```

- This will retrieve the total Bitcoin balance of a wallet.

6. **View Transactions:**

```
node index.js --transactions <wallet-name>
```

- This will list all Bitcoin transactions associated with a wallet.


## Ideal Flow

1. Create a wallet/import a wallet
2. Generate an address
3. List wallets
4. Check balance
5. View transactions