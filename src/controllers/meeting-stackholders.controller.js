const meetingServices = require('../services/meeting-stackholders.service')



module.exports.renderMeetingStackholders = async(req, res, next) => {
    const meetingData = await meetingServices.fetchMeetingData();
    res.render('meeting-stackholders' , {
        meetingData : meetingData.rows,
        rowCount : meetingData.rowCount
    })
}

module.exports.insertMeetingStackholders = async(req, res, next) => {
    console.log('data in controller ==>>>', req.body);
    const meetingData = req.body;
    console.log('files ==>>', req.files);
    const {rankingDocuments, accreditationFile, achievementsFile, convocationFile, inauguralProgramFile, eventFile} = req.files
    const meetingStackholdersData = await meetingServices.insertMeetingStackholder(req.body, req.files);
    if(meetingStackholdersData) {
        res.status(200).send({
            status : 'done',
            meetingData : meetingData,
            meetingId : meetingStackholdersData,
            rankingDocuments,
            accreditationFile, 
            achievementsFile, 
            convocationFile, 
            inauguralProgramFile, 
            eventFile
        })
    }
}

module.exports.updateMeetingStackholders = async(req, res, next) => {
    console.log('updated data ==>>', req.body);
    const updateMeetingData = req.body;
    console.log('updateMeetingData ==>>', updateMeetingData)
    const meetingId = req.body.meetingId;
    const {rankingDocuments, accreditationFile, achievementsFile, convocationFile, inauguralProgramFile, eventFile} = req.files;
    const meetingDocumentToBeUpdate = {rankingDocuments, accreditationFile, achievementsFile, convocationFile, inauguralProgramFile, eventFile};
    const updateMeetingStackholdersData = await meetingServices.updateMeetingStackholders(meetingId, req.body, meetingDocumentToBeUpdate);
    if(updateMeetingStackholdersData.status === 'done'){
        res.status(200).send({
            status : 'done',
            updateMeetingData : updateMeetingData,
            rankingDocuments,
            accreditationFile, 
            achievementsFile, 
            convocationFile, 
            inauguralProgramFile, 
            eventFile,
            massage : 'data updated successfully'
        })
    }
}

module.exports.viewMeetingData = async(req, res, next) => {
    const {meetingId} = req.body
    const meetingStackholderView = await meetingServices.viewMeetingStackholders(meetingId);
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