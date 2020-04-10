// const redis = require('redis');
// const bluebird = require('bluebird');

// bluebird.promisifyAll(redis.RedisClient.prototype);
// bluebird.promisifyAll(redis.Multi.prototype);

// const client = redis.createClient({
//   port: process.env.REDIS_PORT || 6379, // sử dụng redis local
//   host: process.env.REDIS_HOST,
// });
// // client.auth(process.env.REDIS_PASSWORD);
// client.on('error', err => {
//   console.log(err);
// });

// module.exports = client;
