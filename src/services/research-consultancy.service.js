const { updatedConsultantData } = require('../controllers/research-project-consultancy.controller');
const researchCunsultancyModel = require('../models/research-consultancy.models');


module.exports.fetchResearConsultacyData = async() => {
    const researchConsultancyData = await researchCunsultancyModel.fetchResearchConsultancy();
    console.log('researchConsultancyData', researchConsultancyData.rows[0]);
    return researchConsultancyData.rows
}

module.exports.insertResearchConsultancyData = async(body , filename) => {
    const researchCunsultancyData = body
    const researchProjectConsultancy = await researchCunsultancyModel.insertResearhcProjectConstancyData(researchCunsultancyData , filename)
    if(researchProjectConsultancy && researchProjectConsultancy.rows[0].id) {
        return {
            status : 'done',
            consultantId : researchProjectConsultancy.rows[0].id,
            massage : 'data inserted successfully'
        }
    }
}

module.exports.updateResearchConstant = async(consultantId, updatedConsultant, updateFileName) => {
    const updateResearchProjectConstant = await researchCunsultancyModel.updateResearchConsultantData(consultantId ,updatedConsultant, updateFileName);
    if(updateResearchProjectConstant && updateResearchProjectConstant.rowCount === 1){
        return updateResearchProjectConstant
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

module.exports.viewReseachProjectData = async({consultantId}) => {
    const researchConsultancy = await researchCunsultancyModel.viewResearchConsultancy(consultantId);
    console.log('researchConsultancy ==>>', researchConsultancy.rows[0])
    return researchConsultancy.rows[0]
}