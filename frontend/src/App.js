import './App.css';
import {useEffect, useState} from 'react'
import Web3 from 'web3'
import Swal from 'sweetalert2';
import axios from 'axios'
import { getTokenBalances } from './GetTokenBalances';
import {getNfts} from './GetNFTs';
const web3 = new Web3("wss://goerli.infura.io/ws/v3/aca94d975f944300980388548bb55d2b")
const BN = web3.utils.BN
// infura API key
const apiKey = "AUXP36V38GDIWES9ZZ43MCF42ZGKN3BQBA"
const goerliEndpoint = "https://api-goerli.etherscan.io/"
// const mainnetEndpoint = "https://api.etherscan.io/"

//! Latest password is "erik" 
function App() {

  // set when user is typing in button
  const [password, setPassword] = useState('')
  const [account, setAccount] = useState(null)
  const [encryptedAccount, setEncryptedAccount] = useState(null)
  const [toAddress, setToAddress] = useState('')
  const [toAmt, setToAmt] = useState(0.0)
  const [ethBalance, setEthBalance] = useState(0.0)
  const [tokenInfo, setTokenInfo] = useState(new Map())
  const [nftInfo, setNftInfo] = useState(null)
  const [toNftAddress, setToNftAddress] = useState(null)

  useEffect(() => {
    try {
      // Inject web3
      // window.ethereum = web3   
      // Gets the encrypted password
      const encryptedAccountStr = localStorage.getItem("password")
      if (encryptedAccountStr) {
        const encryptedAccount = JSON.parse(encryptedAccountStr)
        setEncryptedAccount(encryptedAccount)
      }
    } catch(err) {
      console.log("Error setting up window and user: ", err)
    }
  }, [])

  // If you don't have an encrypted account saved in your local storage you'll be asked to sign up
  const signUp = async(event) => {
    try {
      event.preventDefault()
      //TODO Could add custom seed phrases
      // Create brand new keypair
      const tempAccount = web3.eth.accounts.create()
      setAccount(tempAccount)
      // Encrypt account with password
      const encryptedAccount = tempAccount.encrypt(password)
      const encryptedAccountStr = JSON.stringify(encryptedAccount)
      // Stores encrypted account as string in localStorage
      localStorage.setItem("password", encryptedAccountStr)
      setEncryptedAccount(encryptedAccount)
    } catch(err) {
      console.log("Error signing up: ", err)
    }
  }

  // If you have an encrypted account saved in your local storage you can gain access to enrypted account with the appropriate password
  const login = async(event) => {
    try {
      event.preventDefault()
      //TODO what happens when password isn't correct
      const tempAccount = web3.eth.accounts.decrypt(encryptedAccount, password)
      console.log(tempAccount)
      // Gets all info like balance and nfts for the keypair
      await getAccountInfo(tempAccount.address)
      setAccount(tempAccount)
    } catch(err) {
      console.log("Error loging in: ", err)
    }
  }

  // Grabs current blocks gas price
  const getGasTracker = async() => {
    const res = await axios({
      method: 'get',
      url: `${goerliEndpoint}/api?module=gastracker&action=gasoracle&apikey=${apiKey}`
    })
    return res.data.result
  }

  // Grabs accounts eth balance
  const getEthBalance = async(acct) => {
    const res = await axios({
      method: 'get',
      url: `${goerliEndpoint}/api?module=account&action=balance&address=${acct}&tag=latest&apikey=${apiKey}`
    })
    return res.data.result
  }

  // Gets ABI for smart contract so we can interact with smart contract
  const getAbi = async(tokenAddr) => {
    const res = await axios({
        method: 'get',
        url:  `${goerliEndpoint}/api?module=contract&action=getabi&address=${tokenAddr}&apikey=${apiKey}`
    })
    return res.data.result
  }

  // Create instance of contract so we can make smart contract transactions: transfering crypto/nft
  const getInstance = async(tokenAddr) => {
    const abi = await getAbi(tokenAddr)   
    const instance = new web3.eth.Contract(JSON.parse(abi), tokenAddr)
    return instance
  }

  // Gets tokens, eths, and nfts for keypair
  const getAccountInfo = async(acct) => {
    //balances is a mapping
    const tempTokenInfo = await getTokenBalances(acct)
    setTokenInfo(tempTokenInfo)
    const tempNftInfo = await getNfts(acct)
    console.log(tempNftInfo)
    setNftInfo(tempNftInfo.ownedNfts)
    const ethBalanceWei = await getEthBalance(acct)
    const ethBalance = Number(Web3.utils.fromWei(ethBalanceWei, 'ether'));
    setEthBalance(ethBalance)
  }

  // Builds an ethereum transaction 
  const buildTx = (event) => {
    event.preventDefault()
    try {
      // common gas price
      const gas = 21000
      const weiAmt = web3.utils.toWei(toAmt, 'ether')
      console.log("weiAmt: ", weiAmt)
      web3.eth.accounts.signTransaction({
        to: toAddress,
        value: weiAmt,
        gas,
      }, account.privateKey)
      .then( async(transaction) => {
        const gasTracker = await getGasTracker()
        const estimatedGas = web3.utils.fromWei(new BN(gasTracker.SafeGasPrice * gas), 'gwei')
        console.log(parseFloat(estimatedGas))
        const ethAmt = web3.utils.fromWei(new BN(weiAmt), 'ether')
        Swal.fire({
          text: `Estimated gas fee: ${estimatedGas} ETH\nTotal: ${(parseFloat(ethAmt) + parseFloat(estimatedGas)).toFixed(8)}`,
          showCancelButton: true,
          confirmButtonText: "Ok",
      }).then((result) => {
          if (result.isConfirmed) {
            console.log(transaction)
            //* may have to use transactionhash instead
            //* Get funds in there and try it
            web3.eth.sendSignedTransaction(transaction.rawTransaction)
            .on('receipt', console.log)
          }
          else {
              // sets default functionality
              console.log("Not Confirmed")
              return;
          }
      })
      }
      )
    } catch(err) {
      console.log("Failed to build tx: ", err)
    }
  }

  // Transfers crypto token
  const transferToken = async(event, tokenAddr, toAddress, value) => {
    event.preventDefault()
    try {
      // creates instance of token smart contract
      const instance = await getInstance(tokenAddr)
      console.log(instance)
      const decimals =  await instance.methods.decimals().call()
      const amount = value * Math.pow(10, decimals);
      const data = await instance.methods.transfer(toAddress, new BN(amount.toString())).encodeABI()
      // const block = await web3.eth.getBlock("latest", false)
      // const gasLimit = block.gasLimit

      // How much gas I'm willing to pay
      // TODO Make this dynamic to the current amount of gas in the latest block
      const gas = "60000"
      const gasPrice = await web3.eth.getGasPrice()
      const nonce = await web3.eth.getTransactionCount(account.address)
      const chainId = await web3.eth.net.getId()
      web3.eth.accounts.signTransaction({
        nonce,
        chainId,
        to: tokenAddr,
        data,
        value: "0x0",
        gasPrice,
        gas,
      }, account.privateKey)
      .then( async(transaction) => {
        const gasTracker = await getGasTracker()
        console.log("gasTracker: ", gasTracker)
        const estimatedGas = web3.utils.fromWei(new BN(gasPrice), 'ether')
        Swal.fire({
          text: `Estimated gas fee: ${estimatedGas} ETH`,
          showCancelButton: true,
          confirmButtonText: "Ok",
      }).then((result) => {
          if (result.isConfirmed) {
            console.log(transaction)
            //* may have to use transactionhash instead
            //* Get funds in there and try it
            web3.eth.sendSignedTransaction(transaction.rawTransaction)
            .on('receipt', console.log)
          }
          else {
              // sets default functionality
              console.log("Not Confirmed")
              return;
          }
      })
      }
      )
    } catch(err) {
      console.log("Failed to build tx: ", err)
    }
  }

  // transfer an NFT
  const transferNft = async(event, toAddress, index) => {
    event.preventDefault()
    try {
      const tokenAddr = nftInfo[index].contract.address
      const instance = await getInstance(tokenAddr)
      const tokenIdHex = nftInfo[index].id.tokenId
      //! ensure this id is in heX
      const data = await instance.methods.transferFrom(account.address, toAddress, new BN(tokenIdHex)).encodeABI()
      console.log('data: ', data)
      // const block = await web3.eth.getBlock("latest", false)
      // const gasLimit = block.gasLimit

      // TODO make dynamic to current amount of gas used in block
      // Naturally this will require a higher gas price
      const gas = "1000000"
      // TODO should experiment with gas price
      const gasPrice = await web3.eth.getGasPrice()+ "000"
      const nonce = await web3.eth.getTransactionCount(account.address)
      const chainId = await web3.eth.net.getId()
      web3.eth.accounts.signTransaction({
        nonce,
        chainId,
        to: tokenAddr,
        data,
        value: "0x0",
        gasPrice,
        gas,
      }, account.privateKey)
      .then( async(transaction) => {
        console.log("after")
        const gasTracker = await getGasTracker()
        console.log("gasTracker: ", gasTracker)
        const estimatedGas = web3.utils.fromWei(new BN(gasPrice), 'ether')
        Swal.fire({
          text: `Estimated gas fee: ${estimatedGas} ETH`,
          showCancelButton: true,
          confirmButtonText: "Ok",
      }).then((result) => {
          if (result.isConfirmed) {
            console.log(transaction)
            //* may have to use transactionhash instead
            //* Get funds in there and try it
            web3.eth.sendSignedTransaction(transaction.rawTransaction)
            .on('receipt', console.log)
          }
          else {
              // sets default functionality
              console.log("Not Confirmed")
              return;
          }
      })
      }
      )
    } catch(err) {
      console.log("Failed to build tx: ", err)
    }
  }

  const handleChangePass = event => {
    setPassword(event.target.value)
  }

  const handleChangeAddress = event => {
    setToAddress(event.target.value)
  }

  const handleChangeNftAddress = event => {
    setToNftAddress(event.target.value)
  }

  const handleChangeTxAmt = event => {
    setToAmt(event.target.value)
  }

  const signUpContainer = () => {
    return (
      <form onSubmit={event => signUp(event)}>
        <label htlmfor="signup">SignUp<br/>Enter Your New Password: </label>
        <input type="text" id="signup" name="signup" onChange={handleChangePass}></input>
        <input type="submit"></input>
      </form>
    )
  }

  const loginContainer = () => {
    return (
      <form onSubmit={event => login(event)}>
        <label htlmfor="login">Login<br/>Enter Your Password: </label>
        <input type="text" id="login" name="login" onChange={handleChangePass}></input>
        <input type="submit"></input>
      </form>
    )
  }

  const loggedInContainer = () => {
    return (
      <div>
        <div>
          <h2>Address:</h2>
          {account.address}
        </div>
        <br/>
        <div>
          <h1>Token Balances: </h1>
          <h2>{ethBalance.toFixed(5)} ETH</h2>
          <form onSubmit={event => buildTx(event)}>
          <legend htlmfor="send-tx">Send Eth: </legend>
          <br/>
          <label htlmfor="to-address">To: </label>
          <input type="text" id="to-address" name="to-address" onChange={handleChangeAddress}></input>
          <br/><br/>
          <label htlmfor="value">Amount: </label>
          <input type="text" id="value" name="value" onChange={handleChangeTxAmt}></input>
          <br/><br/>
          <input type="submit"></input>
        </form>
        <div>
          <h2>Token Assets: </h2>
          {Object.keys(tokenInfo).map((key) => {
            console.log(key)
            const value = tokenInfo[key]
            console.log(value)
            return(
              <form key={key}
                onSubmit={event => {
                transferToken(event, value[1], toAddress, toAmt)
              }}>
                <h4 key="key">{key}: {tokenInfo[key][0].toFixed(5)}</h4>
                <legend htlmfor="send-tx">Send {key}: </legend>
                <br/>
                <label htlmfor="to-address">To: </label>
                <input type="text" id="to-address" name="to-address" onChange={handleChangeAddress}></input>
                <br/><br/>
                <label htlmfor="value">Amount: </label>
                <input type="text" id="value" name="value" onChange={handleChangeTxAmt}></input>
                <br/><br/>
                <input type="submit"></input>
              </form>
            ) 
            })
          }
          </div>
          <div>
            <h2>NFT Assets: </h2>
            {nftInfo.map((nft, index) => {
              const metadata = nft.metadata
              console.log(metadata)
            return (
            <form key={index}
              onSubmit={event => {
                transferNft(event, toNftAddress, index)
              }}>
                <h2 key={`${index}1`}>Name: {metadata.name}</h2>
                <h4 key={`${index}2`}>Description {metadata.description}</h4>
                <img src={metadata.image} alt="nft" width="500" height="800"/>
                <legend htlmfor="send-tx">Send {metadata.name}: </legend>
                <br/>
                <label htlmfor="to-address">To: </label>
                <input type="text" id="to-address" name="to-address" onChange={handleChangeNftAddress}></input>
                <br/><br/>
                <input type="submit"></input>
              </form>
            )
            })}
          </div>
        </div>
      </div>
    )
  }

  if (!account) {
    return (
      <div className="App">
        <div className="login-signup-container">
            {!encryptedAccount && signUpContainer()}
            {encryptedAccount && loginContainer()}
        </div>
      </div>
    );
  } else {
    return (
      <div className="App">
        <div className="logged-in-container">
          {loggedInContainer()}
        </div>
      </div>
    )
  }
}

export default App;
