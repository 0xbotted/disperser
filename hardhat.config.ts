import type { HardhatUserConfig } from "hardhat/config";
import { CONFIG } from "./config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";

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
    mega_eth: {
      url: "https://carrot.megaeth.com/rpc",
      accounts: [CONFIG.PRIVATE_KEY],
    },
    hype: {
      url: "https://rpc.hypurrscan.io",
      accounts: [CONFIG.PRIVATE_KEY],
    },
    monad: {
      url: "https://testnet-rpc.monad.xyz",
      accounts: [CONFIG.PRIVATE_KEY],
    },
  },
  sourcify: {
    enabled: true,
    // apiUrl: "https://sourcify.parsec.finance", browserUrl: "https://purrsec.com" // uncomment for megaeth
  },
  etherscan: {
    apiKey: CONFIG.ETHERSCAN_API_KEY,
  },
};

export default config;
