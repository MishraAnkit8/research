const pharmacySeedModels = require('../models/pharmacy-seed-models');

module.exports.renderPharmacySeed = async() => {

}

module.exports.insertInvestorEduCation = async(body) => {
    const educationalDetails = body.educationalDetails;
    const insertInvestigatiorEducation = await pharmacySeedModels.insertInvestigatorEducationDetails(educationalDetails)

    return insertInvestigatiorEducation.status === "Done" ? {
        status : insertInvestigatiorEducation.status,
        message : insertInvestigatiorEducation.message,
        investorEduId : insertInvestigatiorEducation.investorEduId,
        rowCount : insertInvestigatiorEducation.rowCount
    } : {
        status : insertInvestigatiorEducation.status,
        message : insertInvestigatiorEducation.message,
        errorCode : insertInvestigatiorEducation.errorCode
    }


}