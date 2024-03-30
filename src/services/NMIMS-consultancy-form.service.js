const consultancyFormModels = require('../models/NMIMS-consultancy-form.models');


module.exports.fetchConsultancyFormData = async() => {
    const consultancyFormRecord = await consultancyFormModels.renderNmimsConsultancyApprovalForm();

    console.log('consultancyFormRecord ===>>>>', consultancyFormRecord);
    return consultancyFormRecord.status === "Done" ? {
        status : consultancyFormRecord.status,
        message : consultancyFormRecord.message,
        consultancyFormData : consultancyFormRecord.consultancyFormData,
        rowCount : consultancyFormRecord.rowCount,
        facultyData : consultancyFormRecord.facultyData
    } : {
        status : consultancyFormRecord.status,
        message : consultancyFormRecord.message,
        errorCode : consultancyFormRecord.errorCode
    }
}



module.exports.insertApprovalFormDataService = async(body) => {
    const consultancyFormData = body.consultancyObject;
    console.log('consultancyFormData in service ==>>>', consultancyFormData)

    const consultancyApprovalFormData =  await consultancyFormModels.insertConsultancyApprovalFormData(consultancyFormData);

    console.log('consultancyApprovalFormData ====>>>>', consultancyApprovalFormData);

    return consultancyApprovalFormData.status === "Done" ? {
        status : consultancyApprovalFormData.status,
        message : consultancyApprovalFormData.message,
        nmimsConsultancyFormId : consultancyApprovalFormData.nmimsConsultancyFormId,
        rowCount : consultancyApprovalFormData.rowCount,
        consultancyFormData : consultancyFormData
    } : {
        status : consultancyApprovalFormData.status,
        message : consultancyApprovalFormData.message,
        errorCode : consultancyApprovalFormData.errorCode
    }
}

module.exports.updateConsultancyApprovalData = async(body) => {
    const nmimsConsultancyFormId = body.updatedConsultancyObject.nmimsConsultancyFormId;
    const updatedConsultancyApprovalRecord = body.updatedConsultancyObject;

    const updateConsultancyApprovalFormData  = await consultancyFormModels.updateApprovalFormData(nmimsConsultancyFormId, updatedConsultancyApprovalRecord);
    console.log('updateConsultancyApprovalFormData ====>>>>>', updateConsultancyApprovalFormData);

    return updateConsultancyApprovalFormData.status === "Done" ? {
        status : updateConsultancyApprovalFormData.status,
        message : updateConsultancyApprovalFormData.message,
        updatedConsultancyApprovalRecord : updatedConsultancyApprovalRecord,
        facultTableData : updateConsultancyApprovalFormData.facultTableData
    } : {
        status : updateConsultancyApprovalFormData.status,
        message : updateConsultancyApprovalFormData.message,
        errorCode : updateConsultancyApprovalFormData.errorCode
    }
}


module.exports.deleteconsultancyFormRecord = async (body) => {
    const nmimsConsultancyFormId = body.nmimsConsultancyFormId;

    const deleteApprovalformData = await consultancyFormModels.deleteconsultancyApprovalformData(nmimsConsultancyFormId);

    console.log('deleteApprovalformData ===>>>>', deleteApprovalformData);

    return deleteApprovalformData.status === "Done" ? {
        status : deleteApprovalformData.status,
        message : deleteApprovalformData.message
    } :
    {
        status : deleteApprovalformData.status,
        message : deleteApprovalformData.message,
        errorCode : deleteApprovalformData.errorCode
    }
}


module.exports.viewApprovedformRecord = async (body) => {
    const nmimsConsultancyFormId = body.nmimsConsultancyFormId;

    const approvalFormData = await consultancyFormModels.viewConsultancyApprovalForm(nmimsConsultancyFormId);

    console.log('approvalFormData ===>>>>>>', approvalFormData);
    const advancedPayment = approvalFormData.approvedFormData[0].advanced_payment;
    console.log('advancedPayment ===>>>', advancedPayment);
    const finalPayment = approvalFormData.approvedFormData[0].final_payment;
    console.log('finalPayment ===>>>', finalPayment)
    const totalAmount = advancedPayment + finalPayment;
    console.log('totalAmount===>>>', totalAmount);
    const facultyshares = totalAmount * 70 / 100;
    console.log('facultyshares ===>>>>', facultyshares)
}