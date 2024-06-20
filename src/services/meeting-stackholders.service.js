const meetingModels = require('../models/meeting-stackholders.model');


module.exports.fetchMeetingData = async(userName) => {
    const meetingStackholderData = await meetingModels.fetchMeetingStackholdersData(userName);
    console.log('meetingStackholderData' , meetingStackholderData.rows[0]);
    return meetingStackholderData;
}

module.exports.insertMeetingStackholder = async(body, files, userName) => {
    const rankingDocuments = files.rankingDocuments[0].filename;
    console.log('rankingDocuments ==>', rankingDocuments)
    const accreditationFile = files.accreditationFile[0].filename;
    const achievementsFile = files.achievementsFile[0].filename;
    const convocationFile = files.convocationFile[0].filename;
    const inauguralProgramFile = files.inauguralProgramFile[0].filename;
    const eventFile = files.eventFile[0].filename;
    let meetingFilesData = {};
    if(Object.keys(files).length > 0){
      console.log('files in services ===>>>', files);
      const rankingDocumentsData = files.rankingDocuments;
      const accreditationFilesData = files.accreditationFile;
      const achievementsFilesData = files.achievementsFile;
      const convocationFilesData = files.convocationFile;
      const inauguralProgramFilesData = files.inauguralProgramFile;
      const  eventFilesData = files.eventFile;
      const containerArray = [
        rankingDocumentsData,
        accreditationFilesData,
        achievementsFilesData,
        convocationFilesData,
        inauguralProgramFilesData,
        eventFilesData
      ];

      console.log('containerArray ===>>>', containerArray);

      let meetingFilesDataKeys = [
        'rankingDocuments',
        'accreditationFile',
        'achievementsFile',
        'convocationFile',
        'inauguralProgramFile',
        'eventFile',
      ];

      let meetingFilesArrayStringValue = [];
      if(containerArray.length > 0){
        for(let file = 0; file <= containerArray.length - 1; file++){
            var fileString = '';
            if(containerArray[file]){
              for(let i = 0; i  <= containerArray[file].length - 1; i++){
                if(containerArray[file][i].filename){
                  console.log('filename inside loop ===>>>', containerArray[file][i].filename);
                  fileString += containerArray[file][i].filename + ',';
                }
              }
              meetingFilesArrayStringValue.push(fileString);
            }
        }
      }
      console.log('meetingFilesArrayStringValue ===>>>', meetingFilesArrayStringValue);
      for(let i =0; i <= meetingFilesDataKeys.length - 1; i++){
          const keys = meetingFilesDataKeys[i];
          const values = meetingFilesArrayStringValue[i];
          meetingFilesData[keys] = values;
      }
    }
    console.log('meetingFilesData inservice ====>>>', meetingFilesData)
    const meetingStackholderData = body;
    console.log('meetingStackholderData  ==>>', meetingStackholderData)
    const insertmMeetingStackholderData = await meetingModels.insertMeetingStackholders(meetingStackholderData, meetingFilesData, userName);
    console.log('insertmMeetingStackholderData ===>>>>>', insertmMeetingStackholderData)

    return {
      status : insertmMeetingStackholderData.status,
      message : insertmMeetingStackholderData.message,
      errorCode : insertmMeetingStackholderData.errorCode ? insertmMeetingStackholderData.errorCode : null
    }


}

module.exports.updateMeetingStackholders = async(meetingId, updateMeetingData, files, userName) => {
    console.log('data in service ==>>', updateMeetingData)
    // console.log('files data in in service ===>>>', files);
    let updatedMeetingFilesData = {};

    if (Object.keys(files).length > 0) {
      console.log('files in services ===>>>', files);

      const rankingDocumentsData = files.rankingDocuments || [];
      const accreditationFilesData = files.accreditationFile || [];
      const achievementsFilesData = files.achievementsFile || [];
      const convocationFilesData = files.convocationFile || [];
      const inauguralProgramFilesData = files.inauguralProgramFile || [];
      const eventFilesData = files.eventFile || [];

      const containerArray = [
        rankingDocumentsData,
        accreditationFilesData,
        achievementsFilesData,
        convocationFilesData,
        inauguralProgramFilesData,
        eventFilesData
      ];

      console.log('containerArray ===>>>', containerArray);

      let meetingFilesDataKeys = [
        'rankingDocuments',
        'accreditationFile',
        'achievementsFile',
        'convocationFile',
        'inauguralProgramFile',
        'eventFile'
      ];

      let meetingFilesArrayStringValue = [];

      if (containerArray.length > 0) {
        for (let file = 0; file < containerArray.length; file++) {
          let fileString = '';
          if (containerArray[file].length > 0) {
            for (let i = 0; i < containerArray[file].length; i++) {
              if (containerArray[file][i].filename) {
                console.log('filename inside loop ===>>>', containerArray[file][i].filename);
                fileString += containerArray[file][i].filename + ',';
              }
            }
            // Remove the trailing comma
            fileString = fileString.slice(0, -1);
          }
          meetingFilesArrayStringValue.push(fileString);
        }
      }

      console.log('meetingFilesArrayStringValue ===>>>', meetingFilesArrayStringValue);

      for (let i = 0; i < meetingFilesDataKeys.length; i++) {
        const key = meetingFilesDataKeys[i];
        const value = meetingFilesArrayStringValue[i] || '';
        updatedMeetingFilesData[key] = value;
      }
    }
    console.log('updatedMeetingFilesData in serices ==>>>', updatedMeetingFilesData)
    const updatedMeeting = await meetingModels.updateMeetingData(meetingId, updateMeetingData, updatedMeetingFilesData, userName);
    
    console.log('updated data in services ==>>>::::', updatedMeeting);
    return {
      status : updatedMeeting.status,
      message : updatedMeeting.message,
      errorCode : updatedMeeting.errorCode ? updatedMeeting.errorCode : null
    }
}

module.exports.viewMeetingStackholders = async(meetingId, userName) => {

    const viewMeetingData = await meetingModels.viewMeeting(meetingId, userName);
    
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