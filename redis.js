const redis = require('redis');


console.log('Redis Called!');
const redisClient = redis.createClient({
    url: 'redis://@localhost:6379'
})

const client = redisClient.connect();


redisClient.on('connect', () => {
    console.log('Redis connected!');
})

redisClient.on('ready', () => {
    console.log('Redis ready!');
})

redisClient.on('end', () => {
    console.log('Redis end!');
})

redisClient.on('error', (error) => {
    console.log('Redis error: ', error);
})

redisClient.on('reconnecting', () => {
    console.log('Redis reconnecting!');
})

//redisClient.quit();

