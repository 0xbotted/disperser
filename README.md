# Disperser

A simple and gas-efficient smart contract to distribute ETH or ERC20 tokens to multiple addresses in a single transaction.  
Built as a learning project while exploring Solidity and Web3 development.

---

## 🚀 What It Does

- ✅ Disperse **ETH** or **ERC20** tokens to many recipients  
- ✅ Efficient batch sending in one transaction  
- ✅ Includes test coverage and local mock contracts  
- ✅ Written in Solidity + Hardhat + TypeScript

---

## 🧱 Project Setup

Clone the repo and install dependencies:

```bash
npm install
```

Compile the contracts:

```bash
npx hardhat compile
```

Run tests:

```bash
npx hardhat test
```

Deploy the contract:

```bash
npx hardhat run scripts/deploy.ts --network <network-name>
```

---

## 💻 Tech Stack

- Solidity
- Hardhat
- TypeScript
- ethers.js
- TypeChain
- solmate (for lightweight ERC20)

---

## 📁 File Structure

```
contracts/           # Solidity contracts (Disperser, MockERC20)
scripts/             # Deployment scripts
test/                # Tests for ETH & ERC20 disperse logic
typechain-types/     # Type-safe contract bindings
config.ts            # Project-wide settings
DISPERSER_CA.md      # Deployed contract address
```

---

## 🙋 About the Author

> 👤 **0xbotted**  
> I'm new to Web3 and learning Solidity while building real projects — with a lot of help from GPT!  
> Follow me on GitHub/Twitter: [@0xbotted](https://github.com/0xbotted)

---

## 📜 License

MIT