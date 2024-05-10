const pharmacySeedModels = require('../models/pharmacy-seed-models');

module.exports.renderPharmacySeed = async(userName) => {

    const renderPharmacyData = await pharmacySeedModels.renderPharmacyData(userName);

    console.log('renderPharmacyData =====>>>>>', renderPharmacyData)
    return renderPharmacyData.status === "Done" ? {
        status : renderPharmacyData.status,
        message : renderPharmacyData.message,
        rowCount : renderPharmacyData.rowCount,
        pharmacyData : renderPharmacyData.pharmacyData
    } : {
        status : renderPharmacyData.status,
        message : renderPharmacyData.message,
        errorCode : renderPharmacyData.errorCode
    }

}

module.exports.insertInvestorEduCation = async(body, userName) => {

    const educationalDetails = body.educaltionalDetails;
    console.log('data in service === >>>>>>', educationalDetails);
    const education = educationalDetails[educationalDetails.length - 1];

    if (education.length > 0) {
        education.splice(0, 1);
      }
    console.log('education =====>>>>>', education);
    function splitArrayIntoChunks(arr, chunkSize) {
        const result = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
          result.push(arr.slice(i, i + chunkSize));
        }
        return result;
      }
      
      const educaltionalDataArray = splitArrayIntoChunks(education, 3);
      console.log('educaltionalDataArray =>>>>>>>>', educaltionalDataArray);
      

    const insertInvestigatiorEducation = await pharmacySeedModels.insertInvestigatorEducationDetails(educaltionalDataArray, userName)
    console.log('insertInvestigatiorEducation =====>>>>>>.', insertInvestigatiorEducation);

    return insertInvestigatiorEducation.status === "Done" ? {
        status : insertInvestigatiorEducation.status,
        message : insertInvestigatiorEducation.message,
        educatoinIds : insertInvestigatiorEducation.educatoinIds,
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
    const principalInvestigatorDetails = {
        principalName : pharmacySeedGrantDetails.principalName,
        principalDsg : pharmacySeedGrantDetails.principalDsg,
        principalOrg :  pharmacySeedGrantDetails.principalOrg,
        principalMob : pharmacySeedGrantDetails.principalMob,
        principalEmail : pharmacySeedGrantDetails.principalEmail
    }

    const coInvestigatorDetails = {
        coIvestigatorName : pharmacySeedGrantDetails.coIvestigatorName,
        coIvestigatorDsg : pharmacySeedGrantDetails.coIvestigatorDsg,
        coIvestigatorOrg :  pharmacySeedGrantDetails.coIvestigatorOrg,
        coIvestigatorMob : pharmacySeedGrantDetails.coIvestigatorMob,
        coIvestigatorEmail : pharmacySeedGrantDetails.coIvestigatorEmail
    }
      
      console.log(investorDetails);
      

    const pharmacyData = await pharmacySeedModels.insertPharmacyDetails(pharmacySeedGrantDetails, userName, educationIdsArray, experienceIdsArray,
        bookIdsArray, bookChapterIdsArray, publicationIdsArray, patentIdsArray, researchImplementationIdsArray, researchCompletedIdsArray, investorDetails,
        principalInvestigatorDetails, coInvestigatorDetails);

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

module.exports.viewPharmacyData = async(pharmacyId, userName) => {
    
    const pharamcySeedView = await pharmacySeedModels.viewPharmacyGrantData(pharmacyId, userName);

    console.log('pharamcySeedView ===>>>>', pharamcySeedView);

    return pharamcySeedView.status === "Done" ? {
        status : pharamcySeedView.status,
        message : pharamcySeedView.message,
        pharmacyData : pharamcySeedView.pharmacyData,
        principalInvestigator : pharamcySeedView.principalInvestigator,
        educaltionalDetails : pharamcySeedView.educaltionalDetails,
        experienceDetails : pharamcySeedView.experienceDetails,
        bookDetails : pharamcySeedView.bookDetails,
        bookChapterDetails : pharamcySeedView.bookChapterDetails,
        PublicationDetails : pharamcySeedView.PublicationDetails,
        patentDetails : pharamcySeedView.patentDetails,
        researchImplementationDetails : pharamcySeedView.researchImplementationDetails,
        completedResearchDetails : pharamcySeedView.completedResearchDetails

    } : {
        status : pharamcySeedView.status,
        message : pharamcySeedView.message,
        errorCode : pharamcySeedView.errorCode
    }
}