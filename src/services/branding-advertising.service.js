const fs = require('fs');
const path = require('path');

const brandingAndAdvertisingModels = require('../models/branding-advertising.model');
// uploaded file path for dowload
const uploadFolder = path.join(__dirname, '..', '..', 'uploads');
console.log('uploadFolder in side branding ==>>>', uploadFolder)
module.exports.downloadFile = (req, res) => {
    const filename = req.params.fileName;
    console.log("filename ==>>>", filename);
    const filePath = path.join(uploadFolder, filename);
    console.log("filePath ==>>", filePath);
  
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
    let brandingFilesContainer = {};
    if(files){
      const facultyRecognitionFilesArray = files.facultyRecognitionDocuments;
      const facultyAwardFilesArray = files.facultyAwardDocuments;
      const staffAwardFilesArray = files.staffAwardDocuments;
      const alumniAwardFilesArray = files.alumniAwardDocuments;
      const studentAwardFilesArray = files.studentAwardDocuments; 
      const internationalLinkageFilesArray = files.internationalLinkageDocuments;
      const conferenceParticipationFilesArray = files.conferenceParticipationDocuments;
      const organisingConferenceFilesArray = files.organisingConferenceDocuments;
      const studentEventParticipationFilesArray = files.studentEventParticipationDocuments;
      const newspaperArticleFilesArray = files.newspaperArticleDocuments;

      // files array container
      const filesArrayContainer = [
            facultyRecognitionFilesArray,
            facultyAwardFilesArray,
            staffAwardFilesArray,
            alumniAwardFilesArray,
            studentAwardFilesArray,
            internationalLinkageFilesArray,
            conferenceParticipationFilesArray,
            organisingConferenceFilesArray,
            studentEventParticipationFilesArray,
            newspaperArticleFilesArray
      ];
      console.log('filesArrayContainer service ===>>', filesArrayContainer);
      const keyNameArray = [
          'facultyRecognitionDocuments',
          'facultyAwardDocuments',
          'staffAwardDocuments',
          'alumniAwardDocuments',
          'studentAwardDocuments',
          'internationalLinkageDocuments',
          'conferenceParticipationDocuments',
          'organisingConferenceDocuments',
          'studentEventParticipationDocuments',
          'newspaperArticleDocuments'
      ];
      console.log('keyNameArray ===>>',keyNameArray);

      const filesValues = [];
      for(let i = 0; i <= filesArrayContainer.length - 1; i++){
          var fileStringName = '';
          for(let j = 0; j <= filesArrayContainer[i].length - 1; j++){
            if(filesArrayContainer[i][j].filename){
              fileStringName += filesArrayContainer[i][j].filename + ',';
            }
          }
          filesValues.push(fileStringName);
      }

      console.log('filesValues ====>>>', filesValues);
    // for appending key and files name as key value pair in object
        for(let k = 0; k <= filesValues.length - 1; k++){
          const keyName = keyNameArray[k];
          const stringValue = filesValues[k];
          if(stringValue){
            brandingFilesContainer[keyName] = stringValue;
          }
        }

    };
    console.log('brandingFilesContainer ===>>>', brandingFilesContainer);

    const brandingAndAdvertising = await brandingAndAdvertisingModels.insertBrandingAndAdvertisingData(advertisingData, brandingFilesContainer);

    console.log('brandingAndAdvertising id ==>>', brandingAndAdvertising.rows[0].id);
    const advertisingId = brandingAndAdvertising.rows[0].id;
    if(brandingAndAdvertising && brandingAndAdvertising.rows[0].id){
        return {
          advertisingId,
          brandingFilesContainer
        }
    } 
}

module.exports.updateBrandingAndAdvertising = async (advertisingId, updatedAdvertisingData, files) => {
    console.log('filesToUpdate in service ==>>', files);
    console.log('updatedAdvertisingData ==>>', updatedAdvertisingData);
    let updatedBrandingFilesData = {};
    if(Object.keys(files).length > 0){
      const updatedFacultyRecognitionFilesArray = files.facultyRecognitionDocuments;
      const updatedFacultyAwardFilesArray = files.facultyAwardDocuments;
      const updatedStaffAwardFilesArray = files.staffAwardDocuments;
      const updatedAlumniAwardFilesArray = files.alumniAwardDocuments;
      const updatedStudentAwardFilesArray = files.studentAwardDocuments; 
      const updatedInternationalLinkageFilesArray = files.internationalLinkageDocuments;
      const updatedConferenceParticipationFilesArray = files.conferenceParticipationDocuments;
      const updatedOrganisingConferenceFilesArray = files.organisingConferenceDocuments;
      const updatedStudentEventParticipationFilesArray = files.studentEventParticipationDocuments;
      const updatedNewspaperArticleFilesArray = files.newspaperArticleDocuments;

      // files array container
      const updatedFilesArrayContainer = [
            updatedFacultyRecognitionFilesArray,
            updatedFacultyAwardFilesArray,
            updatedStaffAwardFilesArray,
            updatedAlumniAwardFilesArray,
            updatedStudentAwardFilesArray,
            updatedInternationalLinkageFilesArray,
            updatedConferenceParticipationFilesArray,
            updatedOrganisingConferenceFilesArray,
            updatedStudentEventParticipationFilesArray,
            updatedNewspaperArticleFilesArray
      ];
      console.log(' updatedfilesArrayContainer service ===>>', updatedFilesArrayContainer);
      const keyNameArray = [
          'facultyRecognitionDocuments',
          'facultyAwardDocuments',
          'staffAwardDocuments',
          'alumniAwardDocuments',
          'studentAwardDocuments',
          'internationalLinkageDocuments',
          'conferenceParticipationDocuments',
          'organisingConferenceDocuments',
          'studentEventParticipationDocuments',
          'newspaperArticleDocuments'
      ];

      const advertisingFilesStringContainer = [];
      // now push the string value into filesStringContainer array
      for(let i = 0; i <= updatedFilesArrayContainer.length - 1; i++){
            var filesString = '';
            if (updatedFilesArrayContainer[i]) {
              for (j = 0; j <= updatedFilesArrayContainer[i].length - 1; j++) {
                if (updatedFilesArrayContainer[i][j].filename) {
                  filesString +=
                    updatedFilesArrayContainer[i][j].filename + ",";
                }
              }
            }
            advertisingFilesStringContainer.push(filesString);
      }
      console.log('advertisingFilesStringContainer ===>>>', advertisingFilesStringContainer);
      // appending key and value into object container
      for(k = 0; k <= advertisingFilesStringContainer.length - 1; k++){
          const keyName = keyNameArray[k];
          const valueString = advertisingFilesStringContainer[k];
          if(valueString){
            updatedBrandingFilesData[keyName] = valueString;
          }
      }
      
    }
    console.log('updatedBrandingFilesData ===>>>', updatedBrandingFilesData)

    const brandingAndAdvertising = await brandingAndAdvertisingModels.updateBrandingAdvertising(advertisingId, updatedAdvertisingData, updatedBrandingFilesData);
    console.log('brandingAndAdvertising in service ===>>>', brandingAndAdvertising)

    if (brandingAndAdvertising && brandingAndAdvertising.rowCount === 1) {
        return {
            status: 'done',
            message: 'updated successfully',
            updatedBrandingFilesData
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