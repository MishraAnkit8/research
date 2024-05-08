const pharmacyService = require('../services/pharmacy-seed-service')

module.exports.renderPharmacySeedGrantform = async(req, res, next) => {

    console.log('data in controller ')
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    const pharmacySeedDetails = await pharmacyService.renderPharmacySeed(userName);

    console.log('pharmacySeedDetails in cotroller ===>>>>', pharmacySeedDetails)

    res.render('pharmacy-seed-grant-form', {
        status : pharmacySeedDetails.status,
        message : pharmacySeedDetails.message,
        rowCount : pharmacySeedDetails.rowCount,
        pharmacyData : pharmacySeedDetails.pharmacyData,
        errorCode : pharmacySeedDetails.errorCode

    })
}


module.exports.insertInvestigationEducationalDetails = async(req, res, next) => {
    console.log('data commint from frontend ====>>>>', req.body);
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    const insertPharmacyInvestigatorEdu = await pharmacyService.insertInvestorEduCation(req.body, userName);

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

module.exports.investigatorExperience = async(req, res, next) => {
    console.log('experience dat in controller ===>>>>>', req.body);
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);


    const insertExperience = await pharmacyService.insertInvestorExperience(req.body, userName);

    const statusCode = insertExperience.status === "Done" ? 200 : (insertExperience.errorCode ? 400 : 500);
    console.log('insertExperience ====>>>>>>', insertExperience);
    
    res.status(statusCode).send({
        status : insertExperience.status,
        message : insertExperience.message,
        invastigatorExperienceId : insertExperience.invastigatorExperienceId,
        rowCount : insertExperience.rowCount,
        errorCode : insertExperience.errorCode
    })
}

module.exports.investigatorBook = async(req, res, next) => {
    console.log('book data in controller ===>>>>>', req.body);

    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    const insertInvestigatorBook = await pharmacyService.insertInvestorBook(req.body, userName);

    const statusCode = insertInvestigatorBook.status === "Done" ? 200 : (insertInvestigatorBook.errorCode ? 400 : 500);
    console.log('insertPharmacyInvestigatorEdu ====>>>>>>', insertInvestigatorBook);
    
    res.status(statusCode).send({
        status : insertInvestigatorBook.status,
        message : insertInvestigatorBook.message,
        bookId : insertInvestigatorBook.bookId,
        rowCount : insertInvestigatorBook.rowCount,
        errorCode : insertInvestigatorBook.errorCode
    })
}

module.exports.investigatorBookChapter = async(req, res, next) => {
    console.log('book chapter data in controller ===>>>>>', req.body);
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    const insertInvestigatorBookChapter = await pharmacyService.insertInvestorBookChapter(req.body, userName);

    const statusCode = insertInvestigatorBookChapter.status === "Done" ? 200 : (insertInvestigatorBookChapter.errorCode ? 400 : 500);
    console.log('insertInvestigatorBookChapter ====>>>>>>', insertInvestigatorBookChapter);
    
    res.status(statusCode).send({
        status : insertInvestigatorBookChapter.status,
        message : insertInvestigatorBookChapter.message,
        bookChapterId : insertInvestigatorBookChapter.bookChapterId,
        rowCount : insertInvestigatorBookChapter.rowCount,
        errorCode : insertInvestigatorBookChapter.errorCode
    })
}

module.exports.investigatorPatent = async(req, res, next) => {
    console.log('patent data in controller ===>>>>>', req.body);

    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    const insertInvestigatorPatent = await pharmacyService.insertInvestorPatent(req.body, userName);

    const statusCode = insertInvestigatorPatent.status === "Done" ? 200 : (insertInvestigatorPatent.errorCode ? 400 : 500);
    console.log('insertInvestigatorPatent ====>>>>>>', insertInvestigatorPatent);
    
    res.status(statusCode).send({
        status : insertInvestigatorPatent.status,
        message : insertInvestigatorPatent.message,
        patentId : insertInvestigatorPatent.patentId,
        rowCount : insertInvestigatorPatent.rowCount,
        errorCode : insertInvestigatorPatent.errorCode
    })
}

module.exports.investigatorPublication = async(req, res, next) => {
    console.log('publication data in controller ===>>>>>', req.body);

    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    const insertInvestigatorPublication = await pharmacyService.insertInvestorPublication(req.body, userName);

    const statusCode = insertInvestigatorPublication.status === "Done" ? 200 : (insertInvestigatorPublication.errorCode ? 400 : 500);
    console.log('insertInvestigatorPublication ====>>>>>>', insertInvestigatorPublication);
    
    res.status(statusCode).send({
        status : insertInvestigatorPublication.status,
        message : insertInvestigatorPublication.message,
        publicationId : insertInvestigatorPublication.publicationId,
        rowCount : insertInvestigatorPublication.rowCount,
        errorCode : insertInvestigatorPublication.errorCode
    })
}

module.exports.investigatorResearchImplementation = async(req, res, next) => {
    console.log('implementation dat in controller ===>>>>>', req.body);

    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    const insertInvestigatorResImple = await pharmacyService.insertInvestorResearchImplementation(req.body, userName);

    const statusCode = insertInvestigatorResImple.status === "Done" ? 200 : (insertInvestigatorResImple.errorCode ? 400 : 500);
    console.log('insertPharmacyInvestigatorEdu ====>>>>>>', insertInvestigatorResImple);
    
    res.status(statusCode).send({
        status : insertInvestigatorResImple.status,
        message : insertInvestigatorResImple.message,
        implementationId : insertInvestigatorResImple.implementationId,
        rowCount : insertInvestigatorResImple.rowCount,
        errorCode : insertInvestigatorResImple.errorCode
    })
}


module.exports.investigatorResearchCompleted = async(req, res, next) => {
    console.log('research completed data in controller ===>>>>>', req.body);

    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    const insertInvestigatorResCompleted = await pharmacyService.insertInvestorResearchCompleted(req.body, userName);

    const statusCode = insertInvestigatorResCompleted.status === "Done" ? 200 : (insertInvestigatorResCompleted.errorCode ? 400 : 500);
    console.log('insertInvestigatorResCompleted ====>>>>>>', insertInvestigatorResCompleted);
    
    res.status(statusCode).send({
        status : insertInvestigatorResCompleted.status,
        message : insertInvestigatorResCompleted.message,
        CompletedId : insertInvestigatorResCompleted.CompletedId,
        rowCount : insertInvestigatorResCompleted.rowCount,
        errorCode : insertInvestigatorResCompleted.errorCode
    })
}


module.exports.insertPharmacySeedForms = async(req, res, next) => {
    console.log('data comming from frontend ====>>>>>', req.body);

    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    const pharmacyDataDetails = await pharmacyService.insertPharmacySeedDetials(req.body, userName);

    console.log('pharmacyDataDetails ===>>>>', pharmacyDataDetails);

    const statusCode = pharmacyDataDetails.status === "Done" ? 200 : (pharmacyDataDetails.errorCode ? 400 : 500);

    res.status(statusCode).send({
        status : pharmacyDataDetails.status,
        message : pharmacyDataDetails.message,
        pharmacyIds : pharmacyDataDetails.pharmacyIds,
        rowCount : pharmacyDataDetails.rowCount,
        errorCode : pharmacyDataDetails.errorCode
    })

}