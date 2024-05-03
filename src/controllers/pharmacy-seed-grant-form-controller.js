const pharmacyService = require('../services/pharmacy-seed-service')

module.exports.renderPharmacySeedGrantform = async(req, res, next) => {
    res.render('pharmacy-seed-grant-form')
}


module.exports.insertInvestigationEducationalDetails = async(req, res, next) => {
    console.log('data commint from frontend ====>>>>', req.body);

    const insertPharmacyInvestigatorEdu = await pharmacyService.insertInvestorEduCation(req.body);

    const statusCode = insertPharmacyInvestigatorEdu.status === "Done" ? 200 : (insertPharmacyInvestigatorEdu.errorCode ? 400 : 500);
    console.log('insertPharmacyInvestigatorEdu ====>>>>>>', insertPharmacyInvestigatorEdu);
    
    res.status(statusCode).send({
        status : insertPharmacyInvestigatorEdu.status,
        message : insertPharmacyInvestigatorEdu.message,
        investorEduId : insertPharmacyInvestigatorEdu.investorEduId,
        rowCount : insertPharmacyInvestigatorEdu.rowCount,
        errorCode : insertPharmacyInvestigatorEdu.errorCode
    })
}