const pharmacySeedModels = require('../models/pharmacy-seed-models');

module.exports.renderPharmacySeed = async(userName) => {

    const renderPharmacyData = await pharmacySeedModels.renderPharmacyData(userName);

    console.log('renderPharmacyData =====>>>>>', renderPharmacyData)

}

module.exports.insertInvestorEduCation = async(body, userName) => {
    const educationalDetails = body.educationalDetails;
    console.log('data in service === >>>>>>', educationalDetails);

    const insertInvestigatiorEducation = await pharmacySeedModels.insertInvestigatorEducationDetails(educationalDetails, userName)

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

module.exports.insertInvestorExperience = async(body, userName) => {
    const workExperienceDetails = body.workExperienceDetails;
    const insertInvestigatiorExperience = await pharmacySeedModels.insertInvestigatorExperienceDetails(workExperienceDetails, userName)

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

module.exports.insertInvestorBook = async(body, userName) => {
    const investigatorBookDetails = body.investigatorBookDetails;
    const insertInvestigatiorBook = await pharmacySeedModels.insertInvestigatorBookDetails(investigatorBookDetails, userName)

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

module.exports.insertInvestorBookChapter = async(body, userName) => {
    const investigatorBookChapterDetails = body.investigatorBookChapterDetails;
    console.log('investigatorBookChapterDetails =====>>>>>>', investigatorBookChapterDetails);

    const insertInvestigatiorBookchapter = await pharmacySeedModels.insertInvestigatorBookChapterDetails(investigatorBookChapterDetails, userName)

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

module.exports.insertInvestorPatent = async(body, userName) => {
    const investigatorPatentDetails = body.investigatorPatentDetails;
    const insertInvestigatiorPatent = await pharmacySeedModels.insertInvestigatorPatentDetails(investigatorPatentDetails, userName)

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

module.exports.insertInvestorPublication = async(body, userName) => {
    const investigatorPublicationDetails = body.investigatorPublicationDetails;
    const insertInvestigatiorPublication = await pharmacySeedModels.insertInvestigatorPublicationDetails(investigatorPublicationDetails, userName)

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

module.exports.insertInvestorResearchImplementation = async(body, userName) => {
    const researchProjectDetails = body.researchProjectDetails;
    const insertImplementationDetails = await pharmacySeedModels.insertInvestigatorResearchImplementationDetails(researchProjectDetails, userName)

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



module.exports.insertInvestorResearchCompleted = async(body, userName) => {
    const researchProjectCompleteDetails = body.researchProjectCompleteDetails;
    const insertCompletedReserch = await pharmacySeedModels.insertInvestigatorResearchCompletedDetails(researchProjectCompleteDetails, userName)

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
    console.log('pharmacySeedGrantDetails ===>>>>>', pharmacySeedGrantDetails);
    const educationIdsArray = pharmacySeedGrantDetails.educationIdsArray;
    const experienceIdsArray = pharmacySeedGrantDetails.eperienceIdsArray;
    const bookIdsArray = pharmacySeedGrantDetails.bookChapterIdsArray;
    const bookChapterIdsArray = pharmacySeedGrantDetails.bookChapterIdsArray;
    const publicationIdsArray = pharmacySeedGrantDetails.publicationIdsArray;
    const patentIdsArray = pharmacySeedGrantDetails.patentIdsArray;
    const researchImplementationIdsArray = pharmacySeedGrantDetails.researchImplementationIdsArray;
    const researchCompletedIdsArray = pharmacySeedGrantDetails.researchCompletedIdsArray;
    console.log('educationIdsArray ====>>>>>>', educationIdsArray)
    const investorDetails = {
        invatigatorName: pharmacySeedGrantDetails.invatigatorName,
        investigatorDesignation: pharmacySeedGrantDetails.investigatorDesignation,
        investigatorAddress: pharmacySeedGrantDetails.investigatorAddress,
        invatigatorMobile: pharmacySeedGrantDetails.invatigatorMobile,
        invastigatorDateOfBirth: pharmacySeedGrantDetails.invastigatorDateOfBirth
      };
      
      console.log(investorDetails);
      

    const pharmacyData = await pharmacySeedModels.insertPharmacyDetails(pharmacySeedGrantDetails, userName, educationIdsArray, experienceIdsArray,
        bookIdsArray, bookChapterIdsArray, publicationIdsArray, patentIdsArray, researchImplementationIdsArray, researchCompletedIdsArray, investorDetails);

    console.log('pharmacyData ====>>>>>>', pharmacyData);

    return pharmacyData.status === "Done" ? {
        status : pharmacyData.status,
        message : pharmacyData.message,
        pharmacyIds : pharmacyData.pharmacyIds,
        rowCount : pharmacyData.rowCount
    } : {
        status : pharmacyData.status,
        message : pharmacyData.message,
        errorCode : pharmacyData.errorCode
    }
}