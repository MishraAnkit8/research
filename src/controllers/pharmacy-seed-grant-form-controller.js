const pharmacyService = require('../services/pharmacy-seed-service')
const { getRedisData } = require("../../utils/redis.utils");

module.exports.renderPharmacySeedGrantform = async(req, res, next) => {

    const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in in dashboard controller  ===>>>>>>', userName);

    const pharmacySeedDetails = await pharmacyService.renderPharmacySeed(userName);

    console.log('pharmacySeedDetails in cotroller ===>>>>', pharmacySeedDetails)

    res.render('pharmacy-seed-grant-form', {
        status : pharmacySeedDetails.status,
        message : pharmacySeedDetails.message,
        rowCount : pharmacySeedDetails.rowCount,
        pharmacyData : pharmacySeedDetails.pharmacyData,
        userName : userName,
        errorCode : pharmacySeedDetails.errorCode

    })
}


module.exports.insertInvestigationEducationalDetails = async(req, res, next) => {
    console.log('data commint from frontend ====>>>>', req.body.detailsContainerArray);
    const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in in dashboard controller  ===>>>>>>', userName);

    const insertPharmacyInvestigatorEdu = await pharmacyService.insertInvestorEduCation(req.body, userName);

    const statusCode = insertPharmacyInvestigatorEdu.status === "Done" ? 200 : (insertPharmacyInvestigatorEdu.errorCode ? 400 : 500);
    console.log('insertPharmacyInvestigatorEdu ====>>>>>>', insertPharmacyInvestigatorEdu);
    
    res.status(statusCode).send({
        status : insertPharmacyInvestigatorEdu.status,
        message : insertPharmacyInvestigatorEdu.message,
        educatoinIds : insertPharmacyInvestigatorEdu.ids,
        rowCount : insertPharmacyInvestigatorEdu.rowCount,
        educaltionalDetails : insertPharmacyInvestigatorEdu.detailsDataArray,

        errorCode : insertPharmacyInvestigatorEdu.errorCode
    })
}

module.exports.investigatorExperience = async(req, res, next) => {
    console.log('experience dat in controller ===>>>>>', req.body);
    const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in in dashboard controller  ===>>>>>>', userName);


    const insertExperience = await pharmacyService.insertInvestorExperience(req.body, userName);

    const statusCode = insertExperience.status === "Done" ? 200 : (insertExperience.errorCode ? 400 : 500);
    console.log('insertExperience ====>>>>>>', insertExperience);
    
    res.status(statusCode).send({
        status : insertExperience.status,
        message : insertExperience.message,
        experienceId : insertExperience.ids,
        rowCount : insertExperience.rowCount,
        experienceDetails : insertExperience.detailsDataArray,
        errorCode : insertExperience.errorCode
    })
}

module.exports.investigatorBook = async(req, res, next) => {
    console.log('book data in controller ===>>>>>', req.body);

    const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in in dashboard controller  ===>>>>>>', userName);

    const insertInvestigatorBook = await pharmacyService.insertInvestorBook(req.body, userName);

    const statusCode = insertInvestigatorBook.status === "Done" ? 200 : (insertInvestigatorBook.errorCode ? 400 : 500);
    console.log('insertPharmacyInvestigatorEdu ====>>>>>>', insertInvestigatorBook);
    
    res.status(statusCode).send({
        status : insertInvestigatorBook.status,
        message : insertInvestigatorBook.message,
        bookDetailsIds : insertInvestigatorBook.ids,
        rowCount : insertInvestigatorBook.rowCount,
        bookDetails : insertInvestigatorBook.detailsDataArray,

        errorCode : insertInvestigatorBook.errorCode
    })
}

module.exports.investigatorBookChapter = async(req, res, next) => {
    console.log('book chapter data in controller ===>>>>>', req.body);
    const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in in dashboard controller  ===>>>>>>', userName);

    const insertInvestigatorBookChapter = await pharmacyService.insertInvestorBookChapter(req.body, userName);

    const statusCode = insertInvestigatorBookChapter.status === "Done" ? 200 : (insertInvestigatorBookChapter.errorCode ? 400 : 500);
    console.log('insertInvestigatorBookChapter ====>>>>>>', insertInvestigatorBookChapter);
    
    res.status(statusCode).send({
        status : insertInvestigatorBookChapter.status,
        message : insertInvestigatorBookChapter.message,
        bookChapterDetailsIds : insertInvestigatorBookChapter.ids,
        rowCount : insertInvestigatorBookChapter.rowCount,
        bookChapterDetails : insertInvestigatorBookChapter.detailsDataArray,

        errorCode : insertInvestigatorBookChapter.errorCode
    })
}

module.exports.investigatorPatent = async(req, res, next) => {
    console.log('patent data in controller ===>>>>>', req.body);

    const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in in dashboard controller  ===>>>>>>', userName);

    const insertInvestigatorPatent = await pharmacyService.insertInvestorPatent(req.body, userName);

    const statusCode = insertInvestigatorPatent.status === "Done" ? 200 : (insertInvestigatorPatent.errorCode ? 400 : 500);
    console.log('insertInvestigatorPatent ====>>>>>>', insertInvestigatorPatent);
    
    res.status(statusCode).send({
        status : insertInvestigatorPatent.status,
        message : insertInvestigatorPatent.message,
        patentDetailsIds : insertInvestigatorPatent.ids,
        rowCount : insertInvestigatorPatent.rowCount,
        patentDetails : insertInvestigatorPatent.detailsDataArray,

        errorCode : insertInvestigatorPatent.errorCode
    })
}

module.exports.investigatorPublication = async(req, res, next) => {
    console.log('publication data in controller ===>>>>>', req.body);

    const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in in dashboard controller  ===>>>>>>', userName);

    const insertInvestigatorPublication = await pharmacyService.insertInvestorPublication(req.body, userName);

    const statusCode = insertInvestigatorPublication.status === "Done" ? 200 : (insertInvestigatorPublication.errorCode ? 400 : 500);
    console.log('insertInvestigatorPublication ====>>>>>>', insertInvestigatorPublication);
    
    res.status(statusCode).send({
        status : insertInvestigatorPublication.status,
        message : insertInvestigatorPublication.message,
        publicationDetailsIds : insertInvestigatorPublication.ids,
        rowCount : insertInvestigatorPublication.rowCount,
        PublicationDetails : insertInvestigatorPublication.detailsDataArray,

        errorCode : insertInvestigatorPublication.errorCode
    })
}

module.exports.investigatorResearchImplementation = async(req, res, next) => {
    console.log('implementation dat in controller ===>>>>>', req.body);

    const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in in dashboard controller  ===>>>>>>', userName);

    const insertInvestigatorResImple = await pharmacyService.insertInvestorResearchImplementation(req.body, userName);

    const statusCode = insertInvestigatorResImple.status === "Done" ? 200 : (insertInvestigatorResImple.errorCode ? 400 : 500);
    console.log('insertPharmacyInvestigatorEdu ====>>>>>>', insertInvestigatorResImple);
    
    res.status(statusCode).send({
        status : insertInvestigatorResImple.status,
        message : insertInvestigatorResImple.message,
        implementationIds : insertInvestigatorResImple.ids,
        rowCount : insertInvestigatorResImple.rowCount,
        researchImplementationDetails : insertInvestigatorResImple.detailsDataArray,
        errorCode : insertInvestigatorResImple.errorCode
    })
}


module.exports.investigatorResearchCompleted = async(req, res, next) => {
    console.log('research completed data in controller ===>>>>>', req.body);

    const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in in dashboard controller  ===>>>>>>', userName);

    const insertInvestigatorResCompleted = await pharmacyService.insertInvestorResearchCompleted(req.body, userName);

    const statusCode = insertInvestigatorResCompleted.status === "Done" ? 200 : (insertInvestigatorResCompleted.errorCode ? 400 : 500);
    console.log('insertInvestigatorResCompleted ====>>>>>>', insertInvestigatorResCompleted);
    
    res.status(statusCode).send({
        status : insertInvestigatorResCompleted.status,
        message : insertInvestigatorResCompleted.message,
        CompletedIds : insertInvestigatorResCompleted.ids,
        rowCount : insertInvestigatorResCompleted.rowCount,
        completedDetails : insertInvestigatorResCompleted.detailsDataArray,
        errorCode : insertInvestigatorResCompleted.errorCode
    })
}


module.exports.insertPharmacySeedForms = async(req, res, next) => {
    console.log('data comming from frontend ====>>>>>', req.body);

    const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in in dashboard controller  ===>>>>>>', userName);

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


module.exports.viewPharmacySeedGrantData = async(req, res, next) => {
    const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in in dashboard controller  ===>>>>>>', userName);

    const pharmacyId = req.body.pharmacyId;
    console.log('data is comming from frontend ====>>>>', req.body.pharmacyId);

    const viewPharmacySeed = await pharmacyService.viewPharmacyData(pharmacyId, userName);

    console.log('viewPharmacySeed ===>>>>>>>', viewPharmacySeed);

    const statusCode = viewPharmacySeed.status === 'Done' ? 200 : (viewPharmacySeed.errorCode ? 400 : 500);

    res.status(statusCode).send({
        status : viewPharmacySeed.status,
        message : viewPharmacySeed.message,
        pharmacyData : viewPharmacySeed.pharmacyData,
        principalInvestigator : viewPharmacySeed.principalInvestigator,
        educaltionalDetails : viewPharmacySeed.educaltionalDetails,
        experienceDetails : viewPharmacySeed.experienceDetails,
        bookDetails : viewPharmacySeed.bookDetails,
        bookChapterDetails : viewPharmacySeed.bookChapterDetails,
        PublicationDetails : viewPharmacySeed.PublicationDetails,
        patentDetails : viewPharmacySeed.patentDetails,
        researchImplementationDetails : viewPharmacySeed.researchImplementationDetails,
        completedResearchDetails : viewPharmacySeed.completedResearchDetails,
        errorCode : viewPharmacySeed.errorCode ? viewPharmacySeed.errorCode : null
    })
}


module.exports.retriveDetailsDataPharamacy = async(req, res, next) => {
    console.log('req.body data is comming from frontend ===>>>>>', req.body)

    const retriveDetailsData = await pharmacyService.retriveDetail(req.body);

    const statusCode = retriveDetailsData.status === 'Done' ? 200 : (retriveDetailsData.errorCode ? 400 : 500);

    res.status(statusCode).send({
        status : retriveDetailsData.status,
        message : retriveDetailsData.message,
        educaltionalDetails : retriveDetailsData.educaltionalDetails,
        experienceDetails : retriveDetailsData.experienceDetails,
        bookDetails : retriveDetailsData.bookDetails,
        bookChapterDetails : retriveDetailsData.bookChapterDetails,
        PublicationDetails : retriveDetailsData.PublicationDetails,
        patentDetails : retriveDetailsData.patentDetails,
        researchImplementationDetails : retriveDetailsData.researchImplementationDetails,
        completedResearchDetails : retriveDetailsData.completedResearchDetails,
        errorCode : retriveDetailsData.errorCode ? retriveDetailsData.errorCode : null
    })

    
}


module.exports.updatePharmacyDetailsData = async(req, res, next) => {
    console.log(' data in controller for update ===>>>>>', req.body);
    const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in in dashboard controller  ===>>>>>>', userName);

    const updatePharmacyDetail = await pharmacyService.updatePharmacyData(req.body, userName);

    console.log('updatePharmacyDetail data in controller =====>>>>>>>', updatePharmacyDetail);
    const statusCode = updatePharmacyDetail.status === "Done" ? 200 : (updatePharmacyDetail.errorCode ? 400 : 500);
    console.log('statusCode ======>>>>>>>', statusCode);

    res.status(statusCode).send({
        status : updatePharmacyDetail.status,
        message : updatePharmacyDetail.message,
        errorCode : updatePharmacyDetail.errorCode ? updatePharmacyDetail.errorCode : null
    })
}


module.exports.deleteEducationalDetails = async(req, res, next) => {
    console.log(' data in controller for deleteEducationalDetails ===>>>>>', req.body);
    const sessionid = req.cookies.session;
    let sessionData = await getRedisData(`${sessionid}:session`)
    const  userName = sessionData.username;
    console.log('userName in in dashboard controller  ===>>>>>>', userName);
    const deleteEducationalResponce = await pharmacyService.deleteEducationalData(req.body, userName);

    console.log('deleteEducationalResponce ====>>>>', deleteEducationalResponce)

    const statusCode = deleteEducationalResponce.status === 'Done' ? 200 : (deleteEducationalResponce.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : deleteEducationalResponce.status,
        message : deleteEducationalResponce.message,
        errorCode : deleteEducationalResponce.errorCode ? deleteEducationalResponce.errorCode : null
    })
}

module.exports.deleteExperienceDetails = async(req, res, next) => {
    console.log(' data in controller for deleteExperienceDetails ===>>>>>', req.body);
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);
    const deleteExperienceResponce = await pharmacyService.deleteExperienceData(req.body, userName);

    console.log('deleteExperienceResponce ====>>>>', deleteExperienceResponce)

    const statusCode = deleteExperienceResponce.status === 'Done' ? 200 : (deleteExperienceResponce.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : deleteExperienceResponce.status,
        message : deleteExperienceResponce.message,
        errorCode : deleteExperienceResponce.errorCode ? deleteExperienceResponce.errorCode : null
    })
}

module.exports.deleteBookDetails = async(req, res, next) => {
    console.log(' data in controller for deleteBookDetails ===>>>>>', req.body);
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);
    const deleteBookDetailsResponce = await pharmacyService.deleteBookData(req.body, userName);

    console.log('deleteBookDetailsResponce ====>>>>', deleteBookDetailsResponce)

    const statusCode = deleteBookDetailsResponce.status === 'Done' ? 200 : (deleteBookDetailsResponce.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : deleteBookDetailsResponce.status,
        message : deleteBookDetailsResponce.message,
        errorCode : deleteBookDetailsResponce.errorCode ? deleteBookDetailsResponce.errorCode : null
    })
}

module.exports.deleteBookChapterDetails = async(req, res, next) => {
    console.log(' data in controller for deleteBookChapterDetails ===>>>>>', req.body);
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);
    const deleteBookChapterResponce = await pharmacyService.deleteBookChapterData(req.body, userName);

    console.log('deleteBookChapterResponce ====>>>>', deleteBookChapterResponce)

    const statusCode = deleteBookChapterResponce.status === 'Done' ? 200 : (deleteBookChapterResponce.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : deleteBookChapterResponce.status,
        message : deleteBookChapterResponce.message,
        errorCode : deleteBookChapterResponce.errorCode ? deleteBookChapterResponce.errorCode : null
    })
}

module.exports.deletePublicationDetails = async(req, res, next) => {
    console.log(' data in controller for deletePublicationDetails ===>>>>>', req.body);
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    const deletePublicationResponce = await pharmacyService.deletePublicationData(req.body, userName);

    console.log('deletePublicationResponce ====>>>>', deletePublicationResponce)

    const statusCode = deletePublicationResponce.status === 'Done' ? 200 : (deletePublicationResponce.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : deletePublicationResponce.status,
        message : deletePublicationResponce.message,
        errorCode : deletePublicationResponce.errorCode ? deletePublicationResponce.errorCode : null
    })
}

module.exports.deletePatentDetails = async(req, res, next) => {
    console.log(' data in controller for deletePatentDetails ===>>>>>', req.body);
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);
    const deletePatentResponce = await pharmacyService.deletePatentData(req.body, userName);

    console.log('deletePatentResponce ====>>>>', deletePatentResponce)

    const statusCode = deletePatentResponce.status === 'Done' ? 200 : (deletePatentResponce.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : deletePatentResponce.status,
        message : deletePatentResponce.message,
        errorCode : deletePatentResponce.errorCode ? deletePatentResponce.errorCode : null
    })
}

module.exports.deleteImplementationDetails = async(req, res, next) => {
    console.log(' data in controller for deleteImplementationDetails ===>>>>>', req.body);
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);
    const deleteImpleResponce = await pharmacyService.deleteImplementationData(req.body, userName);

    console.log('deleteImpleResponce ====>>>>', deleteImpleResponce)

    const statusCode = deleteImpleResponce.status === 'Done' ? 200 : (deleteImpleResponce.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : deleteImpleResponce.status,
        message : deleteImpleResponce.message,
        errorCode : deleteImpleResponce.errorCode ? deleteImpleResponce.errorCode : null
    })
}

module.exports.deleteCompleteDetails = async(req, res, next) => {
    console.log(' data in controller for deleteCompleteDetails ===>>>>>', req.body);
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);
    const deleteResCompletedResponce = await pharmacyService.deleteCompleteDetails(req.body, userName);

    console.log('deleteResCompletedResponce ====>>>>', deleteResCompletedResponce)

    const statusCode = deleteResCompletedResponce.status === 'Done' ? 200 : (deleteResCompletedResponce.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : deleteResCompletedResponce.status,
        message : deleteResCompletedResponce.message,
        errorCode : deleteResCompletedResponce.errorCode ? deleteResCompletedResponce.errorCode : null
    })
}



module.exports.deletePharmcySeedDetails = async(req, res, next) => {

    console.log(' data in controller for deletePharmcySeedDetails ===>>>>>', req.body);
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    const deletePharmacyData = await pharmacyService.deletePharmacyDetails(req.body, userName);

    console.log('deletePharmacyData ====>>>>', deletePharmacyData)

    const statusCode = deletePharmacyData.status === 'Done' ? 200 : (deletePharmacyData.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : deletePharmacyData.status,
        message : deletePharmacyData.message,
        errorCode : deletePharmacyData.errorCode ? deletePharmacyData.errorCode : null
    })

}