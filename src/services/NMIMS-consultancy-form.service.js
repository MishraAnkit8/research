const consultancyFormModels = require('../models/NMIMS-consultancy-form.models');


module.exports.fetchConsultancyFormData = async() => {
    const consultancyFormRecord = await consultancyFormModels.renderNmimsConsultancyApprovalForm();

    console.log('consultancyFormRecord ===>>>>', consultancyFormRecord);
    return consultancyFormRecord.status === "Done" ? {
        status : consultancyFormRecord.status,
        message : consultancyFormRecord.message,
        consultancyFormData : consultancyFormRecord.consultancyFormData,
        rowCount : consultancyFormRecord.rowCount
    } : {
        status : consultancyFormRecord.status,
        message : consultancyFormRecord.message,
        errorCode : consultancyFormRecord.errorCode
    }
}