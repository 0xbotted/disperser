import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { Disperser, MockERC20 } from "../typechain-types";
import { Signer } from "ethers";

describe("Disperser", function () {
  let disperser: Disperser;
  let token: MockERC20;
  let owner: Signer;
  let recipientSigners: Signer[];
  let recipients: string[];

  beforeEach(async () => {
    // const signers = await ethers.getSigners();
    // owner = signers[0];
    // recipientSigners = signers.slice(1, 4);
    // recipients = recipientSigners.map((s) => s.address);
    [owner, ...recipientSigners] = await ethers.getSigners();
    recipients = await Promise.all(recipientSigners.map((r) => r.getAddress())); // ✅

    const DisperserFactory = await hre.ethers.getContractFactory("Disperser");
    disperser = await DisperserFactory.deploy();

    const TokenFactory = await hre.ethers.getContractFactory("MockERC20");
    token = await TokenFactory.deploy();
    await token.mint(await owner.getAddress(), hre.ethers.parseEther("100"));
  });

  it("should disperse ETH equally", async () => {
    const amount = hre.ethers.parseEther("0.01");
    const total = amount * BigInt(recipients.length);

    const tx = await disperser.disperseETH(recipients, amount, {
      value: total,
    });
    await tx.wait();

    for (const recipient of recipients) {
      const bal = await hre.ethers.provider.getBalance(recipient);
      expect(bal).to.equal(amount);
    }
  });

  it("should fail if msg.value is incorrect", async () => {
    const amount = hre.ethers.parseEther("0.01");
    const badTotal = amount * BigInt(2); // should be 3

    await expect(
      disperser.disperseETH(recipients, amount, {
        value: badTotal,
      })
    ).to.be.revertedWith("Incorrect msg.value");
  });

  it("should disperse ERC20 tokens", async () => {
    const amount = hre.ethers.parseEther("1");
    const total = amount * BigInt(recipients.length);

    await token.approve(await disperser.getAddress(), total);

    const tx = await disperser.disperseERC20(await token.getAddress(), recipients, amount);
    await tx.wait();

    for (const r of recipients) {
      const bal = await token.balanceOf(r);
      expect(bal).to.equal(amount);
    }
  });

  it("should revert if transferFrom fails", async () => {
    const badAmount = hre.ethers.parseEther("1000"); // exceeds balance
    await token.approve(await disperser.getAddress(), badAmount);

    await expect(disperser.disperseERC20(await token.getAddress(), recipients, badAmount)).to.be.revertedWith(
      "ERC20 transfer failed"
    );
  });
});
