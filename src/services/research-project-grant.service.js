const researchCunsultancyModel = require('../models/research-project-grant.models');

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
    const consultantId = researchProjectConsultancy.researchConTable.rows[0].id;
    console.log('consultantId ===>>>>', consultantId);
    if(researchProjectConsultancy) {
        return {
            status : 'Done',
            consultantId,
            massage : 'data inserted successfully',
            consultancyDataFiles,
            authorName
        }
    }
}

module.exports.updateResearchConstant = async(consultantId, body, files) => {
  const updatedResearchGrant = body;
  const updatedConsultantFilesData = files ?.map(file => file.filename).join(',')
  const updateResearchProjectConstant = await researchCunsultancyModel.updateResearchConsultantData(consultantId ,updatedResearchGrant, updatedConsultantFilesData);
  console.log('updateResearchProjectConstant =====>>>>>', updateResearchProjectConstant);
  return {
    status : 'Done',
    message : 'Updated successfully',
    updateResearchProjectConstant,
    updatedConsultantFilesData
  }
    
}

module.exports.deleteResearchConsultant = async({consultantId}) => {
    console.log('Id in serevice for delete ', consultantId)
    const deleteRseachConsultancy = await researchCunsultancyModel.deleteResearchConsultantData(consultantId);
    if(deleteRseachConsultancy.rowCount === 1){
        return {
            status : 'Done',
            massage : 'Deleted Successfully'
        }
    }
}

module.exports.viewReseachProjectData = async(consultantId) => {
    console.log('consultantId in servicve ===>>>', consultantId)
    const researchConsultancy = await researchCunsultancyModel.viewResearchConsultancy(consultantId);
    console.log('researchConsultancy ==>>', researchConsultancy.rows[0])
    return researchConsultancy.rows[0]
}