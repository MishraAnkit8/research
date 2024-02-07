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
    console.log('files in controller ==>>', req.files);
    // const {rankingDocuments, accreditationFile, achievementsFile, convocationFile, inauguralProgramFile, eventFile} = req.files
    const meetingStackholdersData = await meetingServices.insertMeetingStackholder(req.body, req.files);
    const meetingId = meetingStackholdersData.meetingId;
    const rankingDocuments = meetingStackholdersData.meetingFilesData.rankingDocuments;
    const accreditationFile = meetingStackholdersData.meetingFilesData.accreditationFile; 
    const achievementsFile = meetingStackholdersData.meetingFilesData.achievementsFile 
    const convocationFile = meetingStackholdersData.meetingFilesData.convocationFile; 
    const inauguralProgramFile = meetingStackholdersData.meetingFilesData.inauguralProgramFile; 
    const eventFile = meetingStackholdersData.meetingFilesData.eventFile;

    if(meetingStackholdersData) {
        res.status(200).send({
            status : 'done',
            meetingData : meetingData,
            meetingId,
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
    // const {rankingDocuments, accreditationFile, achievementsFile, convocationFile, inauguralProgramFile, eventFile} = req.files;
    console.log('files data in controller ==>>', req.files)
    // const meetingDocumentToBeUpdate = {rankingDocuments, accreditationFile, achievementsFile, convocationFile, inauguralProgramFile, eventFile};
    const updateMeetingStackholdersData = await meetingServices.updateMeetingStackholders(meetingId, req.body, req.files);
    const rankingDocuments = updateMeetingStackholdersData.updatedMeetingFilesData.rankingDocuments;
    const accreditationFile = updateMeetingStackholdersData.updatedMeetingFilesData.accreditationFile; 
    const achievementsFile = updateMeetingStackholdersData.updatedMeetingFilesData.achievementsFile 
    const convocationFile = updateMeetingStackholdersData.updatedMeetingFilesData.convocationFile; 
    const inauguralProgramFile = updateMeetingStackholdersData.updatedMeetingFilesData.inauguralProgramFile; 
    const eventFile = updateMeetingStackholdersData.updatedMeetingFilesData.eventFile;
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