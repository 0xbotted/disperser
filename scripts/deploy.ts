import hre from "hardhat";

async function main() {
  const Disperser = await hre.ethers.getContractFactory("Disperser");
  const disperser = await Disperser.deploy();
  await disperser.waitForDeployment();
  const disperserAddress = await disperser.getAddress();
  console.log("Deployed Disperser to:", disperserAddress);

  // const Token = await hre.ethers.getContractFactory("MockERC20");
  // const token = await Token.deploy();
  // await token.waitForDeployment();
  // const tokenAddress = await token.getAddress();
  // console.log("Deployed MockERC20 to:", tokenAddress);

  // Wait for a few block confirmations to make sure it's indexed on Etherscan
  console.log("Waiting for 5 confirmations before verifying...");
  await disperser.deploymentTransaction()?.wait(5);
  // await token.deploymentTransaction()?.wait(5);

  // Verify Disperser (no constructor args)
  await hre.run("verify:verify", {
    address: disperserAddress,
    constructorArguments: [],
  });

  // Verify Token (no constructor args in your MockERC20)
  // await hre.run("verify:verify", {
  //   address: tokenAddress,
  //   constructorArguments: [],
  // });

  console.log("Both contracts verified!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
