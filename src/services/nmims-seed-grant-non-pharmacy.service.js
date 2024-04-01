const moment = require('moment');

const seedGrantModels = require('../models/nmims-seed-grant-non-pharmacy.models');


module.exports.fetchNoFormacyForm = async() => {
    const seedGrantFormData = await seedGrantModels.renderSeedGrantNonFormacy();

    console.log('seedGrantFormData ===>>>>', seedGrantFormData);
    return seedGrantFormData.status === "Done" ? {
        status : seedGrantFormData.status,
        message : seedGrantFormData.message,
        seedGrantFormData : seedGrantFormData.seedGrantFormDataRows,
        rowCount : seedGrantFormData.rowCount,
        facultyData : seedGrantFormData.facultyData
    } : {
        status : seedGrantFormData.status,
        message : seedGrantFormData.message,
        errorCode : seedGrantFormData.errorCode
    }
}



module.exports.insertSeedGrantNonFormacy = async(body) => {
    const seedGrantFormData = body.seedGrantFormData;
    console.log('seedGrantFormData in service ==>>>', seedGrantFormData)

    const insertSeedGrantNonFormacyData =  await seedGrantModels.insertSeedGrantNonformacyForm(seedGrantFormData);

    console.log('insertSeedGrantNonFormacyData ====>>>>', insertSeedGrantNonFormacyData);

    return insertSeedGrantNonFormacyData.status === "Done" ? {
        status : insertSeedGrantNonFormacyData.status,
        message : insertSeedGrantNonFormacyData.message,
        grantedSeedId : insertSeedGrantNonFormacyData.grantedSeedId,
        rowCount : insertSeedGrantNonFormacyData.rowCount,
        seedGrantFormData : seedGrantFormData
    } : {
        status : insertSeedGrantNonFormacyData.status,
        message : insertSeedGrantNonFormacyData.message,
        errorCode : insertSeedGrantNonFormacyData.errorCode
    }
}

module.exports.updateSeedGrantNonFormacyData = async(body) => {
    const grantedSeedId = body.updatedSeedGrantData.grantedSeedId;
    const updatedSeedGrantData = body.updatedSeedGrantData;

    const updatedNonFormacyData  = await seedGrantModels.updateSeedGrantNonformacyForm(grantedSeedId, updatedSeedGrantData);
    console.log('updatedNonFormacyData ====>>>>>', updatedNonFormacyData);

    return updatedNonFormacyData.status === "Done" ? {
        status : updatedNonFormacyData.status,
        message : updatedNonFormacyData.message,
        updatedNonFormacyData : updatedSeedGrantData,
        facultTableData : updatedNonFormacyData.facultTableData
    } : {
        status : updatedNonFormacyData.status,
        message : updatedNonFormacyData.message,
        errorCode : updatedNonFormacyData.errorCode
    }
}


module.exports.deleteSeedGrantData = async (body) => {
    const grantedSeedId = body.grantedSeedId;

    const deletedFormacyForm = await seedGrantModels.deleteSeedGrantNonFormacyForm(grantedSeedId);

    console.log('deletedFormacyForm ===>>>>', deletedFormacyForm);

    return deletedFormacyForm.status === "Done" ? {
        status : deletedFormacyForm.status,
        message : deletedFormacyForm.message
    } :
    {
        status : deletedFormacyForm.status,
        message : deletedFormacyForm.message,
        errorCode : deletedFormacyForm.errorCode
    }
}


module.exports.viewGrantedSeedNonFormacyData = async (body) => {
    const grantedSeedId = body.grantedSeedId;

    const nonFormacyData = await seedGrantModels.viewSeedGrantNonFormacy(grantedSeedId);

    console.log('nonFormacyData ===>>>>>>', nonFormacyData);
    const advancedPayment = nonFormacyData.nonFormacyformData[0].advanced_payment;
    console.log('advancedPayment ===>>>', advancedPayment);
    const finalPayment = nonFormacyData.nonFormacyformData[0].final_payment;
    console.log('finalPayment ===>>>', finalPayment)
    const totalAmount = advancedPayment + finalPayment;
    console.log('totalAmount===>>>', totalAmount);
    const facultySharesPercentage = parseInt(nonFormacyData.nonFormacyformData[0].faculty_shares);
    const nmimsSharePercentage = parseInt(nonFormacyData.nonFormacyformData[0].nmims_shares);

    console.log('facultySharesPercentage ===>>>>', facultySharesPercentage);
    const facultyShareAmount = totalAmount * facultySharesPercentage / 100;
    const nmimsShareAmount = totalAmount * nmimsSharePercentage/100;
    console.log('nmimsShareAmount ::::', nmimsShareAmount);
    console.log('facultyShareAmount ===>>>', facultyShareAmount);

    const totalFees = nonFormacyData.nonFormacyformData[0].session_count_per_days * nonFormacyData.nonFormacyformData[0].per_session_fees;
    console.log('totalFees ===>>>>', totalFees);

    const totalExpensesAmount = nonFormacyData.nonFormacyformData[0].research_staff_expenses + nonFormacyData.nonFormacyformData[0].travel + 
                                nonFormacyData.nonFormacyformData[0].computer_charges + nonFormacyData.nonFormacyformData[0].nmims_facility_charges
                                + nonFormacyData.nonFormacyformData[0].miscellaneous_including_contingency;

    console.log('totalExpensesAmount ====>>>>>', totalExpensesAmount);
    const commencementDate = nonFormacyData.nonFormacyformData[0].commencement_date;
    const commencementDateFormate = moment(commencementDate).format('DD-MM-YYYY');
    console.log('commencementDateFormate ===>>>>', commencementDateFormate);
    const completionDate = nonFormacyData.nonFormacyformData[0].completion_date;
    const completionDateFormate = moment(completionDate).format('DD-MM-YYYY');
    console.log('completionDateFormate ====>>>', completionDateFormate);

    const aToFTotalAmount = nonFormacyData.nonFormacyformData[0].gross_fees + nonFormacyData.nonFormacyformData[0].research_staff_expenses + nonFormacyData.nonFormacyformData[0].travel + 
    nonFormacyData.nonFormacyformData[0].computer_charges + nonFormacyData.nonFormacyformData[0].nmims_facility_charges
    + nonFormacyData.nonFormacyformData[0].miscellaneous_including_contingency;
    console.log('aToFTotalAmount ====>>>>>', aToFTotalAmount);

    const gstCharges = totalAmount * 18 / 100;
    console.log('gstCharges ====>>>>', gstCharges);

    const grandTotalAmount = totalExpensesAmount + aToFTotalAmount + gstCharges + totalFees;
    console.log('grandTotalAmount ===>>>', grandTotalAmount);

    return nonFormacyData.status === "Done" ? {
        status : nonFormacyData.status,
        message : nonFormacyData.message,
        nonFormacyData : nonFormacyData.nonFormacyformData[0],
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
        status : nonFormacyData.status,
        message : nonFormacyData.message,
        errorCode : nonFormacyData.errorCode
    };
}