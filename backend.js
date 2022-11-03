const SEA = require('gun/sea');
const GUN = require('gun');
const fs = require('fs');
require('dotenv').config()
const path = "password.json"
var user;
// var remoteUser;
// var user = gun.user()

//TODO Implement proper authentication protocol for user info
const main = async () => {
  
  await login();

  var WebSocketServer = require('ws').Server

  , wss = new WebSocketServer({ port: 8080 });

  wss.on('connection', function connection(peer){

    peer.on('message', async function incoming(data){

      console.log('received:', data.toString());
      const arrData = data.toString().split("<>")

      const command = arrData[0]

      console.log("Command: ", command)

      var returned = "";

      if (command.localeCompare("putEncrypt") === 0) {
        console.log("Entering putEncrypt")
        const info = arrData[arrData.length - 2]
        const epub = arrData[arrData.length - 1]
        const buckets = arrData.slice(1, arrData.length-2)
        //* replace remoteUser.epub with epub after testing
        await putEncrypt(buckets, info, epub)
        // await putEncryptToSelf(buckets, info)
        console.log("put was successful")
        peer.send("Put was succesful")
      }
      else if (command.localeCompare("getEncrypted") === 0){
        console.log("Entering getEncrypted")
        const epub = arrData[arrData.length - 1]
        const buckets = arrData.slice(1, arrData.length-1)
        returned = await getEncrypted(buckets, epub)
        // console.log("returned value is: ", returned)
        if (typeof returned === "object"){
          peer.send(JSON.stringify(returned))
        }
        else { peer.send(returned) }
      }
      else if (command.localeCompare("put") === 0) {
        console.log("Entering put")
        const info = arrData[arrData.length - 1]
        const buckets = arrData.slice(1, arrData.length-1)
        //* replace remoteUser.epub with epub after testing
        await put(buckets, info)
        peer.send("Put was succesful")
      }

      else if (command.localeCompare("get") === 0){
        console.log("Entering get")
        const buckets = arrData.slice(1, arrData.length)
        returned = await get(buckets)
        // console.log("returned value is: ", returned)
        peer.send(returned)
      }

      else if (command.localeCompare("del") === 0) {
        const buckets = arrData.slice(1, arrData.length)
        del(buckets)
      }
    })
  })
}

// Will check for file specified in path variable
// Will gather user data from there if it exist
// If it doesn't exist it will create a new user and save the data to the file specified in the path var
const login = async (nmcAddress) => {
  try {
    if (fs.existsSync(path)) {
      const data = fs.readFileSync(path, {encoding: 'utf-8', flag: 'r'})
      user = JSON.parse(data.toString())
      console.log("user: ", user)

    } else {
      user = await SEA.pair()
      data = JSON.stringify(user)
      fs.writeFileSync(path, data)
      console.log("user: ", user)
    }
  } catch(err) {
    console.error(err)
    process.exit(1);
  }
}

// Grabs the bucket the data is held in
const getHelper = async(buckets) => {
  let endBucket = null
  buckets.map((bucket, index) => {
    if (index === 0) {
      endBucket = gun.get(bucket)
    } else {
      endBucket = endBucket.get(bucket)
    }
  })
  return endBucket
}

// Gets the data encrypted to you from the remoteUser
const getEncrypted = async(buckets, epub) => {
  const msg = await getHelper(buckets)
  //* change user to remoteUser for testing
  // console.log("retrieved message: ", msg)
  const passphrase = await SEA.secret(epub, user)
  const data = await SEA.decrypt(msg, passphrase)
  // console.log("\n\n\EPUB", epub, "\n\n\n")
  // console.log("\n\n\EPUB", user.epub, "\n\n\n")
  // console.log("\n\n\nDATA", data, "\n\n\n")

  return data
}

// Gets non encrypted data
const get = async(buckets) => {
  const data = await getHelper(buckets)
  return data
}

// Puts encrypted data and encrypts data to the epub
const putEncrypt = async (buckets, data, epub) => {
  // console.log("Bucket: ", buckets)
  // console.log("data: ", data)
  // console.log("epub: ", epub)
  const passphrase = await SEA.secret(epub, user)
  const message = await SEA.encrypt(data, passphrase)
  let endBucket = null
  buckets.map((bucket, index) => {
    if (index === 0) {
      endBucket = gun.get(bucket)
    } else if (index === buckets.length - 1) {
      endBucket = endBucket.get(bucket).put(message)
    } else {
      endBucket = endBucket.get(bucket)
    }
  })
}

// Put non Encrypted data
const put = async (buckets, data) => {
  // console.log("Bucket: ", buckets)
  // console.log("data: ", data)

  let endBucket = null
  buckets.map((bucket, index) => {
    if (index === 0) {
      endBucket = gun.get(bucket)
    } else if (index === buckets.length - 1) {
      endBucket = endBucket.get(bucket).put(data)
    } else {
      endBucket = endBucket.get(bucket)
    }
  })
}

main()