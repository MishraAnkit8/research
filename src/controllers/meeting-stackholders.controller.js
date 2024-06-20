const meetingServices = require('../services/meeting-stackholders.service')
const { getRedisData } = require("../../utils/redis.utils");



module.exports.renderMeetingStackholders = async(req, res, next) => {
    const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in in dashboard controller  ===>>>>>>', userName);

    const meetingData = await meetingServices.fetchMeetingData(userName);
    res.render('meeting-stackholders' , {
        meetingData : meetingData.rows,
        rowCount : meetingData.rowCount,
        userName : userName
    })
}

module.exports.insertMeetingStackholders = async(req, res, next) => {
    const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in in dashboard controller  ===>>>>>>', userName);

    console.log('data in controller ==>>>', req.body);
    const meetingData = req.body;
    console.log('files in controller ==>>', req.files);
    // const {rankingDocuments, accreditationFile, achievementsFile, convocationFile, inauguralProgramFile, eventFile} = req.files
    const meetingStackholdersData = await meetingServices.insertMeetingStackholder(req.body, req.files, userName);

    console.log('meetingStackholdersData in controller ===>>>>>', meetingStackholdersData);
 
    const statusCode = meetingStackholdersData.status === "Done" ? 200 : (meetingStackholdersData.errorCode ? 400 : 500);

    res.status(statusCode).send({
        status : meetingStackholdersData.status,
        message : meetingStackholdersData.message,
        errorCode : meetingStackholdersData.errorCode ? meetingStackholdersData.errorCode : null
    })
}

module.exports.updateMeetingStackholders = async(req, res, next) => {
    const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in in dashboard controller  ===>>>>>>', userName);

    console.log('updated data comning from frontend ==>>', req.body);
    const meetingId = req.body.meetingId;
    console.log('files data in controller ==>>', req.files);

    const updateMeetingStackholdersData = await meetingServices.updateMeetingStackholders(meetingId, req.body, req.files, userName);
    
    console.log('updateMeetingStackholdersData ====>>>>>>', updateMeetingStackholdersData)
    const statusCode = updateMeetingStackholdersData.status === "Done" ? 200 : (updateMeetingStackholdersData.errorCode ? 400 : 500);
  
    res.status(statusCode).send({
      status : updateMeetingStackholdersData.status,
      message : updateMeetingStackholdersData.message,
      errorCode : updateMeetingStackholdersData.errorCode ? updateMeetingStackholdersData.errorCode : null
      })
}

module.exports.viewMeetingData = async(req, res, next) => {
    const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in in dashboard controller  ===>>>>>>', userName);

    const {meetingId} = req.body
    const meetingStackholderView = await meetingServices.viewMeetingStackholders(meetingId, userName);
    if(meetingStackholderView){
        res.status(200).send({
            status : 'done',
            meetingStackholderView : meetingStackholderView
        })
    }
}

module.exports.deleteMeetingStackholders = async(req, res, next) => {
    const {meetingId} = req.body;
    const deleteMeetingStackholdersData = await meetingServices.deleteMeetingData(meetingId);
    if(deleteMeetingStackholdersData.status === 'done'){
        res.status(200).send({
            status : 'done',
            massage : 'deleted successfully'
        })
    }
}