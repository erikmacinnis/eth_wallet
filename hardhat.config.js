require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers");
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.10",
  networks:{
    goerli:{
      url: "https://goerli.infura.io/v3/e74aebcb315d408089b16cb32f4e5f69",
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  },
  etherscan: {
    apiKey: "AUXP36V38GDIWES9ZZ43MCF42ZGKN3BQBA"
  }
};