const fs = require('fs');
const path = require('path');

const brandingAndAdvertisingModels = require('../models/branding-advertising.model');
// uploaded file path for dowload
const uploadFolder = path.join(__dirname, '..', '..', 'uploads');
console.log('uploadFolder in side branding ==>>>', uploadFolder)
module.exports.downloadFile = (req, res) => {
    const filename = req.params.filename;
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
      //  file to the response for download
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    }
  });
}


module.exports.fetchBrandingandAdvertisingData = async() => {
    const brandingAndAdvertising = await brandingAndAdvertisingModels.fetchBrandingAndadvertising();
    console.log('brandingAndAdvertising ==>>', brandingAndAdvertising.rows)
    return brandingAndAdvertising;
}

module.exports.insertBrandingAdvertising = async(body , files) => {
    const advertisingData = body;
    const facultyRecognitionDocuments = files.facultyRecognitionDocuments[0].filename;
    const facultyAwardDocuments = files.facultyAwardDocuments[0].filename;
    const staffAwardDocuments = files.staffAwardDocuments[0].filename;
    const alumniAwardDocuments = files.alumniAwardDocuments[0].filename;
    const studentAwardDocuments = files.studentAwardDocuments[0].filename; 
    const internationalLinkageDocuments = files.internationalLinkageDocuments[0].filename;
    const conferenceParticipationDocuments = files.conferenceParticipationDocuments[0].filename;
    const organisingConferenceDocuments = files.organisingConferenceDocuments[0].filename;
    const studentEventParticipationDocuments = files.studentEventParticipationDocuments[0].filename;
    const newspaperArticleDocuments = files.newspaperArticleDocuments[0].filename;
    console.log('newspaperArticleDocuments ===>>', newspaperArticleDocuments);

    const brandingAndAdvertising = await brandingAndAdvertisingModels.insertBrandingAndAdvertisingData(advertisingData, facultyRecognitionDocuments,
         facultyAwardDocuments, staffAwardDocuments, alumniAwardDocuments, studentAwardDocuments, internationalLinkageDocuments, conferenceParticipationDocuments, organisingConferenceDocuments,
         studentEventParticipationDocuments, newspaperArticleDocuments);

    console.log('brandingAndAdvertising id ==>>', brandingAndAdvertising.rows[0].id)
    if(brandingAndAdvertising && brandingAndAdvertising.rows[0].id){
        return brandingAndAdvertising.rows[0].id;
    } 
}

module.exports.updateBrandingAndAdvertising = async (advertisingId, updatedAdvertisingData, filesToUpdate) => {
    console.log('filesToUpdate in service ==>>', filesToUpdate);
    console.log('updatedAdvertisingData ==>>', updatedAdvertisingData);

    // const facultyRecognitionDocuments = filesToUpdate.facultyRecognitionDocuments ? filesToUpdate.facultyRecognitionDocuments[0].filename : null;
    // const facultyAwardDocuments = filesToUpdate.facultyAwardDocuments ? filesToUpdate.facultyAwardDocuments[0].filename : null;
    // const staffAwardDocuments = filesToUpdate.staffAwardDocuments ? filesToUpdate.staffAwardDocuments[0].filename : null;
    // const alumniAwardDocuments = filesToUpdate.alumniAwardDocuments ? filesToUpdate.alumniAwardDocuments[0].filename : null;
    // const studentAwardDocuments = filesToUpdate.studentAwardDocuments ? filesToUpdate.studentAwardDocuments[0].filename : null; 
    // const internationalLinkageDocuments = filesToUpdate.internationalLinkageDocuments ? filesToUpdate.internationalLinkageDocuments[0].filename : null;
    // const conferenceParticipationDocuments = filesToUpdate.conferenceParticipationDocuments ? filesToUpdate.conferenceParticipationDocuments[0].filename : null;
    // const organisingConferenceDocuments = filesToUpdate.organisingConferenceDocuments ? filesToUpdate.organisingConferenceDocuments[0].filename : null;
    // const studentEventParticipationDocuments = filesToUpdate.studentEventParticipationDocuments ? filesToUpdate.studentEventParticipationDocuments[0].filename : null;
    // const newspaperArticleDocuments = filesToUpdate.newspaperArticleDocuments ? filesToUpdate.newspaperArticleDocuments[0].filename : null;

    const brandingAndAdvertising = await brandingAndAdvertisingModels.updateBrandingAdvertising(advertisingId, updatedAdvertisingData, filesToUpdate);
    console.log('brandingAndAdvertising in service ===>>>', brandingAndAdvertising)

    if (brandingAndAdvertising && brandingAndAdvertising.rowCount === 1) {
        return {
            status: 'done',
            message: 'updated successfully'
        };
    }
};


module.exports.viewBrandingadvertising = async(advertisingId) => {
    const viewAdvertisingData = await brandingAndAdvertisingModels.brandingAndadvertisingview(advertisingId);
    console.log('data in service ==>>', viewAdvertisingData.rows)
    return viewAdvertisingData.rows
}

module.exports.deleteAdvertising = async(advertisingId) => {
    const deleteBrandingAdvertising = await brandingAndAdvertisingModels.brandingAndadvertisingDelete(advertisingId);
    if(deleteBrandingAdvertising && deleteBrandingAdvertising.rowCount === 1){
        return{
            status : 'done',
            massage : 'deleted successfully'
        }
    }
}