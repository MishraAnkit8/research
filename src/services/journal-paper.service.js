const journalPaperModel = require('../models/journal-paper.models');

module.exports.renderJournalPaper = async () => {

    const fetchJournalArticle  = await journalPaperModel.fetchJournalPaper();

   console.log('journalArticleData ===>>>>', fetchJournalArticle.journalArticleData);
 

   // makeing object based in article_id
   const journalData = {};
   fetchJournalArticle.journalArticleData.forEach(data => {
       const id = data.article_id;
       if (!journalData[id]) {
           journalData[id] = data;
         
       }
   });
   const journalArticleData = Object.values(journalData);
//    console.log('journalArticleData in service ===>>>>>>>', journalArticleData);
   
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
module.exports.insertJournalPapper = async (body, files) => {
    const journalDetails =  body;
    console.log('journalDetails inservice ==>>', journalDetails);
    const articleFilesNameArray = files ?.map(file => file.filename);
    console.log('articleFilesNameArray ===>>>>>>', articleFilesNameArray);
    const nmimsFacultiesIds = JSON.parse(journalDetails.nmimsFacultiesIds);
    const nmimsSchoolIds = JSON.parse(journalDetails.nmimsSchoolIds);
    const nmimsCampusIds = JSON.parse(journalDetails.nmimsCampusIds);
    const impactFactorIds = JSON.parse(journalDetails.impactFactorIds);
    const policyCadreIds = JSON.parse(journalDetails.policyCadreIds);
    const allAuthorsIds = JSON.parse(journalDetails.allAuthorsIds);
    const schoolIdsArray = (nmimsSchoolIds.nmimsSchool || []).map(id => parseInt(id));
    const campusIdsArray = (nmimsCampusIds.nmimsCampus || []).map(id => parseInt(id));
    const nmimsAuthorsArray = (nmimsFacultiesIds.nmimsInternalFaculty || []).map(id => parseInt(id));
    const impactFactorArray = (impactFactorIds.impactFactor || []).map(id => parseInt(id));
    const policyCadreArray = (policyCadreIds.policyCadre || []).map(id => parseInt(id));
    const allAuthorsArray = (allAuthorsIds.authorsList || []).map(id => parseInt(id));

    console.log('schoolIdsArray ===>>>>', schoolIdsArray);
    console.log('campusIdsArray ===>>>>', campusIdsArray);
    console.log('nmimsAuthorsArray ===>>>>', nmimsAuthorsArray);
    console.log('impactFactorArray ===>>>>', impactFactorArray);
    console.log('policyCadreArray ===>>>>', policyCadreArray);
    console.log('allAuthorsArray ===>>>>', allAuthorsArray);

    const newJournalPaper = await journalPaperModel.insertJournalArticle(journalDetails, articleFilesNameArray, schoolIdsArray, campusIdsArray,
        impactFactorArray, policyCadreArray, allAuthorsArray, nmimsAuthorsArray);

    console.log('newJournalPaper ==>>', newJournalPaper)
    
    return newJournalPaper.status === "Done" ? {
        status : newJournalPaper.status,
        message : newJournalPaper.message,
        rowCount : newJournalPaper.rowCount,
        journalPaperId : newJournalPaper.journalPaperId,
        documentIds: newJournalPaper.documentIds,
        articledocumentsIds: newJournalPaper.articledocumentsIds,
        articlImpactFactorIds: newJournalPaper.articlImpactFactorIds,
        articlePolicyCadreIds: newJournalPaper.articlePolicyCadreIds,
        articleSchoolIds: newJournalPaper.articleSchoolIds,
        articleCampusIds: newJournalPaper.articleCampusIds,
        journalAuthorsIds: newJournalPaper.journalAuthorsIds,
        allArticleAuthorIds: newJournalPaper.allArticleAuthorIds,
        schoolList: newJournalPaper.schoolList,
        campusList: newJournalPaper.campusList,
        impactFactorList : newJournalPaper.impactFactorList,
        policyCadreList : newJournalPaper.policyCadreList,
        journalDetails : journalDetails
    } : {
        status : newJournalPaper.status,
        message : newJournalPaper.message,
        errorCode : newJournalPaper.errorCode
    }
};

// service for delete
module.exports.deleteJournalPaper = async (journalPaperId) => {
    const result = await journalPaperModel.deleteJournalPaper({ journalPaperId });
    if(result.rowCount === 1){
        return {
            status : 'done' ,
            massage : 'row is deleted successfully'
        };
    }
    else{
        return {
            status : 'failed' ,
            massage : 'could not delete any thing'
        }
    }
};

// service for update
module.exports.updateJournalPaper = async ({journalPaperId, updateJournalDetails}) => {
    console.log('id for  updation in service', journalPaperId);
    const updatedJournalData = await journalPaperModel.updateJournalPaperData({journalPaperId, updateJournalDetails});
    console.log('data is service ==>>>', updatedJournalData);
    return updatedJournalData
}

// service for view
module.exports.viewJournalPaper = async ({journalPaperId}) => {
    const viewJournalPaperData = await journalPaperModel.viewJournalPaperData({journalPaperId});
    if(viewJournalPaperData.rowCount === 1){
        console.log('data in service  for applying view ===>>',viewJournalPaperData.rows[0] )
        return  viewJournalPaperData.rows;
    } 
    else{
        return {
            status : 'failed',
            masssage : 'error to fetching'
        }
    }
}