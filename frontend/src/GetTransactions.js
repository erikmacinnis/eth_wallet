import axios from 'axios';

    const getRecentTx = (event, address) => {

        event.preventDefault()
        let data = JSON.stringify({
            "jsonrpc": "2.0",
            "id": 0,
            "method": "alchemy_getAssetTransfers",
            "params": [
              {
                "fromBlock": "0x0",
                "fromAddress": address,
                "category": ["erc1155"]
              }
            ]
          });

          console.log(data)
          
            var requestOptions = {
              method: 'post',
              headers: { 'Content-Type': 'application/json' },
              data: data,
            };
          
            const baseURL = `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`;
            const axiosURL = `${baseURL}`;
          
            axios(axiosURL, requestOptions)
              .then(response => console.log(response['data']))
              .catch(error => console.log(error));
    }

export {getRecentTx}