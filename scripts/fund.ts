import hre from "hardhat";

async function main() {
  const signer = (await hre.ethers.getSigners())[0];
  const disperserAddress = "0xYourDeployedAddress";

  const tx = await signer.sendTransaction({
    to: disperserAddress,
    value: hre.ethers.parseEther("1.0"),
  });

  await tx.wait();
  console.log("Disperser funded.");
}

main().catch(console.error);
