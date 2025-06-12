import type { HardhatUserConfig } from "hardhat/config";
import { CONFIG } from "./config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      metadata: {
        bytecodeHash: "none", // disable ipfs
        useLiteralContent: true, // use source code
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
    monadTestnet: {
      url: "https://testnet-rpc.monad.xyz",
      chainId: 10143,
      accounts: [CONFIG.PRIVATE_KEY],
    },
  },
  sourcify: {
    enabled: true,
    // apiUrl: "https://sourcify.parsec.finance", browserUrl: "https://purrsec.com" // uncomment for megaeth
    apiUrl: "https://sourcify-api-monad.blockvision.org",
    browserUrl: "https://testnet.monadexplorer.com", // uncomment for monad
  },
  etherscan: {
    enabled: false,
    // apiKey: CONFIG.ETHERSCAN_API_KEY,
  },
};

export default config;
