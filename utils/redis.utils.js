const { redisClient } = require("../config/redis")
const { internalServerError } = require("./error/error.handler")

module.exports.getRedisData = async (key) => {

    // console.log('key in redis =====>>>>>>', key);
    // console.log('key is not there')
    
    if(key ==='undefined:session' || !key) {
        internalServerError()
    }
    const redisCLientConn = await redisClient
    const data = await redisCLientConn.get(key);

    // console.log('data in redis ===>>>>>', data);
    if(!data) {
        internalServerError()
    }

    return JSON.parse(data)
}

module.exports.setRedisData = async (key, data) => {
    const redisConnection = await redisClient
    // console.log(' key and data in redis ===>>>>>>', key , data);
    await redisConnection.set(key, JSON.stringify(data))
}

module.exports.deleteRedisData = async (key) => {
    console.log('key in redis in case of delete ===>>>>>', key)
    const redisConnection = await redisClient
    
   const deleteCookies =  await redisConnection.del(key);
   console.log('deleteCookies =====>>>>>', deleteCookies);
   return deleteCookies === 1 ? {
            status : "Done",
            message : 'Session deleted'
   } : {
            status : "Failed",
            message : ' Failed  to session deleted' 
   }
}