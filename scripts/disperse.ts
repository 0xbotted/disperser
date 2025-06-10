import hre from "hardhat";

async function main() {
  const disperserAddress = "0xYourDeployedAddress";
  const disperser = await hre.ethers.getContractAt("Disperser", disperserAddress);

  const recipients = ["0xAddress1...", "0xAddress2..."];

  const amount = hre.ethers.parseEther("0.01");

  const balance = await disperser.getBalance();
  const total = amount * BigInt(recipients.length);

  if (balance.lt(total)) {
    throw new Error("Insufficient contract balance");
  }

  const tx = await disperser.disperse(recipients, amount);
  await tx.wait();
  console.log("Dispersed ETH to recipients.");
}

main().catch(console.error);
