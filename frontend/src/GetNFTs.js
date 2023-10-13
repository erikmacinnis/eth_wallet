import axios from 'axios'


const getNfts = (address) => {

    const baseURL = `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`;
    const url = `${baseURL}/getNFTs/?owner=${address}`;

    const config = {
        method: 'get',
        url: url,
    };

    // Make the request and print the formatted response:
    return new Promise(function async(resolve, reject) {
        axios(config)
            .then(response => {
                console.log(response['data'])
                const data = response.data
                resolve(data)
            })
            .catch(error => console.log('error', error));
        })
}

export {getNfts}
