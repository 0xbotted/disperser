import type { HardhatUserConfig } from "hardhat/config";
import { CONFIG } from "./config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
  paths: {
    sources: "./contract",
  },
  networks: {
    goerli: {
      url: CONFIG.RPC_URL,
      accounts: [CONFIG.PRIVATE_KEY],
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
  },
};

export default config;
