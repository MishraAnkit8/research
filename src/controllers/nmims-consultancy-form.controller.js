const consultancyFormService = require('../services/NMIMS-consultancy-form.service');

module.exports.renderNmimsConsultancyForm = async(req, res, next) => {

    const renderConsultancyData = await consultancyFormService.fetchConsultancyFormData();
    console.log('renderConsultancyData in controller ===>>>>', renderConsultancyData)
    res.render('NMIMS-consultancy-form', {
        status : renderConsultancyData.status,
        message : renderConsultancyData.message,
        consultancyFormData : renderConsultancyData.consultancyFormData,
        rowCount : renderConsultancyData.rowCount,
        facultyData : renderConsultancyData.facultyData,
        errorCode : renderConsultancyData.errorCode ? renderConsultancyData.errorCode : null
    })
}


module.exports.viewConsultancyFormApprovalData = async(req, res, next) => {
    console.log('nmimsConsultancyFormId in controller ===>>>>', req.body);

    const consultancyApprovalFormData = await consultancyFormService.viewApprovedformRecord(req.body) ;

    console.log('consultancyApprovalFormData ===>>>>', consultancyApprovalFormData);

    const statusCode = consultancyApprovalFormData.status === "Done" ? 200 :  (consultancyApprovalFormData.errorCode ? 400 : 500);

    res.status(statusCode).send({
        status : consultancyApprovalFormData.status,
        message : consultancyApprovalFormData.message,
        approvalFormData : consultancyApprovalFormData.approvalFormData,
        totalExpensesAmount : consultancyApprovalFormData.totalExpensesAmount,
        commencementDateFormate : consultancyApprovalFormData.commencementDateFormate,
        completionDateFormate : consultancyApprovalFormData.completionDateFormate,
        totalFees : consultancyApprovalFormData.totalFees,
        facultyShareAmount : consultancyApprovalFormData.facultyShareAmount,
        nmimsShareAmount : consultancyApprovalFormData.nmimsShareAmount,
        totalAmount : consultancyApprovalFormData.totalAmount,
        aToFTotalAmount : consultancyApprovalFormData.aToFTotalAmount,
        gstCharges : consultancyApprovalFormData.gstCharges,
        grandTotalAmount : consultancyApprovalFormData.grandTotalAmount,
        errorCode : consultancyApprovalFormData.errorCode ? consultancyApprovalFormData.errorCode : null
    })


}


module.exports.insertconsultancyFormData = async(req, res, next) => {
    console.log('req.body in controller ====>>>>>', req.body);

    const insertApprovalFormData = await consultancyFormService.insertApprovalFormDataService(req.body);

    console.log('insertApprovalFormData ===>>>>>', insertApprovalFormData);
    const statusCode = insertApprovalFormData.status === "Done" ? 200 : (insertApprovalFormData.errorCode ? 400 : 500);

    res.status(statusCode).send({
        status : insertApprovalFormData.status,
        message : insertApprovalFormData.message,
        nmimsConsultancyFormId : insertApprovalFormData.nmimsConsultancyFormId,
        rowCount : insertApprovalFormData.rowCount,
        consultancyFormData : insertApprovalFormData.consultancyFormData,
        errorCode : insertApprovalFormData.errorCode ? insertApprovalFormData.errorCode : null
    })
}


module.exports.updateConsultancyApprovalFormData = async(req, res, next) => {
    console.log('data in controller ====>>>>', req.body);

    const updatedApprovalForm = await consultancyFormService.updateConsultancyApprovalData(req.body);

    console.log('updatedApprovalForm ====>>>>>>', updatedApprovalForm)
    const statusCode = updatedApprovalForm.status === "Done" ? 200 : (updatedApprovalForm.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : updatedApprovalForm.status,
        message : updatedApprovalForm.message,
        updatedConsultancyApprovalRecord : updatedApprovalForm.updatedConsultancyApprovalRecord,
        facultTableData : updatedApprovalForm.facultTableData,
        errorCode : updatedApprovalForm.errorCode ? updatedApprovalForm.errorCode : null
    })
}

module.exports.deleteConsultancyFormData = async(req, res, next) => {
    console.log('sata in controller', req.body);

    const deleteConsultancyForm = await consultancyFormService.deleteconsultancyFormRecord(req.body);

    console.log('deleteConsultancyForm in controller ===>>>', deleteConsultancyForm);

    const statusCode = deleteConsultancyForm.status === "Done" ? 200 : (deleteConsultancyForm.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : deleteConsultancyForm.status,
        message : deleteConsultancyForm.message,
        errorCode : deleteConsultancyForm.errorCode ? deleteConsultancyForm.errorCode : null
    })
}