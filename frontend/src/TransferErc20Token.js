// import Web3 from 'web3'
// const web3 = new Web3("wss://goerli.infura.io/ws/v3/aca94d975f944300980388548bb55d2b")
// const {Chain, Common, Hardfork} = require('@ethereumjs/common')
// const { Buffer } = require('buffer');
// // @ts-ignore
// window.Buffer = Buffer;
// const { FeeMarketEIP1559Transaction } = require('@ethereumjs/tx')

// export default async function TransferERC20Token(toAddress, value, contractABI, contractAddress, account) {
//     return new Promise(function (resolve, reject) {
//         try {
//             web3.eth.getBlock("latest", false, (error, result) => {
//                 var _gasLimit = result.gasLimit;
//                 let contract = new web3.eth.Contract(JSON.parse(contractABI), contractAddress);

//                 contract.methods.decimals().call().then(function (result) {
//                     try {
//                         var decimals = result;
//                         let amount = parseFloat(value) * Math.pow(10, decimals);
//                         web3.eth.getGasPrice(function (error, result) {
//                             var _gasPrice = result;
//                             try {
//                                 console.log(account.privateKey)
//                                 const privateKey = Buffer.from(account.privateKey.slice(2), 'hex')
//                                 console.log(privateKey)

//                                 var _hex_gasLimit = web3.utils.toHex((_gasLimit + 1000000).toString());
//                                 var _hex_gasPrice = web3.utils.toHex(_gasPrice.toString());
//                                 var _hex_value = web3.utils.toHex(amount.toString());
//                                 var _hex_Gas = web3.utils.toHex('60000');
                                
//                                 console.log("here")
//                                 web3.eth.getTransactionCount(account.address).then(
//                                     nonce => {
//                                         var _hex_nonce = web3.utils.toHex(nonce); 
//                                         const common = new Common({ chain: Chain.Goerli, hardfork: Hardfork.London })
//                                         const rawTx =
//                                         {
//                                             nonce: _hex_nonce,
//                                             from: account.address,
//                                             to: contractAddress,
//                                             gasPrice: _hex_gasPrice,
//                                             gasLimit: _hex_gasLimit,
//                                             gas: _hex_Gas,
//                                             value: '0x0',
//                                             data: contract.methods.transfer(toAddress, _hex_value).encodeABI()
//                                         };

//                                         const tx = FeeMarketEIP1559Transaction.fromTxData(rawTx, {common});
//                                         const signedTx = tx.sign(privateKey);


//                                         var serializedTx = '0x' + signedTx.serialize().toString('hex');

//                                         web3.eth.sendSignedTransaction(serializedTx.toString('hex'), function (err, hash) {
//                                             console.log("inside")
//                                             if (err) {
                                                
//                                                 reject(err);
//                                             }
//                                             else {
//                                                 resolve(hash);
//                                             }
//                                         })
//                                     });                                
//                             } catch (error) {
//                                 reject(error);
//                             }
//                         });
//                     } catch (error) {
//                         reject(error);
//                     }
//                 });
//             });
//         } catch (error) {
//             reject(error);
//         }
//     })
// }
