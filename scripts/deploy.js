// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const {BigNumber} = require("ethers");
const { assertHardhatInvariant } = require("hardhat/internal/core/errors");

async function main() {
  // const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  // const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  // const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  // const lockedAmount = hre.ethers.utils.parseEther("1");

  console.log("Dai")

  const DaiToken = await hre.ethers.getContractFactory("DaiTokenMock");
  const daiToken = await DaiToken.deploy();

  console.log(daiToken.address)

  await daiToken.deployed();

  const EthWallet = await hre.ethers.getContractFactory("EthWallet");
  const ethWallet = await EthWallet.deploy();

  await ethWallet.deployed();

  console.log(ethWallet.address)

  const tx = await daiToken.issueTokens(ethWallet.address, BigNumber.from(4n * 10n**18n))

  const balance = await ethWallet.getBalanceToken(daiToken.address)

  console.log("Balance of Dai: ", balance)

  const tx2 = await ethWallet.transferToken(BigNumber.from(3n * 10n**18n), "0x044f060D389Dc8102430be326C7d45caad02d727", daiToken.address)

  console.log("Daitoken deployed to ", daiToken.address, " and 4 DAI issued ", ethWallet.address, " with tx: ", tx)

  console.log("Transfered token to my wallet with: ", tx2)


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
