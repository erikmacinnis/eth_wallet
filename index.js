const bip39 = require('bip39')
const Wallet = require('ethereumjs-wallet').default
const { hdkey } = require('ethereumjs-wallet')
const {EthereumProvider} = require("eip1193-provider")
const { Chain, Common, Hardfork } = require('@ethereumjs/common')
const { FeeMarketEIP1559Transaction } = require('@ethereumjs/tx')
const {formatJsonRpcRequest} = require("@json-rpc-tools/utils")
const Web3 = require('web3')
var Personal = require('web3-eth-personal');
var web3 = new Web3("wss://goerli.infura.io/ws/v3/aca94d975f944300980388548bb55d2b")
var personal = new Personal("wss://goerli.infura.io/ws/v3/aca94d975f944300980388548bb55d2b")

const App = async () => {

    // address = await web3.eth.personal.newAccount("abc123")

    // console.log(address)

    const readUser = () => {
        const data = fs.readFileSync(path, {encoding: 'utf-8', flag: 'r'})
        return data
    }

    const common = new Common({chain: Chain.Mainnet, hardfork: Hardfork.London})
    console.log(common)
    console.log(FeeMarketEIP1559Transaction)

    //* A central Rpc connection could deploy the contract
    //! can probobly just use something like ethers
    // var provider, chainId
    // try {
    //     provider = new EthereumProvider("wss://goerli.infura.io/ws/v3/aca94d975f944300980388548bb55d2b")

    //     chainId = await provider.request(formatJsonRpcRequest("eth_accounts", []))
    // } catch(err){
    //     console.error(err)
    // }


    // console.log("Provider: ", provider)
    // console.log("ChainID: ", chainId)

    // console.log("After")

    const mnemonic = bip39.generateMnemonic()
    const seed = bip39.mnemonicToSeedSync(mnemonic)
    
    // const ethHdKey = hdkey.fromMasterSeed(seed)

    // const wallet = ethHdKey.getWallet()

    // const pubKey = wallet.getPublicKey()

    // const password = "hello"

    // // localStorage.setItem("")

    // // create tx

    // const common = new Common({chain: Chain.Goerli, hardfork: Hardfork.London})
    // const txData = {}
    // // Create transaction from smart contract

    // const tx = FeeMarketEIP1559Transaction.fromTxData(txData, {common})

    // const signedTx = tx.sign(Buffer.from(PRIV_KEY, 'hex'))

    // Once I deploy the contract I can use contract signer as a 
    // contract.provider.getSigner('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')

}

App()