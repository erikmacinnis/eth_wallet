const ethers = require("ethers");

const ERC20_ABI = [
    "function issueTokens(address receiver, uint256 amount) public" 
]

const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/d833143ef4714318b079b50a26a86c0f")

const signer = provider.getSigner()

const daiTokenAddress = "0xd87F40Cc3237A26E1B9b1ed996f2aC19fFb42aA4"

const address = "0x044f060D389Dc8102430be326C7d45caad02d727"

async function main() {

    const daiToken = new ethers.Contract(daiTokenAddress, ERC20_ABI, signer)

    const tx = await daiToken.issueToken(address, 100)

    console.log("Succefully issued tokens with tx: ", tx)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
