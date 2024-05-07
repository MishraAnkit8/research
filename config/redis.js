const redis = require("redis");

// Redis client configuration
const redisClientConn = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 63796,
    password: process.env.REDIS_PASSWORD || ''
});

// redis passWord yourpassword for server
const redisClient = redisClientConn.connect();

// Optional: Handle Redis client errors
redisClientConn.on("connect", () => {
  console.log("Connected to Redis");
});

// Handle Redis client errors
redisClientConn.on("error", (err) => {
  console.log("Redis error: ", err);
  // internalServerError({ moduleName: 'redis.js', message: 'Redis connection failed!' });
});

module.exports = { redisClient };
