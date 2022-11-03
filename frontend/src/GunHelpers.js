// import Gun from 'gun'
// const gun = new Gun({ file: 'db/data.json', web: "http://localhost:3000/", radisk: false, localStorage: true });

// // Grabs the bucket the data is held in
// const getHelper = async(buckets) => {
//     let endBucket = null
//     buckets.map((bucket, index) => {
//       if (index === 0) {
//         endBucket = gun.get(bucket)
//       } else {
//         endBucket = endBucket.get(bucket)
//       }
//     })
//     return endBucket
// }
// // Gets non encrypted data
// const get = async(buckets) => {
//     const data = await getHelper(buckets)
//     return data
// }
  
// // Put non Encrypted data
// const put = async (buckets, data) => {
//     let endBucket = null
//     buckets.map((bucket, index) => {
//         if (index === 0) {
//         endBucket = gun.get(bucket)
//         } else if (index === buckets.length - 1) {
//         endBucket = endBucket.get(bucket).put(data)
//         } else {
//         endBucket = endBucket.get(bucket)
//         }
//     })
// }

// export {get, put}