const moment = require('moment');

const consultancyFormModels = require('../models/NMIMS-consultancy-form.models');


module.exports.fetchConsultancyFormData = async(userName) => {
    const consultancyFormRecord = await consultancyFormModels.renderNmimsConsultancyApprovalForm(userName);

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



module.exports.insertApprovalFormDataService = async(body, files, userName) => {
    const consultancyFiles = files?.map(file => file.filename).join(',');
    console.log('consultancyFiles ===>>>>>>>', consultancyFiles);
    const consultancyFormData = body;
    console.log('consultancyFormData in service ==>>>', consultancyFormData)

    const consultancyApprovalFormData =  await consultancyFormModels.insertConsultancyApprovalFormData(consultancyFormData, consultancyFiles, userName);

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

module.exports.updateConsultancyApprovalData = async(body, files, userName) => {
    console.log('body ====>>>>>', body)
    const nmimsConsultancyFormId = body.nmimsConsultancyFormId;
    console.log(' nmimsConsultancyFormId===>>>>>>', nmimsConsultancyFormId);
    const updatedConsultancyApprovalRecord = body;
    const consultancyFiles = files?.map(file => file.filename).join(',');
    console.log('consultancyFiles ===>>>>', consultancyFiles)

    const updateConsultancyApprovalFormData  = await consultancyFormModels.updateApprovalFormData(nmimsConsultancyFormId, updatedConsultancyApprovalRecord, consultancyFiles, userName);
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


module.exports.viewApprovedformRecord = async (body, userName) => {
    const nmimsConsultancyFormId = body.nmimsConsultancyFormId;

    const approvalFormData = await consultancyFormModels.viewConsultancyApprovalForm(nmimsConsultancyFormId, userName);

    console.log('approvalFormData ===>>>>>>', approvalFormData);
    const advancedPayment = approvalFormData.approvedFormData[0].advanced_payment;
    console.log('advancedPayment ===>>>', advancedPayment);
    const finalPayment = approvalFormData.approvedFormData[0].final_payment;
    console.log('finalPayment ===>>>', finalPayment)
    const totalAmount = advancedPayment + finalPayment;
    console.log('totalAmount===>>>', totalAmount);
    const facultySharesPercentage = parseInt(approvalFormData.approvedFormData[0].faculty_shares);
    const nmimsSharePercentage = parseInt(approvalFormData.approvedFormData[0].nmims_shares);

    console.log('facultySharesPercentage ===>>>>', facultySharesPercentage);
    const facultyShareAmount = totalAmount * facultySharesPercentage / 100;
    const nmimsShareAmount = totalAmount * nmimsSharePercentage/100;
    console.log('nmimsShareAmount ::::', nmimsShareAmount);
    console.log('facultyShareAmount ===>>>', facultyShareAmount);

    const totalFees = approvalFormData.approvedFormData[0].session_count_per_days * approvalFormData.approvedFormData[0].per_session_fees;
    console.log('totalFees ===>>>>', totalFees);

    const totalExpensesAmount = approvalFormData.approvedFormData[0].research_staff_expenses + approvalFormData.approvedFormData[0].travel + 
                                approvalFormData.approvedFormData[0].computer_charges + approvalFormData.approvedFormData[0].nmims_facility_charges
                                + approvalFormData.approvedFormData[0].miscellaneous_including_contingency;

    console.log('totalExpensesAmount ====>>>>>', totalExpensesAmount);
    const commencementDate = approvalFormData.approvedFormData[0].commencement_date;
    const commencementDateFormate = moment(commencementDate).format('DD-MM-YYYY');
    console.log('commencementDateFormate ===>>>>', commencementDateFormate);
    const completionDate = approvalFormData.approvedFormData[0].completion_date;
    const completionDateFormate = moment(completionDate).format('DD-MM-YYYY');
    console.log('completionDateFormate ====>>>', completionDateFormate);

    const aToFTotalAmount = approvalFormData.approvedFormData[0].gross_fees + approvalFormData.approvedFormData[0].research_staff_expenses + approvalFormData.approvedFormData[0].travel + 
    approvalFormData.approvedFormData[0].computer_charges + approvalFormData.approvedFormData[0].nmims_facility_charges
    + approvalFormData.approvedFormData[0].miscellaneous_including_contingency;
    console.log('aToFTotalAmount ====>>>>>', aToFTotalAmount);

    const gstCharges = totalAmount * 18 / 100;
    console.log('gstCharges ====>>>>', gstCharges);

    const grandTotalAmount = totalExpensesAmount + aToFTotalAmount + gstCharges + totalFees;
    console.log('grandTotalAmount ===>>>', grandTotalAmount);

    return approvalFormData.status === "Done" ? {
        status : approvalFormData.status,
        message : approvalFormData.message,
        approvalFormData : approvalFormData.approvedFormData[0],
        totalExpensesAmount : totalExpensesAmount,
        commencementDateFormate : commencementDateFormate,
        completionDateFormate : completionDateFormate,
        totalFees : totalFees,
        facultyShareAmount : facultyShareAmount,
        nmimsShareAmount : nmimsShareAmount,
        totalAmount : totalAmount,
        aToFTotalAmount : aToFTotalAmount,
        gstCharges : gstCharges,
        grandTotalAmount : grandTotalAmount

    } : {
        status : approvalFormData.status,
        message : approvalFormData.message,
        errorCode : approvalFormData.errorCode
    };
}