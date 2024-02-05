const fs = require('fs');
const path = require('path');

const meetingModels = require('../models/meeting-stackholders.model');

const uploadFolder = path.join(__dirname, '..', '..', 'uploads');
console.log('uploadFolder in meeting ===>>', uploadFolder)
module.exports.downloadFile = (req, res) => {
    const filename = req.params.fileName;
    const filePath = path.join(uploadFolder, filename);
    console.log("filePath ==>>", filePath);
    console.log("filename ==>>>", filename);
  
    const originalFilename = filename.split('_').slice(1).join('_');
    res.setHeader('Content-Type', 'application/pdf');
  
    res.download(filePath, originalFilename, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).send("Error downloading file");
      } else {
        console.log('File downloaded successfully');
      }
    });
  };
  
module.exports.viewFile = (req, res, next) => {
const filename = req.params.filename;
  const filePath = path.join(uploadFolder, filename);
  console.log("filePath ==>>", filePath);
  console.log("filename ==>>>", filename);

  fs.access(filePath, fs.constants.R_OK, (err) => {
    if (err) {
      console.error('Error accessing file:', err);
      res.status(404).send('File not found');
    } else {
      //  file to the response for download
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    }
  });
}

module.exports.fetchMeetingData = async() => {
    const meetingStackholderData = await meetingModels.fetchMeetingStackholdersData();
    console.log('meetingStackholderData' , meetingStackholderData.rows[0]);
    return meetingStackholderData;
}

module.exports.insertMeetingStackholder = async(body, files) => {
    const rankingDocuments = files.rankingDocuments[0].filename;
    console.log('rankingDocuments ==>', rankingDocuments)
    const accreditationFile = files.accreditationFile[0].filename;
    const achievementsFile = files.achievementsFile[0].filename;
    const convocationFile = files.convocationFile[0].filename;
    const inauguralProgramFile = files.inauguralProgramFile[0].filename;
    const eventFile = files.eventFile[0].filename;
    const meetingStackholderData = body;
    console.log('meetingStackholderData  ==>>', meetingStackholderData)
    const insertmMeetingStackholderData = await meetingModels.insertMeetingStackholders(meetingStackholderData, rankingDocuments, accreditationFile, achievementsFile, convocationFile, inauguralProgramFile, eventFile);
    console.log('insertmMeetingStackholderData ==>>', insertmMeetingStackholderData.rows[0].id);
    if(insertmMeetingStackholderData){
        return insertmMeetingStackholderData.rows[0].id;
    }


}

module.exports.updateMeetingStackholders = async(meetingId, updateMeetingData, meetingDocumentToBeUpdate) => {
    console.log('data in service ==>>', updateMeetingData)
    const updatedMeeting = await meetingModels.updateMeetingData(meetingId, updateMeetingData, meetingDocumentToBeUpdate);
    if(updatedMeeting && updatedMeeting.rowCount === 1){
        return{
            status : 'done',
            massage : 'data updated successfully'
        }
    }
}

module.exports.viewMeetingStackholders = async(meetingId) => {
    const viewMeetingData = await meetingModels.viewMeeting(meetingId);
    return viewMeetingData.rows[0]
}

module.exports.deleteMeetingData = async(meetingId) => {
    
    const deletMeeting = await meetingModels.deleteMeetingStackholders(meetingId);
    if(deletMeeting.rowCount === 1  && deletMeeting){
        return{
            status : 'done',
            massage : 'deleted successfully'
        }
    } 
}