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

  // console.log("Dai")
  console.log("Deploying TicketFactory")

  // const walletAddress = "0x4a87B68C857025DD47043e6d0CD116EF066B5B82"

  // const DaiToken = await hre.ethers.getContractFactory("DaiTokenMock");
  // const daiToken = await DaiToken.deploy();

  const TicketFactory = await hre.ethers.getContractFactory("TicketFactory")
  console.log("TicketFactory: ", TicketFactory)
  const ticketFactory = await TicketFactory.deploy()

  console.log("ticketFactory: ", ticketFactory)
  // console.log(daiToken.address)
  console.log(ticketFactory.address)
  //Dai address = 0x6F583f4f68235f759e81ec8EF8445b379aCAD3d7
  // await daiToken.deployed();

  // TicketFactory Address = 0x0206DCEe3c13bF2494465CA19A5E4C77C9194cC6

  await ticketFactory.deployed();

  const tx = await ticketFactory.newTicketCollection(BigNumber.from(10), "First", "FRST")

  console.log(tx)

  // const EthWallet = await hre.ethers.getContractFactory("EthWallet");
  // const ethWallet = await EthWallet.deploy();

  // await ethWallet.deployed();

  // console.log(ethWallet.address)

  // const tx = await daiToken.issueTokens(walletAddress, BigNumber.from(4n * 10n**18n))

  // console.log(tx)
  // const balance = await getBalanceToken(daiToken.address)

  // console.log("Balance of Dai: ", balance)

  // const tx2 = await ethWallet.transferToken(BigNumber.from(3n * 10n**18n), "0x044f060D389Dc8102430be326C7d45caad02d727", daiToken.address)

  // console.log("Daitoken deployed to ", daiToken.address, " and 4 DAI issued ", ethWallet.address, " with tx: ", tx)

  // console.log("Transfered token to my wallet with: ", tx2)


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
