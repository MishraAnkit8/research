
const researchAwardServices = require('../services/research-award.services');
module.exports.renderResearchAward = async(req, res, next) => {
    
    const researchAwardRenderedData = await researchAwardServices.renderResearchAwardData();
    console.log('researchAwardRenderedData :::::', researchAwardRenderedData);
    res.render('research-award' , {
        status : researchAwardRenderedData.status,
        message : researchAwardRenderedData.message,
        rowCount : researchAwardRenderedData.rowCount,
        researchAwardData : researchAwardRenderedData.researchAwardData ? researchAwardRenderedData.researchAwardData : null
    })
}


module.exports.insertResearchAwardFormData = async(req, res, next) => {
    console.log('data in controller ===>>>>>', req.body);
}