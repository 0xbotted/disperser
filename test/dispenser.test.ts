import { expect } from "chai";
import hre from "hardhat";
import { Disperser, MockERC20 } from "../typechain-types";
import { Signer, recoverAddress } from "ethers";

describe("Disperser", function () {
  let disperser: Disperser;
  let token: MockERC20;
  let owner: Signer;
  let recipients: Signer[];

  beforeEach(async () => {
    const signers = await hre.ethers.getSigners();
    owner = signers[0];
    recipients = signers.slice(1, 4); // Get exactly 3

    const DisperserFactory = await hre.ethers.getContractFactory("Disperser");
    disperser = await DisperserFactory.deploy();

    const TokenFactory = await hre.ethers.getContractFactory("MockERC20");
    token = await TokenFactory.deploy();
    await token.mint(await owner.getAddress(), hre.ethers.parseEther("100"));
  });

  it("disperses ETH correctly", async () => {
    const amount = hre.ethers.parseEther("0.0001");
    const total = amount * BigInt(recipients.length);

    const recipientAddresses = await Promise.all(recipients.map((r) => r.getAddress()));

    // const tx = await disperser.disperseETH(recipientAddresses, amount, { value: total });
    // await tx.wait();

    const balancesBefore = await Promise.all(recipientAddresses.map((a) => hre.ethers.provider.getBalance(a)));

    // await disperser.disperseETH(recipientAddresses, amount, { value: total });

    const tx = await disperser.disperseETH(recipientAddresses, amount, { value: total });
    await tx.wait();

    const balancesAfter = await Promise.all(recipientAddresses.map((a) => hre.ethers.provider.getBalance(a)));

    for (let i = 0; i < recipients.length; i++) {
      expect(balancesAfter[i] - balancesBefore[i]).to.equal(amount);
    }

    // for (const recipient of recipientAddresses) {
    //   const balance = await hre.ethers.provider.getBalance(recipient);
    //   expect(balance).to.equal(amount);
    // }
  });

  it("fails if ETH msg.value is incorrect", async () => {
    const amount = hre.ethers.parseEther("0.01");
    const badTotal = amount * BigInt(recipients.length) - 1n; // incorrect value

    const recipientAddresses = await Promise.all(recipients.map((r) => r.getAddress()));

    await expect(disperser.disperseETH(recipientAddresses, amount, { value: badTotal })).to.be.revertedWith(
      "Disperser: Disperse Amount and Sent amount are not equal"
    );
  });

  it("disperses ERC20 tokens", async () => {
    const amount = hre.ethers.parseEther("1");
    const toSend = amount * BigInt(recipients.length);
    await token.approve(await disperser.getAddress(), toSend);
    const recipientAddresses = await Promise.all(recipients.map((r) => r.getAddress()));

    const tx = await disperser.disperseERC20(await token.getAddress(), recipientAddresses, amount);
    const receipt = await tx.wait();
    console.log(receipt?.logs);

    for (const r of recipients) {
      const bal = await token.balanceOf(await r.getAddress());
      expect(bal).to.equal(amount);
    }
  });

  it("fails ERC20 if transferFrom fails", async () => {
    const amount = hre.ethers.parseEther("1");
    const recipientAddresses = await Promise.all(recipients.map((r) => r.getAddress()));

    // Approve too little on purpose
    await token.approve(await disperser.getAddress(), hre.ethers.parseEther("1")); // 1 < 3

    await expect(disperser.disperseERC20(await token.getAddress(), recipientAddresses, amount)).to.be.revertedWith(
      "Disperser: ERC20 transferFrom failed"
    );
  });

  it("disperses ERC20 tokens using permit", async () => {
    const amount = hre.ethers.parseEther("1");
    const totalAmount = amount * BigInt(recipients.length);
    const recipientAddresses = await Promise.all(recipients.map((r) => r.getAddress()));

    const [ownerWallet] = await hre.ethers.getSigners();
    const nonce = await token.nonces(ownerWallet.address);
    const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

    const permitData = {
      owner: ownerWallet.address,
      spender: await disperser.getAddress(),
      value: totalAmount,
      nonce,
      deadline,
    };

    // Use EIP-712 signature for permit
    const domain = {
      name: await token.name(),
      version: "1",
      chainId: (await hre.ethers.provider.getNetwork()).chainId,
      verifyingContract: await token.getAddress(),
    };

    const types = {
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    };

    const signature = await ownerWallet.signTypedData(domain, types, permitData);
    const { v, r, s } = hre.ethers.Signature.from(signature);

    const tx = await disperser.disperseERC20WithPermit(
      await token.getAddress(),
      recipientAddresses,
      amount,
      deadline,
      v,
      r,
      s
    );
    const receipt = await tx.wait();
    console.log(receipt?.logs);

    for (const r of recipients) {
      const bal = await token.balanceOf(await r.getAddress());
      expect(bal).to.equal(amount);
    }
  });

  it("fails disperseERC20WithPermit if signature is invalid", async () => {
    const amount = hre.ethers.parseEther("1");
    const deadline = Math.floor(Date.now() / 1000) + 3600;

    const recipientAddresses = await Promise.all(recipients.map((r) => r.getAddress()));

    // Fake signature
    const v = 27;
    const r = hre.ethers.ZeroHash;
    const s = hre.ethers.ZeroHash;

    await expect(
      disperser.disperseERC20WithPermit(await token.getAddress(), recipientAddresses, amount, deadline, v, r, s)
    ).to.be.reverted; // or check for specific revert reason if applicable
  });
});
