import { expect } from "chai";
import { ethers } from "hardhat";

describe("Dex", function () {
  it("Should be deployed correctly", async function () {
    const Dex = await ethers.getContractFactory("Dex");
    const dex = await Dex.deploy();
    await dex.deployed();

    const [owner] = await ethers.getSigners();
    expect(await dex.owner()).to.equal(owner.address);
  });
});
