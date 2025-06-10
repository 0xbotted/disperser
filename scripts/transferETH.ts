import hre from "hardhat";

async function main() {
  const [sender, ...recipients] = await hre.ethers.getSigners();

  const disperser = await hre.ethers.getContractAt("Disperser", sender);
  const amount = hre.ethers.parseEther("0.01");
  const total = amount * BigInt(3);

  const tx = await disperser.disperseETH(
    recipients.slice(0, 3).map(r => r.address),
    amount,
    { value: total }
  );

  console.log("Sending ETH...");
  await tx.wait();
  console.log("✅ Dispersed!");
}

main().catch(console.error);
