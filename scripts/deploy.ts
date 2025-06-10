import { ethers } from "hardhat";

async function main() {
  const Disperser = await ethers.getContractFactory("Disperser");
  const disperser = await Disperser.deploy();

  await disperser.waitForDeployment();
  console.log("Disperser deployed to:", await disperser.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
