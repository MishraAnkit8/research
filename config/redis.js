const redis = require('redis');

// Redis client configuration
const redisClientConn = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    // password: process.env.REDIS_PASSWORD || ''
});

const redisClient = null;// = redisClientConn.connect();

// Optional: Handle Redis client errors
redisClientConn.on('connect', () => {
    console.log('Connected to Redis');
});

// Handle Redis client errors
redisClientConn.on('error', (err) => {
    console.error('Redis error:', err);
});

module.exports = { redisClient }