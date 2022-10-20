// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const {BigNumber} = require("ethers")

async function main() {
  // const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  // const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  // const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  // const lockedAmount = hre.ethers.utils.parseEther("1");

  const DaiToken = await hre.ethers.getContractFactory("DaiTokenMock");
  const daiToken = await DaiToken.deploy();

  await daiToken.deployed();

  const tx = await daiToken.issueTokens("0x044f060D389Dc8102430be326C7d45caad02d727", BigNumber.from(4n * 10n**18n))

  console.log("Daitoken deployed to ", daiToken.address, " and 4 DAI issued with ", tx)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
