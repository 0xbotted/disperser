import hre from "hardhat";

async function main() {
  const Disperser = await hre.ethers.getContractFactory("Disperser");
  const disperser = await Disperser.deploy();
  await disperser.deployed();

  console.log("Deployed to:", disperser.address);
}

main().catch(console.error);
