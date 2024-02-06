
const fs = require('fs');
const path = require('path');

const researchCunsultancyModel = require('../models/research-consultancy.models');

const uploadFolder = path.join(__dirname, '..', '..', 'uploads');

module.exports.downloadFile = (req, res) => {
    const filename = req.params.fileName;
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



module.exports.fetchResearConsultacyData = async() => {
    const researchConsultancyData = await researchCunsultancyModel.fetchResearchConsultancy();
    console.log('researchConsultancyData', researchConsultancyData.rows[0]);
    return researchConsultancyData
}

module.exports.insertResearchConsultancyData = async(body , files) => {
    const researchCunsultancyData = body
    console.log('files in service ===>>>', files);
    var consultancyDataFiles = '';
    for (let i = 0; i <= files.length - 1; i++){
          if(files[i].filename){
            consultancyDataFiles += files[i].filename + ',';
          }
    }
    console.log('consultancyDataFiles ===>>>>', consultancyDataFiles)
    const researchProjectConsultancy = await researchCunsultancyModel.insertResearhcProjectConstancyData(researchCunsultancyData , consultancyDataFiles)
    if(researchProjectConsultancy && researchProjectConsultancy.rows[0].id) {
        return {
            status : 'done',
            consultantId : researchProjectConsultancy.rows[0].id,
            massage : 'data inserted successfully',
            consultancyDataFiles
        }
    }
}

module.exports.updateResearchConstant = async(consultantId, updatedConsultant, files) => {
  if(files){
    var updatedConsultantFilesData = '';
    for(let i =0; i <= files.length - 1; i++){
      if(files[i].filename){
        updatedConsultantFilesData += files[i].filename  + ',';
      }
    }
    console.log('files name  in services ==>>>', updatedConsultantFilesData)
    const updateResearchProjectConstant = await researchCunsultancyModel.updateResearchConsultantData(consultantId ,updatedConsultant, updatedConsultantFilesData);
    if(updateResearchProjectConstant && updateResearchProjectConstant.rowCount === 1){
      return { updateResearchProjectConstant, updatedConsultantFilesData };
    }
  }
  else{
    const updateResearchProjectConstant = await researchCunsultancyModel.updateResearchConsultantData(consultantId ,updatedConsultant);
    if(updateResearchProjectConstant && updateResearchProjectConstant.rowCount === 1){
        return updateResearchProjectConstant
    }
  }
    
}

module.exports.deleteResearchConsultant = async({consultantId}) => {
    console.log('Id in serevice for delete ', consultantId)
    const deleteRseachConsultancy = await researchCunsultancyModel.deleteResearchConsultantData(consultantId);
    if(deleteRseachConsultancy.rowCount === 1){
        return {
            status : 'done',
            massage : 'deleted successfully'
        }
    }
}

module.exports.viewReseachProjectData = async(consultantId) => {
    const researchConsultancy = await researchCunsultancyModel.viewResearchConsultancy(consultantId);
    console.log('researchConsultancy ==>>', researchConsultancy.rows[0])
    return researchConsultancy.rows[0]
}