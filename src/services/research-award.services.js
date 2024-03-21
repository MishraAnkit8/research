

const researchawardModels = require('../models/research-award.models');

module.exports.renderResearchAwardData = async() => {

    const researchAwardData = await researchawardModels.fetchResearchAward();
    console.log('data in service ===>>>>', researchAwardData.rowCount);
    return  researchAwardData ? {
        status : "Done",
        message : "Data Fetch Successfully",
        researchAwardData : researchAwardData.rows,
        rowCount : researchAwardData.rowCount
    } : {
        status : "Failed",
        message : "Unable To Fetch Data"
    }
}
