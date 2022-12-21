import axios from 'axios'


const getTokenBalances = (address) => {

    // Alchemy URL

    return new Promise(function async(resolve, reject){
        const baseURL = `https://eth-goerli.g.alchemy.com/v2/kjOwb-DNYJyNIJ_qtIJNEe3JzOQgE1SU`;

        const data = JSON.stringify({
        "jsonrpc": "2.0",
        "method": "alchemy_getTokenBalances",
        "headers": {
            "Content-Type": "application/json"
        },
        "params": [
            `${address}`,
            "erc20",
        ],
        "id": 42
        });

        const config = {
        method: 'post',
        url: baseURL,
        headers: {
            'Content-Type': 'application/json'
        },
        data : data
        };

        // Make the request and print the formatted response:
        axios(config)
        .then(async response => {
            console.log("Response: ", response.data.result)
            // Get balances
            const balances = response['data']['result']
            // Remove tokens with zero balance
            const nonZeroBalances = 
            balances['tokenBalances'].filter(token => {
            return token['tokenBalance'] !== '0'
            })

            console.log(`Token balances of ${address} \n`)
            
            // Counter for SNo of final output
            let i = 1

            let tokenToInfo = new Map()
            
            // Loop through all tokens with non-zero balance
            for (let token of nonZeroBalances) {
                
                // Get balance of token 
                let balance = token['tokenBalance']
                    console.log("a " + token.contractAddress + " a")
                // if (token.contractAddress === '0x6F583f4f68235f759e81ec8EF8445b379aCAD3d7'.toLowerCase()) {
                //         balance = balance/Math.pow(10, 18);
                //         balance = balance.toFixed(2);
                //         console.log(`${i++}. Mock Dai: ${balance} Dai`)
                //         const tokenInfo = [Number(balance), token.contractAddress]
                //         tokenToInfo["Mock Dai:Dai"] = tokenInfo
                //         break
                // }
                
                const metadataParams = JSON.stringify({
                    "jsonrpc": "2.0",
                    "method": "alchemy_getTokenMetadata",
                    "params": [
                        `${token['contractAddress']}`
                    ],
                    "id": 42
                });
                
                const metadataConfig = {
                    method: 'post',
                    url: baseURL,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data : metadataParams
                };  
                console.log(metadataConfig)
                // Get metadata of token
                const metadata = await axios(metadataConfig).catch(error => console.log('error', error))
                // eslint-disable-next-line no-loop-func
                console.log(metadata)
                const result = metadata.data.result
                // Compute token balance in human-readable format
                balance = balance/Math.pow(10, result['decimals']);
                
                // Print name, balance, and symbol of token
                console.log(`${i++}. ${result['name']}: ${balance} ${result['symbol']} ${token.contractAddress}`)
                const tokenInfo = [Number(balance), token.contractAddress]
                tokenToInfo[`${result['name']}:${result['symbol']}`] = tokenInfo
                    
            }
            console.log(tokenToInfo)
            resolve(tokenToInfo)
        })
        .catch(error => reject(error));
    })
}

export {getTokenBalances}