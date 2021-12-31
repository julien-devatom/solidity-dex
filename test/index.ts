import { expect } from "chai";
import { ethers } from "hardhat";
import { formatBytes32String } from "ethers/lib/utils";
import { BigNumber, BigNumberish, Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Dex", function () {
  // initial balance use for init balance of each traders
  const initialBalance = BigNumber.from("1000");
  let dex: Contract;

  // tokens
  let tokensContracts: Contract[];

  // signers
  let owner: SignerWithAddress;
  let trader1: SignerWithAddress;
  let trader2: SignerWithAddress;
  let simpleUser: SignerWithAddress;
  const tokens = ["DAI", "WETH", "BAT"];
  const [DAI, WETH, BAT] = tokens.map(formatBytes32String);
  before(async () => {
    console.log("Deploy contracts");
    [owner, trader1, trader2, simpleUser] = await ethers.getSigners();
    const Dex = await ethers.getContractFactory("Dex");
    dex = await Dex.deploy();
    await dex.deployed();
    // deploy ERC20 Mocks
    tokensContracts = await Promise.all(
      tokens.map((t) =>
        ethers
          .getContractFactory(t)
          .then((factory) => factory.deploy())
          .then((c) => c.deployed())
      )
    );
    // add ERCTokens to the Dex.
    await Promise.all(
      tokensContracts.map((tokenContract, i) =>
        dex
          .connect(owner)
          .addToken(formatBytes32String(tokens[i]), tokenContract.address)
          .then((tx: { wait: () => any }) => tx.wait())
      )
    );

    const faucet = async (
      trader: SignerWithAddress,
      contract: Contract,
      amount: BigNumberish
    ) =>
      contract
        .faucet(trader.address, amount)
        .then((tx: { wait: () => any }) => tx.wait());
    const allowance = async (
      trader: SignerWithAddress,
      contract: Contract,
      amount: BigNumberish
    ) =>
      contract
        .connect(trader)
        .approve(dex.address, amount)
        .then((tx: { wait: () => any }) => tx.wait());

    // add token balance to traders
    // trader 1 & 2 have 1000 (in wei) tokens & 1000 (in wei) tokens of allowance to the dex contract initially, for each token
    await Promise.all(
      [trader1, trader2].map(
        async (trader) =>
          await Promise.all(
            tokensContracts.map((contract) =>
              faucet(trader, contract, initialBalance).then(() =>
                allowance(trader, contract, initialBalance)
              )
            )
          )
      )
    );
  });

  describe("Init markets", () => {
    it("should be created only by owner", async () => {
      expect(await dex.owner()).to.equal(owner.address);
      // eslint-disable-next-line no-unused-expressions
      expect(dex.connect(trader2).addToken(DAI, tokensContracts[0].address)).to
        .be.reverted;
    });
    it("should get correct tokens", async () => {
      const tokens = await dex.getTokens();
      expect(tokens).to.have.lengthOf(3);
      expect(tokens[0].ticker).to.be.equal(DAI);
      expect(tokens[0].tokenAddress).to.be.equal(tokensContracts[0].address);
      expect(tokens[1].ticker).to.be.equal(WETH);
      expect(tokens[2].ticker).to.be.equal(BAT);
    });
    it("should traders have correct initial balance", async () => {
      expect(await tokensContracts[0].balanceOf(trader1.address)).to.be.equal(
        initialBalance
      );
      expect(await tokensContracts[0].balanceOf(trader2.address)).to.be.equal(
        initialBalance
      );
      expect(
        await tokensContracts[0].balanceOf(simpleUser.address)
      ).to.be.equal(BigNumber.from("0"));
    });
    it("should traders have correct allowance", async () => {
      expect(
        await tokensContracts[0].allowance(trader1.address, dex.address)
      ).to.be.equal(initialBalance);
      expect(
        await tokensContracts[0].allowance(trader2.address, dex.address)
      ).to.be.equal(initialBalance);
      expect(
        await tokensContracts[0].allowance(simpleUser.address, dex.address)
      ).to.be.equal(BigNumber.from("0"));
    });
  });

  describe("Test deposit function", () => {
    it("Should revert unknown token", async () => {
      expect(
        dex
          .connect(trader1)
          .deposit(BigNumber.from(10), formatBytes32String("REP"))
      ).to.be.revertedWith("token does not exist");
    });
    it("Should transfer DAI balance of trader", async () => {
      await dex
        .connect(trader1)
        .deposit(BigNumber.from(10), formatBytes32String("DAI"))
        .then((tx: { wait: () => any }) => tx.wait());
      expect(await tokensContracts[0].balanceOf(trader1.address)).to.be.equal(
        initialBalance.sub(BigNumber.from(10))
      );
      expect(await tokensContracts[0].balanceOf(dex.address)).to.be.equal(
        BigNumber.from(10)
      );
    });
    it("Should be reverted if not allowance", async () => {
      expect(
        dex
          .connect(simpleUser)
          .deposit(BigNumber.from(10), formatBytes32String("DAI"))
      ).to.be.reverted;
    });
  });
});
