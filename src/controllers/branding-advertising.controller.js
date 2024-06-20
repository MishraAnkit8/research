const { use } = require('../routes/dashboard.route');
const brandingAndAdvertisingServices = require('../services/branding-advertising.service');
const { getRedisData } = require("../../utils/redis.utils");

module.exports.renderBrandingAndAdvertising = async(req, res, next) => {
    const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in in dashboard controller  ===>>>>>>', userName);

    const brandingAndAdvertising = await brandingAndAdvertisingServices.fetchBrandingandAdvertisingData(userName);
    if(brandingAndAdvertising){
        res.render('branding-advertising' , {
            advertisingData : brandingAndAdvertising.rows,
            rowCount : brandingAndAdvertising.rowCount,
            userName : userName
        })
    }
}

module.exports.insertBrandingAndAdvertising = async(req, res, next) => {
    const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in in dashboard controller  ===>>>>>>', userName);

    const advertisingData = req.body;
    console.log('data comming from frontend ==>>', advertisingData);
    console.log('files in controller  ==>>', res.files);
    const brandingAndAdvertising = await brandingAndAdvertisingServices.insertBrandingAdvertising(req.body, req.files, userName);
    
    console.log('brandingAndAdvertising ===>>>>', brandingAndAdvertising)
    const statusCode = brandingAndAdvertising.status === "Done" ? 200 : (brandingAndAdvertising.errorCode ? 400 : 500);

    res.status(statusCode).send({
        status : brandingAndAdvertising.status,
        message : brandingAndAdvertising.message,
        errorCode : brandingAndAdvertising.errorCode ? brandingAndAdvertising.errorCode : null
    })
}

module.exports.updateBrandingAdvertising = async(req, res, next) => {
    const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in in dashboard controller  ===>>>>>>', userName);

    const updatedAdvertisingData = req.body;
    const advertisingId = req.body.advertisingId;
    console.log('files in controller ===>>', req.files)
    console.log('updated advertising data ==>>', updatedAdvertisingData);

    const updatedAdvertising = await brandingAndAdvertisingServices.updateBrandingAndAdvertising(advertisingId, updatedAdvertisingData, req.files, userName);

    console.log('updatedAdvertising ====>>>>>>', updatedAdvertising)
    const statusCode = updatedAdvertising.status === "Done" ? 200 : (updatedAdvertising.errorCode ? 400 : 500);
  
    res.status(statusCode).send({
      status : updatedAdvertising.status,
      message : updatedAdvertising.message,
      errorCode : updatedAdvertising.errorCode ? updatedAdvertising.errorCode : null
      })
    
}

module.exports.viewBrandingadvertising = async(req, res, next) => {
    const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in in dashboard controller  ===>>>>>>', userName);

    console.log('id ==>>', req.body)
    const {advertisingId} = req.body;
    const brandingAndAdvertisingview = await brandingAndAdvertisingServices.viewBrandingadvertising(advertisingId, userName);
    console.log('brandingAndAdvertisingview' , brandingAndAdvertisingview[0]);

    if(brandingAndAdvertisingview) {
        res.status(200).send({
            status : 'done',
            brandingAndAdvertisingData : brandingAndAdvertisingview
        })
    }
}

module.exports.deleteBrandingAdvertising = async(req, res, next) => {
    console.log('id ==>>', req.body);
    const {advertisingId} = req.body;
    const brandingAndadvertisingDelete = await brandingAndAdvertisingServices.deleteAdvertising(advertisingId);
    if(brandingAndadvertisingDelete.status === 'Done'){
        res.status(200).send({
            status : 'Done',
            massage : 'deleted successfully'
        })
    }
}