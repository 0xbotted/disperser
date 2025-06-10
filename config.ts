import dotenv from "dotenv";
dotenv.config();

export const CONFIG = {
  PRIVATE_KEY: process.env.PRIVATE_KEY as string,
  RPC_URL: process.env.RPC_URL as string,
  ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY as string,
};
