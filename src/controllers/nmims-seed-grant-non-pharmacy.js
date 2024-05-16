
const seedGrantNonForphacyService = require('../services/nmims-seed-grant-non-pharmacy.service');

module.exports.renderNmimsSeedGrantNonFormacy = async(req, res, next) => {
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    const renderSeedGrantFormData = await seedGrantNonForphacyService.fetchNoFormacyForm(userName);
    console.log('renderSeedGrantFormData in controller ===>>>>', renderSeedGrantFormData.seedGrantFormData)
    res.render("nmims-seed-grant-non-pharmacy", {
      status: renderSeedGrantFormData.status,
      message: renderSeedGrantFormData.message,
      seedGrantFormData: renderSeedGrantFormData.seedGrantFormData,
      rowCount: renderSeedGrantFormData.rowCount,
      facultyData: renderSeedGrantFormData.facultyData,
      totalPayment: renderSeedGrantFormData.totalPayment,
      errorCode: renderSeedGrantFormData.errorCode
        ? renderSeedGrantFormData.errorCode
        : null,
    });
}


module.exports.viewNonformacyForm = async(req, res, next) => {
    console.log('grantedSeedId id in controller ===>>>>', req.body);
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    const constViewGrantedSeedForm = await seedGrantNonForphacyService.viewGrantedSeedNonFormacyData(req.body, userName) ;

    console.log('constViewGrantedSeedForm ===>>>>', constViewGrantedSeedForm);

    const statusCode = constViewGrantedSeedForm.status === "Done" ? 200 :  (constViewGrantedSeedForm.errorCode ? 400 : 500);

    res.status(statusCode).send({
        status : constViewGrantedSeedForm.status,
        message : constViewGrantedSeedForm.message,
        nonFormacyData : constViewGrantedSeedForm.nonFormacyData,
        // totalExpensesAmount : constViewGrantedSeedForm.totalExpensesAmount,
        commencementDateFormate : constViewGrantedSeedForm.commencementDateFormate,
        completionDateFormate : constViewGrantedSeedForm.completionDateFormate,
        totalFees : constViewGrantedSeedForm.totalFees,
        facultyShareAmount : constViewGrantedSeedForm.facultyShareAmount,
        nmimsShareAmount : constViewGrantedSeedForm.nmimsShareAmount,
        totalAmount : constViewGrantedSeedForm.totalAmount,
        aToFTotalAmount : constViewGrantedSeedForm.aToFTotalAmount,
        gstCharges : constViewGrantedSeedForm.gstCharges,
        grandTotalAmount : constViewGrantedSeedForm.grandTotalAmount,
        errorCode : constViewGrantedSeedForm.errorCode ? constViewGrantedSeedForm.errorCode : null
    })


}


module.exports.insertGrantedSeedNonFormacyForm = async(req, res, next) => {
    console.log('req.body in controller ankit ====>>>>>', req.body);
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    const insertNonFormacyFormdata = await seedGrantNonForphacyService.insertSeedGrantNonFormacy(req.body, req.files, userName);

    console.log('insertNonFormacyFormdata ===>>>>>', insertNonFormacyFormdata);
    const statusCode = insertNonFormacyFormdata.status === "Done" ? 200 : (insertNonFormacyFormdata.errorCode ? 400 : 500);

    res.status(statusCode).send({
        status : insertNonFormacyFormdata.status,
        message : insertNonFormacyFormdata.message,
        grantedSeedId : insertNonFormacyFormdata.grantedSeedId,
        rowCount : insertNonFormacyFormdata.rowCount,
        nonFormacyFormData : insertNonFormacyFormdata.seedGrantFormData,
        errorCode : insertNonFormacyFormdata.errorCode ? insertNonFormacyFormdata.errorCode : null
    })
}


module.exports.updatedNonFormacyform = async(req, res, next) => {
    console.log('data in controller ====>>>>', req.body);
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);
    console.log('files in controller =====>>>>', req.files);

    const updatedNonFormacyDataFormacyFormData = await seedGrantNonForphacyService.updateSeedGrantNonFormacyData(req.body, req.files,userName);

    console.log('updatedNonFormacyDataFormacyFormData ====>>>>>>', updatedNonFormacyDataFormacyFormData)
    const statusCode = updatedNonFormacyDataFormacyFormData.status === "Done" ? 200 : (updatedNonFormacyDataFormacyFormData.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : updatedNonFormacyDataFormacyFormData.status,
        message : updatedNonFormacyDataFormacyFormData.message,
        updatedNonFormacyData : updatedNonFormacyDataFormacyFormData.updatedNonFormacyData,
        facultTableData : updatedNonFormacyDataFormacyFormData.facultTableData,
        errorCode : updatedNonFormacyDataFormacyFormData.errorCode ? updatedNonFormacyDataFormacyFormData.errorCode : null
    })
}

module.exports.deleteNonFormacyForm = async(req, res, next) => {
    console.log('sata in controller', req.body);

    const deleteNonFormacyFormData = await seedGrantNonForphacyService.deleteSeedGrantData(req.body);

    console.log('deleteNonFormacyFormData in controller ===>>>', deleteNonFormacyFormData);

    const statusCode = deleteNonFormacyFormData.status === "Done" ? 200 : (deleteNonFormacyFormData.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : deleteNonFormacyFormData.status,
        message : deleteNonFormacyFormData.message,
        errorCode : deleteNonFormacyFormData.errorCode ? deleteNonFormacyFormData.errorCode : null
    })
}