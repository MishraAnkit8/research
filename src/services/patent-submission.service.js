const fs = require('fs');
const path = require('path');

const patentFormsModels = require('../models/patent-submission.models');



const uploadFolder = path.join(__dirname, '..', '..', 'uploads');

module.exports.downloadFile = (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadFolder, filename);
    console.log("filePath ==>>", filePath);
    console.log("filename ==>>>", filename);
  
    //  original filename from the provided filename
    const originalFilename = filename.split('_').slice(1).join('_');
  
    // PDF
    res.setHeader('Content-Type', 'application/pdf');
  
    // filename for the download
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

module.exports.fetchPatentForm = async() => {
    const patentSubmissionForm = await patentFormsModels.fetchPatentSubMissionForms();
    return patentSubmissionForm;
}

module.exports.insertPatentFormData = async(body , file) => {
    console.log('patentData in service', body);
    console.log('file name in service ==>>', file);
    const insertPatentData = await patentFormsModels.insertPatentData(body, file);
    console.log('insert Id ', insertPatentData.rows[0])
    return insertPatentData; 
}


module.exports.updatPatentSubmission = async(body) => {
    console.log('updated Data in Service ::', body)
    const updatedPatentData = body;
    const patentId = body.patentId;
    if(body.patentDocument){
        const patentDocument = body.patentDocument;
        console.log('file name  In service ==>>', patentDocument)
        console.log('ID in service >>', body.patentId)
        const upadtedPatentSubmissionData = await patentFormsModels.updatePatentsubmissionData(updatedPatentData, patentId, patentDocument );
        console.log('Id for updation  ==>>', patentId);
        if(upadtedPatentSubmissionData && upadtedPatentSubmissionData.rowCount === 1){
            return{
                status : 'done',
                massage : 'data updated successFully'
            }
        }
    }
    else{
        console.log('ID in service >>', body.patentId)
        const upadtedPatentSubmissionData = await patentFormsModels.updatePatentsubmissionData(updatedPatentData, patentId);
        console.log('Id for updation  ==>>', patentId);
        if(upadtedPatentSubmissionData && upadtedPatentSubmissionData.rowCount === 1){
            return{
                status : 'done',
                massage : 'data updated successFully'
            }
        }
    }
   
}

module.exports.deletePatentSubmission = async(body) => {
    const {patentId} = body;
    console.log('patent Id in Service for deletion ', patentId);
    const deletePatentData = await patentFormsModels.deletePatentSubmissionData(patentId);
    if(deletePatentData.rowCount === 1){
        return {
            status : 'done',
            massage : 'data Deleted Successfully'
        }
    }
    else{
        return {
            status : 'failed',
            massage : 'failed to delete'
        }
    }
}

module.exports.viewPatentsubmission = async(patentId) => {
    console.log('id', patentId)
    const patentDataViewed = await patentFormsModels.viewPatentSubmission(patentId);
    if(patentDataViewed && patentDataViewed.rowCount === 1){
        return patentDataViewed
    }
}