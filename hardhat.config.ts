import type { HardhatUserConfig } from "hardhat/config";
import { CONFIG } from "./config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
  paths: {
    sources: "./contracts",
  },
  networks: {
    base_sepolia: {
      url: CONFIG.RPC_URL,
      accounts: [CONFIG.PRIVATE_KEY],
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
  },
  sourcify: { enabled: true },
  etherscan: {
    apiKey: CONFIG.ETHERSCAN_API_KEY,
  },
};

export default config;
