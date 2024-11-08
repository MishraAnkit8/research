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

    const educationalDetails = body.detailsContainerArray;
    let eduaction = educationalDetails
    if (eduaction[0] === '1') {
        eduaction.shift();
    }
    console.log('eduaction ===>>>>>>', eduaction);
    const filteredEducation =  eduaction.filter(value => value !== null && value !== '');
    console.log('filteredEducation ===>>>>>>', filteredEducation);
    
    const chunkSize = 3;
    const detailsDataArray = Array.from({ length: Math.ceil(eduaction.length / chunkSize) }, (_, index) =>
        filteredEducation.slice(index * chunkSize, index * chunkSize + chunkSize)
    );
    
    console.log('detailsDataArray =>>>>>>>>', detailsDataArray);

    const insertInvestigatiorEducation = await pharmacySeedModels.insertInvestigatorEducationDetails(detailsDataArray, userName)
    console.log('insertInvestigatiorEducation =====>>>>>>.', insertInvestigatiorEducation);

    return insertInvestigatiorEducation.status === "Done" ? {
        status : insertInvestigatiorEducation.status,
        message : insertInvestigatiorEducation.message,
        ids : insertInvestigatiorEducation.ids,
        rowCount : insertInvestigatiorEducation.rowCount,
        detailsDataArray : detailsDataArray
    } : {
        status : insertInvestigatiorEducation.status,
        message : insertInvestigatiorEducation.message,
        errorCode : insertInvestigatiorEducation.errorCode
    }


}

module.exports.insertInvestorExperience = async(body, userName) => {
    const experienceDetails = body.detailsContainerArray;
    console.log('data in experience service === >>>>>>', experienceDetails);

    let experience = experienceDetails;
    if (experience[0] === '1') {
        experience.shift();
    }
    console.log('experience ===>>>>>>', experience)

    const filteredExperience = experience.filter(value => value !== null && value !== '');
    console.log('filteredExperience ===>>>>>>', filteredExperience);
    
    const chunkSize = 3;
    const detailsDataArray = Array.from({ length: Math.ceil(experience.length / chunkSize) }, (_, index) =>
        filteredExperience.slice(index * chunkSize, index * chunkSize + chunkSize)
    );
    
    console.log('detailsDataArray =>>>>>>>>', detailsDataArray);

    const insertInvestigatiorExperience = await pharmacySeedModels.insertInvestigatorExperienceDetails(detailsDataArray, userName)

    return insertInvestigatiorExperience.status === "Done" ? {
        status : insertInvestigatiorExperience.status,
        message : insertInvestigatiorExperience.message,
        ids : insertInvestigatiorExperience.ids,
        rowCount : insertInvestigatiorExperience.rowCount,
        detailsDataArray : detailsDataArray
    } : {
        status : insertInvestigatiorExperience.status,
        message : insertInvestigatiorExperience.message,
        errorCode : insertInvestigatiorExperience.errorCode
    }


}

module.exports.insertInvestorBook = async(body, userName) => {
    const investigatorBookDetails = body.detailsContainerArray;
    let book = investigatorBookDetails
    if (book[0] === '1') {
        book.shift();
    }
    console.log('book ===>>>>>>', book);

    const filteredBook = book.filter(value => value !== null && value !== '');;
    console.log('filteredBook ===>>>>>>', filteredBook);
    
    const chunkSize = 6;
    const detailsDataArray = Array.from({ length: Math.ceil(book.length / chunkSize) }, (_, index) =>
        filteredBook.slice(index * chunkSize, index * chunkSize + chunkSize)
    );
    
    console.log('detailsDataArray =>>>>>>>>', detailsDataArray);

    const insertInvestigatiorBook = await pharmacySeedModels.insertInvestigatorBookDetails(detailsDataArray, userName)

    console.log('insertInvestigatiorBook =====>>>>>>.', insertInvestigatiorBook);

    return insertInvestigatiorBook.status === "Done" ? {
        status : insertInvestigatiorBook.status,
        message : insertInvestigatiorBook.message,
        ids : insertInvestigatiorBook.ids,
        rowCount : insertInvestigatiorBook.rowCount,
        detailsDataArray : detailsDataArray
    } : {
        status : insertInvestigatiorBook.status,
        message : insertInvestigatiorBook.message,
        errorCode : insertInvestigatiorBook.errorCode
    }

}

module.exports.insertInvestorBookChapter = async(body, userName) => {
    const investigatorBookChapterDetails = body.detailsContainerArray;
    let bookchapter = investigatorBookChapterDetails;
    if (bookchapter[0] === '1') {
        bookchapter.shift();
    }
    console.log('bookchapter ===>>>>>>', bookchapter);

    const filteredBookChapter = bookchapter.filter(value => value !== null && value !== '');;
    console.log('filteredBookChapter ===>>>>>>', filteredBookChapter);
    
    const chunkSize = 8;
    const detailsDataArray = Array.from({ length: Math.ceil(bookchapter.length / chunkSize) }, (_, index) =>
        filteredBookChapter.slice(index * chunkSize, index * chunkSize + chunkSize)
    );
    
    console.log('detailsDataArray =>>>>>>>>', detailsDataArray);

    const insertInvestigatiorBookChapter = await pharmacySeedModels.insertInvestigatorBookChapterDetails(detailsDataArray, userName)

    console.log('insertInvestigatiorBookChapter =====>>>>>>.', insertInvestigatiorBookChapter);

    return insertInvestigatiorBookChapter.status === "Done" ? {
        status : insertInvestigatiorBookChapter.status,
        message : insertInvestigatiorBookChapter.message,
        ids : insertInvestigatiorBookChapter.ids,
        rowCount : insertInvestigatiorBookChapter.rowCount,
        detailsDataArray : detailsDataArray
    } : {
        status : insertInvestigatiorBookChapter.status,
        message : insertInvestigatiorBookChapter.message,
        errorCode : insertInvestigatiorBookChapter.errorCode
    }

}

module.exports.insertInvestorPatent = async(body, userName) => {
    const investigatorPatentDetails = body.detailsContainerArray;
    let patent = investigatorPatentDetails;
    if (patent[0] === '1') {
        patent.shift();
    }
    console.log('patent ===>>>>>>', patent);

    const filteredPatent = patent.filter(value => value !== null && value !== '');
    console.log('filteredPatent ===>>>>>>', filteredPatent);
    
    const chunkSize = 5;
    const detailsDataArray = Array.from({ length: Math.ceil(patent.length / chunkSize) }, (_, index) =>
        filteredPatent.slice(index * chunkSize, index * chunkSize + chunkSize)
    );
    
    console.log('detailsDataArray =>>>>>>>>', detailsDataArray);

    const insertInvestigatiorPatent = await pharmacySeedModels.insertInvestigatorPatentDetails(detailsDataArray, userName)

    console.log('insertInvestigatiorPatent =====>>>>>>.', insertInvestigatiorPatent);

    return insertInvestigatiorPatent.status === "Done" ? {
        status : insertInvestigatiorPatent.status,
        message : insertInvestigatiorPatent.message,
        ids : insertInvestigatiorPatent.ids,
        rowCount : insertInvestigatiorPatent.rowCount,
        detailsDataArray : detailsDataArray
    } : {
        status : insertInvestigatiorPatent.status,
        message : insertInvestigatiorPatent.message,
        errorCode : insertInvestigatiorPatent.errorCode
    }

}

module.exports.insertInvestorPublication = async(body, userName) => {
    const publicationDetails = body.detailsContainerArray;
    let publication = publicationDetails;
    if (publication[0] === '1') {
        publication.shift();
    }
    console.log('publication ===>>>>>>', publication);

    const filteredPublication = publication.filter(value => value !== null && value !== '');
    console.log('filteredPublication ===>>>>>>', filteredPublication);
    
    const chunkSize = 8;
    const detailsDataArray = Array.from({ length: Math.ceil(publication.length / chunkSize) }, (_, index) =>
        filteredPublication.slice(index * chunkSize, index * chunkSize + chunkSize)
    );
    
    console.log('detailsDataArray =>>>>>>>>', detailsDataArray);

    const insertInvestigatiorPublication = await pharmacySeedModels.insertInvestigatorPublicationDetails(detailsDataArray, userName)

    return insertInvestigatiorPublication.status === "Done" ? {
        status : insertInvestigatiorPublication.status,
        message : insertInvestigatiorPublication.message,
        ids : insertInvestigatiorPublication.ids,
        rowCount : insertInvestigatiorPublication.rowCount,
        detailsDataArray : detailsDataArray
    } : {
        status : insertInvestigatiorPublication.status,
        message : insertInvestigatiorPublication.message,
        errorCode : insertInvestigatiorPublication.errorCode
    }


}

module.exports.insertInvestorResearchImplementation = async(body, userName) => {
    const implementationDetails = body.detailsContainerArray;
    let implementation = implementationDetails;
    if (implementation[0] === '1') {
        implementation.shift();
    }
    console.log('implementation ===>>>>>>', implementation);

    const filteredImplementation = implementation.filter(value => value !== null && value !== '');
    console.log('filteredImplementation ===>>>>>>', filteredImplementation);
    
    const chunkSize = 8;
    const detailsDataArray = Array.from({ length: Math.ceil(implementation.length / chunkSize) }, (_, index) =>
        filteredImplementation.slice(index * chunkSize, index * chunkSize + chunkSize)
    );
    
    console.log('detailsDataArray implementation =>>>>>>>>', detailsDataArray);
    const insertImplementationDetails = await pharmacySeedModels.insertInvestigatorResearchImplementationDetails(detailsDataArray, userName)

    return insertImplementationDetails.status === "Done" ? {
        status : insertImplementationDetails.status,
        message : insertImplementationDetails.message,
        ids : insertImplementationDetails.ids,
        rowCount : insertImplementationDetails.rowCount,
        detailsDataArray : detailsDataArray
    } : {
        status : insertImplementationDetails.status,
        message : insertImplementationDetails.message,
        errorCode : insertImplementationDetails.errorCode
    }


}



module.exports.insertInvestorResearchCompleted = async(body, userName) => {
    const researchProjectCompleteDetails = body.detailsContainerArray;
    let completed = researchProjectCompleteDetails;
    if (completed[0] === '1') {
        completed.shift();
    }
    console.log('completed ===>>>>>>', completed);

    const filteredCompleted = completed.filter(value => value !== null && value !== '');
    console.log('filteredCompleted ===>>>>>>', filteredCompleted);
    
    const chunkSize = 8;
    const detailsDataArray = Array.from({ length: Math.ceil(completed.length / chunkSize) }, (_, index) =>
        filteredCompleted.slice(index * chunkSize, index * chunkSize + chunkSize)
    );

    console.log('datetails complted detailsDataArray ====>>>>', detailsDataArray)
    const insertCompletedReserch = await pharmacySeedModels.insertInvestigatorResearchCompletedDetails(detailsDataArray, userName)

    return insertCompletedReserch.status === "Done" ? {
        status : insertCompletedReserch.status,
        message : insertCompletedReserch.message,
        ids : insertCompletedReserch.ids,
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
    const educationalData = groupArrayIntoChunks(pharmacySeedGrantDetails.educaltionalData, 3);
    const experienceData = groupArrayIntoChunks(pharmacySeedGrantDetails.experienceData, 3);
    const bookData = groupArrayIntoChunks(pharmacySeedGrantDetails.bookData, 6);
    const bookChapterData = groupArrayIntoChunks(pharmacySeedGrantDetails.bookChapterData,8);
    const publicationData = groupArrayIntoChunks(pharmacySeedGrantDetails.publicationData, 8);
    const patentData = groupArrayIntoChunks(pharmacySeedGrantDetails.patentData, 5);
    const implementationData = groupArrayIntoChunks(pharmacySeedGrantDetails.implementationData, 5);
    const completedData = groupArrayIntoChunks(pharmacySeedGrantDetails.completedData, 5);
    console.log('educationalData ====>>>>>>', educationalData);
    console.log('patentData ====>>>>>>>', patentData);

    console.log('bookChapterData ====>>>>>>>', bookChapterData)

    const investorDetails = {
        invatigatorName: pharmacySeedGrantDetails.invatigatorName,
        investigatorDesignation: pharmacySeedGrantDetails.investigatorDesignation,
        investigatorAddress: pharmacySeedGrantDetails.investigatorAddress,
        invatigatorMobile: pharmacySeedGrantDetails.invatigatorMobile,
        investigatorEmail: pharmacySeedGrantDetails.investigatorEmail,
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
      
      console.log('investorDetails =>>>>', investorDetails);
      

    const pharmacyData = await pharmacySeedModels.insertPharmacyDetails(pharmacySeedGrantDetails, userName, educationalData, experienceData, bookData, bookChapterData, publicationData, 
        patentData, implementationData, completedData, investorDetails,
        principalInvestigatorDetails, coInvestigatorDetails);

    console.log('pharmacyData in service  ====>>>>>>', pharmacyData);

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


module.exports.retriveDetail = async(body) => {
    const pharmacyId = body.pharmacyId;
    console.log('pharcmacyId in service ====>>>>>>>', pharmacyId);

    const retriveDataDetails = await pharmacySeedModels.retriveDataFromDetailsTable(pharmacyId);

    console.log('retriveDataDetails ===>>>>', retriveDataDetails);

    return retriveDataDetails.status === "Done" ? {
        status : retriveDataDetails.status,
        message : retriveDataDetails.message,
        educaltionalDetails : retriveDataDetails.educaltionalDetails,
        experienceDetails : retriveDataDetails.experienceDetails,
        bookDetails : retriveDataDetails.bookDetails,
        bookChapterDetails : retriveDataDetails.bookChapterDetails,
        PublicationDetails : retriveDataDetails.PublicationDetails,
        patentDetails : retriveDataDetails.patentDetails,
        researchImplementationDetails : retriveDataDetails.researchImplementationDetails,
        completedResearchDetails : retriveDataDetails.completedResearchDetails

    } : {
        status : retriveDataDetails.status,
        message : retriveDataDetails.message,
        errorCode : retriveDataDetails.errorCode
    }


}





module.exports.updatePharmacyData = async(body, userName) => {
    const updatePharmacyDetails = body.updatePharmacyDetails;
    const pharmacyId = updatePharmacyDetails.pharmacyId
    console.log('updatePharmacyDetails ===>>>>>', updatePharmacyDetails);
    const educationalData = groupArrayIntoChunksUpdate(updatePharmacyDetails.educaltionalData, 4);
    const experienceData = groupArrayIntoChunksUpdate(updatePharmacyDetails.experienceData, 4);
    const bookData = groupArrayIntoChunksUpdate(updatePharmacyDetails.bookData, 7);
    const bookChapterData = groupArrayIntoChunksUpdate(updatePharmacyDetails.bookChapterData, 9);
    const publicationData = groupArrayIntoChunksUpdate(updatePharmacyDetails.publicationData, 9);
    const patentData = groupArrayIntoChunksUpdate(updatePharmacyDetails.patentData, 6);
    const implementationData = groupArrayIntoChunksUpdate(updatePharmacyDetails.implementationData, 6);
    const completedData = groupArrayIntoChunksUpdate(updatePharmacyDetails.completedData, 6);
    console.log('educationalData ====>>>>>>', educationalData);
    console.log('patentData ====>>>>>>>', patentData);

    console.log('bookChapterData ====>>>>>>>', bookChapterData)

    const investorDetails = {
        invatigatorName: updatePharmacyDetails.invatigatorName,
        investigatorDesignation: updatePharmacyDetails.investigatorDesignation,
        investigatorAddress: updatePharmacyDetails.investigatorAddress,
        invatigatorMobile: updatePharmacyDetails.invatigatorMobile,
        investigatorEmail: updatePharmacyDetails.investigatorEmail,
        invastigatorDateOfBirth: updatePharmacyDetails.invastigatorDateOfBirth
    };
    const principalInvestigatorDetails = {
        principalName : updatePharmacyDetails.principalName,
        principalDsg : updatePharmacyDetails.principalDsg,
        principalOrg :  updatePharmacyDetails.principalOrg,
        principalMob : updatePharmacyDetails.principalMob,
        principalEmail : updatePharmacyDetails.principalEmail
    }

    const coInvestigatorDetails = {
        coIvestigatorName : updatePharmacyDetails.coIvestigatorName,
        coIvestigatorDsg : updatePharmacyDetails.coIvestigatorDsg,
        coIvestigatorOrg :  updatePharmacyDetails.coIvestigatorOrg,
        coIvestigatorMob : updatePharmacyDetails.coIvestigatorMob,
        coIvestigatorEmail : updatePharmacyDetails.coIvestigatorEmail
}
  
  console.log('investorDetails =>>>>', investorDetails);

  const pharamcySeedUpdate = await pharmacySeedModels.updatePharmacySeedData(pharmacyId, updatePharmacyDetails, userName, educationalData, experienceData, bookData, bookChapterData, publicationData, 
    patentData, implementationData, completedData, investorDetails,
    principalInvestigatorDetails, coInvestigatorDetails);

    console.log('pharamcySeedUpdate in service  ======>>>>>>>', pharamcySeedUpdate);

    return pharamcySeedUpdate.status === "Done" ? {
        status : pharamcySeedUpdate.status,
        message : pharamcySeedUpdate.message
    } : {
        status : pharamcySeedUpdate.status,
        message : pharamcySeedUpdate.message,
        errorCode : pharamcySeedUpdate.errorCode
    }


}




module.exports.deleteEducationalData = async(body, userName) => {
    console.log('body in service ====>>>>>', body);
    const relatedTableRowId = body.tableId;
    console.log('userName in service ====>>>>>', userName);
    const educationalData = await pharmacySeedModels.deleteEducationalDetails(relatedTableRowId, userName);

    console.log('educationalData ====>>>>>>', educationalData);
    return educationalData.status === "Done" ? {
        status : educationalData.status,
        message : educationalData.message,
        rowCount : educationalData.rowCount
    } : {
        status : educationalData.status,
        message : educationalData.message,
        errorCode : educationalData.errorCode
    }

    
}

module.exports.deleteExperienceData = async(body, userName) => {
    console.log('body in service ====>>>>>', body);
    const relatedTableRowId = body.tableId;
    console.log('userName in service ====>>>>>', userName);
    const experienceData = await pharmacySeedModels.deleteExperienceDetails(relatedTableRowId, userName);

    console.log('experienceData ====>>>>>>', experienceData);
    return experienceData.status === "Done" ? {
        status : experienceData.status,
        message : experienceData.message,
        rowCount : experienceData.rowCount
    } : {
        status : experienceData.status,
        message : experienceData.message,
        errorCode : experienceData.errorCode
    }
    
}

module.exports.deleteBookData = async(body, userName) => {
    console.log('body in service ====>>>>>', body);
    const relatedTableRowId = body.tableId;
    console.log('userName in service ====>>>>>', userName);
    const bookData = await pharmacySeedModels.deleteBookDetails(relatedTableRowId, userName);

    console.log('bookData ====>>>>>>', bookData);
    return bookData.status === "Done" ? {
        status : bookData.status,
        message : bookData.message,
        rowCount : bookData.rowCount
    } : {
        status : bookData.status,
        message : bookData.message,
        errorCode : bookData.errorCode
    }
    
}

module.exports.deleteBookChapterData = async(body, userName) => {
    console.log('body in service ====>>>>>', body);
    const relatedTableRowId = body.tableId;
    console.log('userName in service ====>>>>>', userName);
    const bookChapterData = await pharmacySeedModels.deleteBookChapterDetails(relatedTableRowId, userName);

    console.log('bookChapterData ====>>>>>>', bookChapterData);
    return bookChapterData.status === "Done" ? {
        status : bookChapterData.status,
        message : bookChapterData.message,
        rowCount : bookChapterData.rowCount
    } : {
        status : bookChapterData.status,
        message : bookChapterData.message,
        errorCode : bookChapterData.errorCode
    }
   
}

module.exports.deletePublicationData = async(body, userName) => {
    console.log('body in service ====>>>>>', body);
    const relatedTableRowId = body.tableId;
    console.log('userName in service ====>>>>>', userName);
    const publicationData = await pharmacySeedModels.deletePublicationDetails(relatedTableRowId, userName);

    console.log('publicationData ====>>>>>>', publicationData);
    return publicationData.status === "Done" ? {
        status : publicationData.status,
        message : publicationData.message,
        rowCount : publicationData.rowCount
    } : {
        status : publicationData.status,
        message : publicationData.message,
        errorCode : publicationData.errorCode
    }
        
}

module.exports.deletePatentData = async(body, userName) => {
    console.log('body in service ====>>>>>', body);
    const relatedTableRowId = body.tableId;
    console.log('userName in service ====>>>>>', userName);
    const patentData = await pharmacySeedModels.deletePatentDetails(relatedTableRowId, userName);

    console.log('patentData ====>>>>>>', patentData);
    return patentData.status === "Done" ? {
        status : patentData.status,
        message : patentData.message,
        rowCount : patentData.rowCount
    } : {
        status : patentData.status,
        message : patentData.message,
        errorCode : patentData.errorCode
    }
   
}

module.exports.deleteImplementationData = async(body, userName) => {
    console.log('body in service ====>>>>>', body);
    const relatedTableRowId = body.tableId;
    console.log('userName in service ====>>>>>', userName);
    const researchImplementationData = await pharmacySeedModels.deleteImplementationDetails(relatedTableRowId, userName);

    console.log('researchImplementationData ====>>>>>>', researchImplementationData);
    return researchImplementationData.status === "Done" ? {
        status : researchImplementationData.status,
        message : researchImplementationData.message,
        rowCount : researchImplementationData.rowCount
    } : {
        status : researchImplementationData.status,
        message : researchImplementationData.message,
        errorCode : researchImplementationData.errorCode
    }


   
}

module.exports.deleteCompleteData = async(body, userName) => {
    console.log('body in service ====>>>>>', body);
    const relatedTableRowId = body.tableId;
    console.log('userName in service ====>>>>>', userName);
    const researchCompletedRes = await pharmacySeedModels.deleteCompleteDetails(relatedTableRowId, userName);

    console.log('researchCompletedRes ====>>>>>>', researchCompletedRes);
   return researchCompletedRes.status === "Done" ? {
        status : researchCompletedRes.status,
        message : researchCompletedRes.message,
        rowCount : researchCompletedRes.rowCount
    } : {
        status : researchCompletedRes.status,
        message : researchCompletedRes.message,
        errorCode : researchCompletedRes.errorCode
    }
   
}

module.exports.deletePharmacyDetails = async(body, userName) => {
    const pharmacyId = body.pharmacyId;

    const pharamcySeedDbResponse = await pharmacySeedModels.deletePharmacySeedData(pharmacyId, userName);

    console.log('pharamcySeedDbResponse ====>>>>', pharamcySeedDbResponse);
    return pharamcySeedDbResponse.status === "Done" ? {
        status : pharamcySeedDbResponse.status,
        message : pharamcySeedDbResponse.message,
        rowCount : pharamcySeedDbResponse.rowCount
    } : {
        status : pharamcySeedDbResponse.status,
        message : pharamcySeedDbResponse.message,
        errorCode : pharamcySeedDbResponse.errorCode
    }

}


function groupArrayIntoChunks(array, chunkSize) {
    let groupedArray = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        groupedArray.push(array.slice(i, i + chunkSize));
    }
    return groupedArray;
}

function groupArrayIntoChunksUpdate(array, chunkSize) {
    if (array.length % chunkSize !== 0) {
        chunkSize = chunkSize - 1;
    }
    let groupedArray = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        groupedArray.push(array.slice(i, i + chunkSize));
    }
    return groupedArray;
}