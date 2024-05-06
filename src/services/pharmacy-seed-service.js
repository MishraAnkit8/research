const pharmacySeedModels = require('../models/pharmacy-seed-models');

module.exports.renderPharmacySeed = async() => {

}

module.exports.insertInvestorEduCation = async(body) => {
    const educationalDetails = body.educationalDetails;
    console.log('data in service === >>>>>>', educationalDetails);

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

module.exports.insertInvestorExperience = async(body) => {
    const workExperienceDetails = body.workExperienceDetails;
    const insertInvestigatiorExperience = await pharmacySeedModels.insertInvestigatorExperienceDetails(workExperienceDetails)

    return insertInvestigatiorExperience.status === "Done" ? {
        status : insertInvestigatiorExperience.status,
        message : insertInvestigatiorExperience.message,
        invastigatorExperienceId : insertInvestigatiorExperience.invastigatorExperienceId,
        rowCount : insertInvestigatiorExperience.rowCount
    } : {
        status : insertInvestigatiorExperience.status,
        message : insertInvestigatiorExperience.message,
        errorCode : insertInvestigatiorExperience.errorCode
    }


}

module.exports.insertInvestorBook = async(body) => {
    const investigatorBookDetails = body.investigatorBookDetails;
    const insertInvestigatiorBook = await pharmacySeedModels.insertInvestigatorBookDetails(investigatorBookDetails)

    return insertInvestigatiorBook.status === "Done" ? {
        status : insertInvestigatiorBook.status,
        message : insertInvestigatiorBook.message,
        bookId : insertInvestigatiorBook.investorEduId,
        rowCount : insertInvestigatiorBook.rowCount
    } : {
        status : insertInvestigatiorBook.status,
        message : insertInvestigatiorBook.message,
        errorCode : insertInvestigatiorBook.errorCode
    }


}

module.exports.insertInvestorBookChapter = async(body) => {
    const investigatorBookChapterDetails = body.investigatorBookChapterDetails;
    console.log('investigatorBookChapterDetails =====>>>>>>', investigatorBookChapterDetails);

    const insertInvestigatiorBookchapter = await pharmacySeedModels.insertInvestigatorBookChapterDetails(investigatorBookChapterDetails)

    return insertInvestigatiorBookchapter.status === "Done" ? {
        status : insertInvestigatiorBookchapter.status,
        message : insertInvestigatiorBookchapter.message,
        bookChapterId : insertInvestigatiorBookchapter.investorEduId,
        rowCount : insertInvestigatiorBookchapter.rowCount
    } : {
        status : insertInvestigatiorBookchapter.status,
        message : insertInvestigatiorBookchapter.message,
        errorCode : insertInvestigatiorBookchapter.errorCode
    }


}

module.exports.insertInvestorPatent = async(body) => {
    const investigatorPatentDetails = body.investigatorPatentDetails;
    const insertInvestigatiorPatent = await pharmacySeedModels.insertInvestigatorPatentDetails(investigatorPatentDetails)

    return insertInvestigatiorPatent.status === "Done" ? {
        status : insertInvestigatiorPatent.status,
        message : insertInvestigatiorPatent.message,
        patentId : insertInvestigatiorPatent.investorEduId,
        rowCount : insertInvestigatiorPatent.rowCount
    } : {
        status : insertInvestigatiorPatent.status,
        message : insertInvestigatiorPatent.message,
        errorCode : insertInvestigatiorPatent.errorCode
    }


}

module.exports.insertInvestorPublication = async(body) => {
    const investigatorPublicationDetails = body.investigatorPublicationDetails;
    const insertInvestigatiorPublication = await pharmacySeedModels.insertInvestigatorPublicationDetails(investigatorPublicationDetails)

    return insertInvestigatiorPublication.status === "Done" ? {
        status : insertInvestigatiorPublication.status,
        message : insertInvestigatiorPublication.message,
        publicationId : insertInvestigatiorPublication.publicationId,
        rowCount : insertInvestigatiorPublication.rowCount
    } : {
        status : insertInvestigatiorPublication.status,
        message : insertInvestigatiorPublication.message,
        errorCode : insertInvestigatiorPublication.errorCode
    }


}

module.exports.insertInvestorResearchImplementation = async(body) => {
    const researchProjectDetails = body.researchProjectDetails;
    const insertImplementationDetails = await pharmacySeedModels.insertInvestigatorResearchImplementationDetails(researchProjectDetails)

    return insertImplementationDetails.status === "Done" ? {
        status : insertImplementationDetails.status,
        message : insertImplementationDetails.message,
        implementationId : insertImplementationDetails.implementationId,
        rowCount : insertImplementationDetails.rowCount
    } : {
        status : insertImplementationDetails.status,
        message : insertImplementationDetails.message,
        errorCode : insertImplementationDetails.errorCode
    }


}



module.exports.insertInvestorResearchCompleted = async(body) => {
    const researchProjectCompleteDetails = body.researchProjectCompleteDetails;
    const insertCompletedReserch = await pharmacySeedModels.insertInvestigatorResearchCompletedDetails(researchProjectCompleteDetails)

    return insertCompletedReserch.status === "Done" ? {
        status : insertCompletedReserch.status,
        message : insertCompletedReserch.message,
        CompletedId : insertCompletedReserch.CompletedId,
        rowCount : insertCompletedReserch.rowCount
    } : {
        status : insertCompletedReserch.status,
        message : insertCompletedReserch.message,
        errorCode : insertCompletedReserch.errorCode
    }


}


module.exports.insertPharmacySeedDetials = async(body, userName) => {
    const pharmacySeedGrantDetails = body.pharmacySeedGrantDetails;

    const pharmacyData = await pharmacySeedModels.insertPharmacyDetails(pharmacySeedGrantDetails, userName)
}