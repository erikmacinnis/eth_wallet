import './App.css';
import {useEffect, useState} from 'react'
import Web3 from 'web3'
const {get, put} = require('./GunHelpers')
const web3 = new Web3("wss://goerli.infura.io/ws/v3/aca94d975f944300980388548bb55d2b")

function App() {

  // set when user is typing in button
  const [password, setPassword] = useState('')
  const [account, setAccount] = useState(null)
  const [encryptedAccount, setEncryptedAccount] = useState(null)

  useEffect(() => {
    try {
      // Inject web3
      window.web3 = web3   

      // Grabbing the user to see if they made an account
      const encryptedAccountStr = localStorage.getItem("as")
      if (encryptedAccountStr) {
        const encryptedAccount = JSON.parse(encryptedAccountStr)
        setEncryptedAccount(encryptedAccount)
      }
    } catch(err) {
      console.log("Error setting up window and user")
    }
  }, [])

  const signUp = (event) => {
    try {
      event.preventDefault()
      //! Could add custom seed phrases
      const tempAccount = web3.eth.accounts.create()
      setAccount(tempAccount)
      const encryptedAccount = tempAccount.encrypt(password)
      const encryptedAccountStr = JSON.stringify(encryptedAccount)
      localStorage.setItem("password", encryptedAccountStr)
      setEncryptedAccount(encryptedAccount)
    } catch(err) {
      console.log("Error signing up: ", err)
    }
  }

  const login = (event) => {
    try {
      event.preventDefault()
      //! what happens when password isn't correct
      const tempUser = web3.eth.accounts.decrypt(encryptedAccount, password)
      console.log(tempUser)
      setAccount(tempUser)
    } catch(err) {
      console.log("Error loging in: ", err)
    }
  }

  const handleChange = event => {
    setPassword(event.target.value)
  }


  const signUpContainer = () => {
    return (
      <form onSubmit={event => signUp(event)}>
        <label htlmfor="signup">SignUp<br/>Enter Your New Password: </label>
        <input type="text" id="signup" name="signup" onChange={handleChange}></input>
        <input type="submit"></input>
      </form>
    )
  }

  const loginContainer = () => {
    return (
      <form onSubmit={event => login(event)}>
        <label htlmfor="tip">Login<br/>Enter Your Password: </label>
        <input type="text" id="tip" name="tip" onChange={handleChange}></input>
        <input type="submit"></input>
      </form>
    )
  }


  return (
    <div className="App">
      <div className="login-signup container">
          {!encryptedAccount && signUpContainer()}
          {encryptedAccount && loginContainer()}
      </div>
    </div>
  );
}

export default App;
