const consultancyFormService = require('../services/NMIMS-consultancy-form.service');

module.exports.renderNmimsConsultancyForm = async(req, res, next) => {

    const renderConsultancyData = await consultancyFormService.fetchConsultancyFormData();
    console.log('renderConsultancyData in controller ===>>>>', renderConsultancyData)
    res.render('NMIMS-consultancy-form', {
        status : renderConsultancyData.status,
        message : renderConsultancyData.message,
        consultancyFormData : renderConsultancyData.consultancyFormData,
        rowCount : renderConsultancyData.rowCount,
        errorCode : renderConsultancyData.errorCode ? renderConsultancyData.errorCode : null
    })
}


module.exports.viewConsultancyFormApprovalData = async(req, res, next) => {
    console.log('nmimsConsultancyFormId in controller ===>>>>', req.body);


}