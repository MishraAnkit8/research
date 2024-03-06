const researchCunsultancyModel = require('../models/research-consultancy.models');

module.exports.fetchResearConsultacyData = async() => {
    const researchConsultancyData = await researchCunsultancyModel.fetchResearchConsultancy();
    // console.log('researchConsultancyData', researchConsultancyData.rows[0]);
    return researchConsultancyData
}

module.exports.insertResearchConsultancyData = async(body , files) => {
    const researchCunsultancyData = body
    const externalAuthors = body.externalAuthors;
    const internalAuthors = body.internalAuthors;
    console.log('internalAuthors ====>>>>>', internalAuthors)
    const authorName = externalAuthors ?? internalAuthors
    console.log('authorName ====>>>>', authorName)
    console.log('externalAuthors ====>>>>>', externalAuthors);
    console.log('files in service ===>>>', files);
    var consultancyDataFiles = '';
    for (let i = 0; i <= files.length - 1; i++){
          if(files[i].filename){
            consultancyDataFiles += files[i].filename + ',';
          }
    }
    console.log('consultancyDataFiles ===>>>>', consultancyDataFiles)
    const researchProjectConsultancy = await researchCunsultancyModel.insertResearhcProjectConstancyData(researchCunsultancyData , consultancyDataFiles);
    const consultantId = researchProjectConsultancy.researchConTable.rows[0];
    console.log('consultantId ===>>>>', consultantId);
    if(researchProjectConsultancy) {
        return {
            status : 'done',
            consultantId,
            massage : 'data inserted successfully',
            consultancyDataFiles,
            authorName
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