
const { getRedisData } = require('../../utils/redis.utils');

module.exports.renderResearch = async (req, res, next) => {
    const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in in dashboard controller  ===>>>>>>', userName); 

    res.render('research' , {
        userName : userName
    });
};

