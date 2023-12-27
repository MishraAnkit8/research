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