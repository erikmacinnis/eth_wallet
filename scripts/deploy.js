// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const DaiToken = await hre.ethers.getContractFactory("DaiTokenMock")
  const daiToken = await DaiToken.deploy()

  //* I think this waits until it shows up on the blockchain
  await daiToken.deployed()

  console.log("DaiToken deployed to:", daiToken.address);

  const address = "0x044f060D389Dc8102430be326C7d45caad02d727"

  const tx = await daiToken.issueToken(address, 100000000000000)

  console.log("Succefully issued tokens with tx: ", tx)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
