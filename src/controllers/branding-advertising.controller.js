const fs = require('fs');
const path = require('path');

const brandingAndAdvertisingServices = require('../services/branding-advertising.service');

const uploadFolder = path.join(__dirname, '..', '..', 'uploads');
console.log('uploadFolder ==>>', uploadFolder);

module.exports.downloadFile = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadFolder, filename);
  console.log("filePath ==>>", filePath);
  console.log("filename ==>>>", filename);
  res.download(filePath, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).send("Error downloading file");
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



module.exports.renderBrandingAndAdvertising = async(req, res, next) => {
    const brandingAndAdvertising = await brandingAndAdvertisingServices.fetchBrandingandAdvertisingData();
    if(brandingAndAdvertising){
        res.render('branding-advertising' , {
            advertisingData : brandingAndAdvertising.rows,
            rowCount : brandingAndAdvertising.rowCount
        })
    }
}

module.exports.insertBrandingAndAdvertising = async(req, res, next) => {
    const advertisingData = req.body;
    console.log('data comming from frontend ==>>', advertisingData);
    console.log('files ==>>', res.files);
    const {facultyRecognitionDocuments, facultyAwardDocuments, staffAwardDocuments, alumniAwardDocuments, studentAwardDocuments, internationalLinkageDocuments, conferenceParticipationDocuments, organisingConferenceDocuments,
            studentEventParticipationDocuments, newspaperArticleDocuments} = req.files;

    const brandingAndAdvertising = await brandingAndAdvertisingServices.insertBrandingAdvertising(req.body, req.files);
    console.log('brandingAndAdvertising ==>>', brandingAndAdvertising)
    if(brandingAndAdvertising){
        res.status(200).send({
            status : "done" ,
            advertisingData : advertisingData,
            advertisingId : brandingAndAdvertising,
            facultyRecognitionDocuments,
            facultyAwardDocuments,
            staffAwardDocuments,
            alumniAwardDocuments,
            studentAwardDocuments,
            internationalLinkageDocuments,
            conferenceParticipationDocuments,
            organisingConferenceDocuments,
            studentEventParticipationDocuments,
            newspaperArticleDocuments
        })
    }
}

module.exports.updateBrandingAdvertising = async(req, res, next) => {
    const updatedAdvertisingData = req.body;
    const advertisingId = req.body.advertisingId;
    console.log('files in controller ===>>', req.files)
    console.log('updated advertising data ==>>', updatedAdvertisingData);
    const {facultyRecognitionDocuments, facultyAwardDocuments, staffAwardDocuments, alumniAwardDocuments, studentAwardDocuments, internationalLinkageDocuments, conferenceParticipationDocuments, organisingConferenceDocuments,
            studentEventParticipationDocuments, newspaperArticleDocuments} = req.files;
    const filesToUpdate = {
                facultyRecognitionDocuments, facultyAwardDocuments, staffAwardDocuments, alumniAwardDocuments, studentAwardDocuments,
                internationalLinkageDocuments, conferenceParticipationDocuments, organisingConferenceDocuments, studentEventParticipationDocuments, newspaperArticleDocuments
            };
    const updatedAdvertising = await brandingAndAdvertisingServices.updateBrandingAndAdvertising(advertisingId, updatedAdvertisingData, filesToUpdate);
    if(updatedAdvertising.status === 'done'){
        res.status(200).send({
            status : 'done',
            massage : 'data updated suceesfully',
            updatedAdvertisingData : updatedAdvertisingData,
            facultyRecognitionDocuments,
            facultyAwardDocuments,
            staffAwardDocuments,
            alumniAwardDocuments,
            studentAwardDocuments,
            internationalLinkageDocuments,
            conferenceParticipationDocuments,
            organisingConferenceDocuments,
            studentEventParticipationDocuments,
            newspaperArticleDocuments
        })
    }
    
}

module.exports.viewBrandingadvertising = async(req, res, next) => {
    console.log('id ==>>', req.body)
    const {advertisingId} = req.body;
    const brandingAndAdvertisingview = await brandingAndAdvertisingServices.viewBrandingadvertising(advertisingId);
    console.log('brandingAndAdvertisingview' , brandingAndAdvertisingview)
    if(brandingAndAdvertisingview) {
        res.status(200).send({
            status : 'done',
            brandingAndAdvertisingview : brandingAndAdvertisingview
        })
    }
}

module.exports.deleteBrandingAdvertising = async(req, res, next) => {
    console.log('id ==>>', req.body);
    const {advertisingId} = req.body;
    const brandingAndadvertisingDelete = await brandingAndAdvertisingServices.deleteAdvertising(advertisingId);
    if(brandingAndadvertisingDelete.status === 'done'){
        res.status(200).send({
            status : 'done',
            massage : 'deleted successfully'
        })
    }
}