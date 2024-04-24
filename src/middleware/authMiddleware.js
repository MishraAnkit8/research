const { serverFetch } = require("../../utils/fetchService");
const { getRedisData, setRedisData } = require("../../utils/redis.utils");

module.exports.authMiddleware = async (req, res, next) => {
    console.log("INSIDE::::::::::::", req.cookies.session);
    const sessionid = req.cookies.session;

    if(!sessionid || sessionid == 'undefined'){
        res.redirect('/user');
    }

    let sessionData = await getRedisData(`${sessionid}:session`)
    console.log("sessionDataL::::::::", sessionData);
    try {
        const { status, headers, body }  = await serverFetch('https://portal.svkm.ac.in/api-gateway/auth/mobile/auth/validate-route', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...sessionData
          }
        });
        console.log({
            status,
            headers,
            body
        });

        if(status !== 200) {
            res.status(401).json({
                message: "Unauthorized Access!"
            })
        }

        const {accesstoken, refreshtoken} = headers;

        sessionData = {...sessionData, accesstoken: accesstoken, refreshtoken: refreshtoken}
        setRedisData(`${sessionid}:session`, sessionData)
        next()
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error!"
        })
    }
}