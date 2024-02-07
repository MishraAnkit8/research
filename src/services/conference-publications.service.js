const fs = require('fs');
const path = require('path');

const conferencePublicationModels = require('../models/conference-publications.modles');

// uploaded file path for dowload
const uploadFolder = path.join(__dirname, '..', '..', 'uploads');
module.exports.downloadFile = (req, res) => {
    const filename = req.params.fileName;
    const filePath = path.join(uploadFolder, filename);
    console.log("filePath ==>>", filePath);
    console.log("filename ==>>>", filename);
  
    const originalFilename = filename.split('_').slice(1).join('_');
  
    // Set the content type header to force the browser to treat it as a PDF
    res.setHeader('Content-Type', 'application/pdf');
  
    // Set the filename for the download
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
      // Stream the file to the response for download
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    }
  });
}


module.exports.fetchConferencePublication = async() => {
    const conferencePublicationData = await conferencePublicationModels.fetchConferencePublication();
    console.log('feched data in service  ==>' , conferencePublicationData.rows);
    return conferencePublicationData;
};

module.exports.insertConferenceData = async(body , files) => {
    console.log('data in service' , body);
    const conferencePublications = body;
    console.log('files in service ==>' , files);
    var conferenceDocumentData = '';
    var conferenceProofData = '';

    if(files.conferenceDocument && files.conferenceProof){
      console.log('conferenceProof Data in services :' , files.conferenceDocument);
      console.log('conferenceDocument in services' , files.conferenceProof);
      for(let i = 0; i <= files.conferenceDocument.length - 1; i++){
        if(files.conferenceDocument[i].filename){
          conferenceDocumentData += files.conferenceDocument[i].filename + ',';
        }
      }
      for(let i = 0; i <= files.conferenceProof.length - 1; i++){
        if(files.conferenceProof[i].filename){
          conferenceProofData += files.conferenceProof[i].filename + ',';
        }
      }
    }
    console.log('conferenceDocumentData string in service ===>>>', conferenceDocumentData)
    console.log('conferenceProofData string in service  ==>>>', conferenceProofData)
    const insertConferencePublication = await conferencePublicationModels.insertConferencePublication(conferencePublications, conferenceDocumentData, conferenceProofData);
    const conferenceId = insertConferencePublication.rows[0].id;

    if(insertConferencePublication && insertConferencePublication.rows[0].id){
        return{
          conferenceId,
          conferenceDocumentData,
          conferenceProofData
        } 
    }
    
}

module.exports.deleteConferencePublicationData = async(body) => {
    const conferenceId = body;
    const deleteConferencePublication = await conferencePublicationModels.DeleteConference(conferenceId);
    if(deleteConferencePublication && deleteConferencePublication.rowCount === 1){
        return {
            status : 'done',
            massage : 'data deleted successfully'
        }
    }
    else{
        return {
            status : 'failed ',
            massage : 'failed to delete the data'
        }
    }
}

module.exports.updatedConferencePublication = async (body, files) => {
    console.log('data in service' , body);
    const upadtedConferenceData = body
    const conferenceId =  body.conferenceId;
    console.log('files in side service ===>>>',files);
    const conferenceDocumentFiles = files.conferenceDocument;
    const conferenceProofFiles = files.conferenceProof;
    var confernceDocString = '';
    var conferenceProofString = '';
    // conference document Sting 
    if (conferenceDocumentFiles) {
      for (let i = 0; i <= conferenceDocumentFiles.length - 1; i++) {
        if (conferenceDocumentFiles[i].filename) {
          confernceDocString += conferenceDocumentFiles[i].filename + ",";
        }
      }
    }

    // for conference proog string
    if(conferenceProofFiles){
      for (let i = 0; i <= conferenceProofFiles.length - 1; i++) {
        if (conferenceProofFiles[i].filename) {
          conferenceProofString += conferenceProofFiles[i].filename + ",";
        }
      }
    }
    console.log('confernceDocString in service ==>>', confernceDocString);
    console.log('conferenceProofString in service ==>>', conferenceProofString);
    const ConferenceFileToBeUpdate = {confernceDocString , conferenceProofString}
    const updateConferencePublicationData = await conferencePublicationModels.updateConferencePublication(upadtedConferenceData, conferenceId, ConferenceFileToBeUpdate);
    if(updateConferencePublicationData && updateConferencePublicationData.rowCount === 1){
        console.log('updateConferencePublicationData in service ==>>', updateConferencePublicationData);
        return {
            status : 'done',
            massage : 'data updated successfully',
            confernceDocString : confernceDocString,
            conferenceProofString : conferenceProofString
        }
    }
    else{
        return {
            status : 'failed',
            massage : 'failed to update',
        }
    }
     
}

module.exports.viewConferencePublication = async(conferenceId) => {
    const viewConferenceData  = await conferencePublicationModels.viewConferencePublication(conferenceId);
    if(viewConferenceData && viewConferenceData.rowCount === 1){
        return viewConferenceData
    }
}