const bip39 = require('bip39')
const Wallet = require('ethereumjs-wallet').default
const { hdkey } = require('ethereumjs-wallet')

const App = () => {
    const mnemonic = bip39.generateMnemonic()
    const seed = bip39.mnemonicToSeedSync(mnemonic)
    
    const ethHdKey = hdkey.fromMasterSeed(seed)

    const wallet = ethHdKey.getWallet()

    const pubKey = wallet.getPublicKey()

    console.log(wallet)
}

App()