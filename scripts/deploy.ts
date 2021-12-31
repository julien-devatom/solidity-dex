import { ethers } from "hardhat";
import { formatBytes32String } from "ethers/lib/utils";
import config from "../config/ropsten.json";
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying DEX Smart contract to Ropsten");
  console.log("Deployer account is ", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  console.log("Waiting for deployment...");
  const Dex = await ethers.getContractFactory("Dex");
  const dex = await Dex.deploy({
    gasLimit: 5000000,
  });

  await dex.deployed();

  console.log("Yeah !!! DEX deployed to", dex.address);

  console.log("\n Add DAI, USDC and BAT tokens to the contract...");
  // add tokens
  console.log("Adding DAI...");
  await dex
    .addToken(
      formatBytes32String(config.tokens.DAI.ticker),
      config.tokens.DAI.address
    )
    .then((tx) => tx.wait());
  console.log("DAI added !");
  console.log("Adding USDC...");
  await dex
    .addToken(
      formatBytes32String(config.tokens.USDC.ticker),
      config.tokens.USDC.address
    )
    .then((tx) => tx.wait());
  console.log("USDC added !");
  console.log("Adding BAT...");
  await dex
    .addToken(
      formatBytes32String(config.tokens.BAT.ticker),
      config.tokens.BAT.address
    )
    .then((tx) => tx.wait());
  console.log("Markets added successfully");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
