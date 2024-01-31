const teachingExecellanceModel = require('../models/teaching-excellance.model');
const fs = require('fs');
const path = require('path');

// uploaded file path for dowload
const uploadFolder = path.join(__dirname, '..', '..', 'uploads');
console.log('uploadFolder in side teaching service ==>>', uploadFolder)

module.exports.fetchTeachingExecellanceData = async() => {
    const teachingExecellanceData = await teachingExecellanceModel.fetchTeachingExecellance();
    return teachingExecellanceData;
}

module.exports.insertTeachingExecellance = async(teachingExecellance, files) => {
    const pedagogyInnovationFile = files.pedagogyInnovationFile[0].filename;
    const fdpProgramFile = files.fdpProgramFile [0].filename;
    const workShopFile = files.workShopFile[0].filename;
    const invitingFacultyFile = files.invitingFacultyFile[0].filename;
    const programOrientationFile = files.programOrientationFile[0].filename;
    const teachingExecellanceData = await teachingExecellanceModel.insertTeachingExecellanceData(teachingExecellance, pedagogyInnovationFile, fdpProgramFile, workShopFile, invitingFacultyFile, programOrientationFile);
    if(teachingExecellanceData){
        return {
            status : 'done',
            teachingId : teachingExecellanceData.rows[0].id
        }
    }
}

module.exports.updatedTeachingExecellance = async(teachingId, updatedTeachingExecellance, teachingDocumentToBeUpdate) => {
    // const pedagogyInnovationFile = files.pedagogyInnovationFile[0].filename;
    // const fdpProgramFile = files.fdpProgramFile [0].filename;
    // const workShopFile = files.workShopFile[0].filename;
    // const invitingFacultyFile = files.invitingFacultyFile[0].filename;
    // const programOrientationFile = files.programOrientationFile[0].filename; 
    const updatedTeachingExecellanceData = await teachingExecellanceModel.updateTeachingExecellance(teachingId, updatedTeachingExecellance, teachingDocumentToBeUpdate);
    console.log('updated data in services ==>>>::::', updatedTeachingExecellanceData);
    if(updatedTeachingExecellanceData && updatedTeachingExecellanceData.rowCount === 1){
        return {
            status : 'done',
            massage : ' updated successfully'
        }
    }    

}

module.exports.deleteTeachingExecellance = async (teachingId) => {
    console.log('Id in Service ==>', teachingId);
    const teachingExecellance = await teachingExecellanceModel.deleteTeachingExecellance(teachingId);
    if(teachingExecellance.rowCount === 1 && teachingExecellance){
        return{
            status : 'done',
            massage : 'deleted successfully'
        }
    }
}

module.exports.viewTeachingExecellance = async(teachingId) => {
    const teachingExecellanceViewData = await teachingExecellanceModel.teachingExecellanceView(teachingId);
    console.log('teachingExecellanceViewData' , teachingExecellanceViewData.rows[0]);
    if(teachingExecellanceViewData && teachingExecellanceViewData.rowCount === 1){
        return teachingExecellanceViewData.rows[0]
    }
}
// for download
module.exports.downloadFile = (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadFolder, filename);
    console.log("filePath ==>>", filePath);
    console.log("filename ==>>>", filename);
  
    // Extract the original filename from the provided filename
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
// for view file
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
