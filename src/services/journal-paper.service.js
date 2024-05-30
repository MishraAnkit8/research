const journalPaperModel = require('../models/journal-paper.models');

module.exports.renderJournalPaper = async (userName) => {

    const fetchJournalArticle  = await journalPaperModel.fetchJournalPaper(userName);

//    console.log('journalArticleData ===>>>>', fetchJournalArticle);
   // makeing object based in article_id
   const journalData = {};
   fetchJournalArticle.journalArticleData.forEach(data => {
       const id = data.article_id;
       if (!journalData[id]) {
           journalData[id] = data;
         
       }
   });
   const journalArticleData = Object.values(journalData);
   console.log('journalArticleData in service ===>>>>>>>', journalArticleData);
   
   return fetchJournalArticle.status === "Done" ? {
                status : fetchJournalArticle.status,
                message : fetchJournalArticle.message,
                journalArticleData : journalArticleData,
                rowCount : fetchJournalArticle.rowCount,
                nmimsSchool : fetchJournalArticle.nmimsSchool,
                internalEmpList : fetchJournalArticle.internalEmpList,
                nmimsCampus : fetchJournalArticle.nmimsCampus,
                policyCadre : fetchJournalArticle.policyCadre,
                impactFactor : fetchJournalArticle.impactFactor,
                allAuthorList : fetchJournalArticle.allAuthorList
   } : {
                status : fetchJournalArticle.status,
                message : fetchJournalArticle.message,
                errorCode : fetchJournalArticle.errorCode
   } 

}

// service for insert journal articles 
module.exports.insertJournalPapper = async (body, files, userName) => {
    const journalDetails =  body;
    console.log('journalDetails inservice ==>>', journalDetails);
    const articleFilesNameArray = files ?.map(file => file.filename);
    const journalFiles = files ?.map(file => file.filename).join(',');

    console.log('journalFiles =====>>>>>>', journalFiles)
    console.log('articleFilesNameArray ===>>>>>>', articleFilesNameArray);
    const nmimsFacultiesIds = JSON.parse(journalDetails.nmimsFacultiesIds);
    const nmimsSchoolIds = JSON.parse(journalDetails.nmimsSchoolIds);
    const nmimsCampusIds = JSON.parse(journalDetails.nmimsCampusIds);
    // const impactFactorIds = JSON.parse(journalDetails.impactFactorIds);
    const policyCadreIds = JSON.parse(journalDetails.policyCadreIds);
    const allAuthorsIds = JSON.parse(journalDetails.allAuthorsIds);
    const schoolIdsArray = (nmimsSchoolIds.nmimsSchool || []).map(id => parseInt(id));
    const campusIdsArray = (nmimsCampusIds.nmimsCampus || []).map(id => parseInt(id));
    const nmimsAuthorsArray = (nmimsFacultiesIds.nmimsInternalFaculty || []).map(id => parseInt(id));
    // const impactFactorArray = (impactFactorIds.impactFactor || []).map(id => parseInt(id));
    const policyCadreArray = (policyCadreIds.policyCadre || []).map(id => parseInt(id));
    const allAuthorsArray = (allAuthorsIds.authorsList || []).map(id => parseInt(id));

    console.log('schoolIdsArray ===>>>>', schoolIdsArray);
    console.log('campusIdsArray ===>>>>', campusIdsArray);
    console.log('nmimsAuthorsArray ===>>>>', nmimsAuthorsArray);
    // console.log('impactFactorArray ===>>>>', impactFactorArray);
    console.log('policyCadreArray ===>>>>', policyCadreArray);
    console.log('allAuthorsArray ===>>>>', allAuthorsArray);

    const schoolsIdsStrings = schoolIdsArray.join(',')
    const campusIdsString = campusIdsArray.join(',');
    const policadreIdsstring = policyCadreArray.join(',');
    // const impacatFactorIdsString = impactFactorArray.join(',');
    const nmisAuthorIdsstring = nmimsAuthorsArray.join(',');
    const allAuthorsIdsString = allAuthorsArray.join(',');
    

    const newJournalPaper = await journalPaperModel.insertJournalArticle(journalDetails, articleFilesNameArray, schoolIdsArray, campusIdsArray,
         policyCadreArray, allAuthorsArray, nmimsAuthorsArray, journalFiles, userName);

    console.log('newJournalPaper ==>>', newJournalPaper);
    // const documentIds = newJournalPaper.documentIds;
    // const documentIdsString = documentIds.join(',');
    // const schoolList = newJournalPaper.schoolList.join(',');
    // const campusList = newJournalPaper.campusList.join(',');
    // const impactFactorList = newJournalPaper.impactFactorList.join(',');
    // const policyCadreList = newJournalPaper.policyCadreList.join(',');
    // console.log('impactFactorList ===>>>>', impactFactorList);


    return newJournalPaper.status === "Done" ? {
        status : newJournalPaper.status,
        message : newJournalPaper.message,
        rowCount : newJournalPaper.rowCount,
        journalPaperId : newJournalPaper.journalPaperId,
        // documentIds: newJournalPaper.documentIds,
        // articledocumentsIds: newJournalPaper.articledocumentsIds,
        // articlImpactFactorIds: newJournalPaper.articlImpactFactorIds,
        // articlePolicyCadreIds: newJournalPaper.articlePolicyCadreIds,
        // articleSchoolIds: newJournalPaper.articleSchoolIds,
        // articleCampusIds: newJournalPaper.articleCampusIds,
        // journalAuthorsIds: newJournalPaper.journalAuthorsIds,
        // allArticleAuthorIds: newJournalPaper.allArticleAuthorIds,
        // schoolList: schoolList,
        // campusList: campusList,
        // impactFactorList : impactFactorList,
        // policyCadreList : policyCadreList,
        // schoolsIdsStrings : schoolsIdsStrings,
        // campusIdsString : campusIdsString,
        // policadreIdsstring : policadreIdsstring,
        // impacatFactorIdsString : impacatFactorIdsString,
        // nmisAuthorIdsstring : nmisAuthorIdsstring, 
        // allAuthorsIdsString : allAuthorsIdsString, 
        // documentIdsString : documentIdsString,
        // articleFilesNameArray : articleFilesNameArray,
        // journalDetails : journalDetails
    } : {
        status : newJournalPaper.status,
        message : newJournalPaper.message,
        errorCode : newJournalPaper.errorCode
    }
};

// service for delete
module.exports.deleteJournalPaper = async (journalPaperId) => {
    console.log('journalPaperId in service ==>>>>>', journalPaperId);

    const deleteJournalArticleData = await journalPaperModel.deleteJournalPaper({ journalPaperId });

    console.log('deleteJournalArticleData in services ===>>>>', deleteJournalArticleData);

    return deleteJournalArticleData.status === "Done" ? {
        status : deleteJournalArticleData.status,
        message : deleteJournalArticleData.message
    } : {
        status : deleteJournalArticleData.status,
        message : deleteJournalArticleData.message,
        errorCode : deleteJournalArticleData.errorCode
    }
};

// service for update
module.exports.updateJournalPaper = async (body, files, userName) => {

    const updateJournalDetails = body;
    const journalPaperId = updateJournalDetails.journalPaperId; 

    console.log(' updateJournalDetails data for updation in service ===>>>>', updateJournalDetails);
    const updatedArticleFilesNameArray = files ?.map(file => file.filename);
    console.log('updatedArticleFilesNameArray ====>>>>>>>', updatedArticleFilesNameArray);
    const journalFiles = files ?.map(file => file.filename).join(',');
    console.log('journalFiles in update =====>>>>>>', journalFiles);

    console.log('updatedArticleFilesNameArray ===>>>>>>', updatedArticleFilesNameArray);

    const updateNmimsFacultiesIds = JSON.parse(updateJournalDetails.nmimsFacultiesIds);
    const updateNmimsSchoolIds = JSON.parse(updateJournalDetails.nmimsSchoolIds);
    const updateNmimsCampusIds = JSON.parse(updateJournalDetails.nmimsCampusIds);
    // const updateImpactFactorIds = JSON.parse(updateJournalDetails.impactFactorIds);
    const updatePolicyCadreIds = JSON.parse(updateJournalDetails.policyCadreIds);
    const updateAllAuthorsIds = JSON.parse(updateJournalDetails.allAuthorsIds);

    const updateSchoolIdsArray = (updateNmimsSchoolIds.nmimsSchool || []).map(id => parseInt(id));
    const updateCampusIdsArray = (updateNmimsCampusIds.nmimsCampus || []).map(id => parseInt(id));
    const updateNmimsAuthorsArray = (updateNmimsFacultiesIds.nmimsInternalFaculty || []).map(id => parseInt(id));
    // const updateImpactFactorArray = (updateImpactFactorIds.impactFactor || []).map(id => parseInt(id));
    const updatePolicyCadreArray = (updatePolicyCadreIds.policyCadre || []).map(id => parseInt(id));
    const updateAllAuthorsArray = (updateAllAuthorsIds.authorsList || []).map(id => parseInt(id));

    console.log('updateSchoolIdsArray ===>>>>', updateSchoolIdsArray);
    console.log('updateCampusIdsArray ===>>>>', updateCampusIdsArray);
    console.log('updateNmimsAuthorsArray ===>>>>', updateNmimsAuthorsArray);
    // console.log('updateImpactFactorArray ===>>>>', updateImpactFactorArray);
    console.log('updatePolicyCadreArray ===>>>>', updatePolicyCadreArray);
    console.log('updateAllAuthorsArray ===>>>>', updateAllAuthorsArray);

    const schoolsIdsStrings = updateSchoolIdsArray.join(',')
    const campusIdsString = updateCampusIdsArray.join(',');
    const policadreIdsstring = updatePolicyCadreArray.join(',');
    // const impacatFactorIdsString = updateImpactFactorArray.join(',');
    const nmisAuthorIdsstring = updateNmimsAuthorsArray.join(',');
    const allAuthorsIdsString = updateAllAuthorsArray.join(',');

    const updatedJournalData = await journalPaperModel.updateJournalPaperData(journalPaperId, updateJournalDetails, updateSchoolIdsArray, updateCampusIdsArray, updateNmimsAuthorsArray,
         updatePolicyCadreArray, updateAllAuthorsArray, updatedArticleFilesNameArray, journalFiles, userName);

    console.log('data is service ==>>>', updatedJournalData);
    // const documentIds = updatedJournalData.documentIds;
    // const documentIdsString = documentIds ? documentIds.join(',') : null;
    // const schoolList = updatedJournalData.schoolList ? updatedJournalData.schoolList.join(',') : null;
    // const campusList = updatedJournalData.campusList ? updatedJournalData.campusList.join(',') : null;
    // const impactFactorList = updatedJournalData.impactFactorList ?  updatedJournalData.impactFactorList.join(',') : null;
    // const policyCadreList = updatedJournalData.policyCadreList ?updatedJournalData.policyCadreList.join(','): null;

    return updatedJournalData.status === "Done" ? {
        status : updatedJournalData.status,
        message : updatedJournalData.message,
        rowCount : updatedJournalData.rowCount,
        journalPaperId : updatedJournalData.journalPaperId,
        // documentIds: updatedJournalData.documentIds,
        // articledocumentsIds: updatedJournalData.articledocumentsIds,
        // articlImpactFactorIds: updatedJournalData.articlImpactFactorIds,
        // articlePolicyCadreIds: updatedJournalData.articlePolicyCadreIds,
        // articleSchoolIds: updatedJournalData.articleSchoolIds,
        // articleCampusIds: updatedJournalData.articleCampusIds,
        // journalAuthorsIds: updatedJournalData.journalAuthorsIds,
        // allArticleAuthorIds: updatedJournalData.allArticleAuthorIds,
        // schoolList: schoolList,
        // campusList: campusList,
        // impactFactorList : impactFactorList,
        // policyCadreList : policyCadreList,
        // schoolsIdsStrings : schoolsIdsStrings,
        // campusIdsString : campusIdsString,
        // policadreIdsstring : policadreIdsstring,
        // impacatFactorIdsString : impacatFactorIdsString,
        // nmisAuthorIdsstring : nmisAuthorIdsstring, 
        // allAuthorsIdsString : allAuthorsIdsString, 
        // documentIdsString : documentIdsString,
        // articleFilesNameArray : updatedArticleFilesNameArray,
        // updateJournalDetails : updateJournalDetails
    } : {
        status : updatedJournalData.status,
        message : updatedJournalData.message,
        errorCode : updatedJournalData.errorCode ? updatedJournalData.errorCode : null
    }

}

// service for view
module.exports.viewJournalPaper = async (journalPaperId, userName) => {
    console.log('journalPaperId inservice ====>>>>>>>', journalPaperId);

    const viewJournalPaperData = await journalPaperModel.viewJournalPaperData(journalPaperId, userName);

    console.log('viewJournalPaperData ===>>>>>', viewJournalPaperData);
    return viewJournalPaperData.status === "Done" ? {
        status : viewJournalPaperData.status,
        message : viewJournalPaperData.message,
        journalAricleData : viewJournalPaperData.journalAricleData,
        nmimsAuthors : viewJournalPaperData.nmimsAuthors,
        allAuthorsData : viewJournalPaperData.allAuthorsData,
        articleSchoolData : viewJournalPaperData.articleSchoolData,
        articleCampusData : viewJournalPaperData.articleCampusData,
        articleDocuments : viewJournalPaperData.articleDocuments,
        // articleImpactFactor : viewJournalPaperData.articleImpactFactor,
        articlePolicyCadre : viewJournalPaperData.articlePolicyCadre
    } : {
        status : viewJournalPaperData.status,
        message : viewJournalPaperData.message,
        errorCode : viewJournalPaperData.errorCode
    }

}