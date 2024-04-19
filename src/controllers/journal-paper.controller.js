const journalPaperService = require('../services/journal-paper.service');


module.exports.renderJournalPaper = async (req, res, next) => {

    const journalList = await journalPaperService.renderJournalPaper();

    console.log('journalList in controller ====>>>>', journalList.rowCount);
    // console.log('journalList.allAuthorList ===>>>>>>>', journalList.allAuthorList)
    
    res.render('journal-paper', {
        status : journalList.status,
        message : journalList.message,
        journalData : journalList.journalArticleData,
        rowCount : journalList.rowCount,
        nmimsSchoolList : journalList.nmimsSchool,
        internalEmpList : journalList.internalEmpList,
        nmimsCampusList : journalList.nmimsCampus,
        policyCadre : journalList.policyCadre,
        impactFactor : journalList.impactFactor,
        allAuthorList : journalList.allAuthorList,
        errorCode : journalList.errorCode ? journalList.errorCode : null
    });
};


module.exports.insertJournalPapperDetails = async (req, res, next) => {

    console.log('data comming from ejs  in controller', req.journalDetails);
    console.log('files in controller ===>>>>>', req.files);

    const journalPaperData = await journalPaperService.insertJournalPapper(req.body, req.files);

    console.log("journalPaperData ===>" , journalPaperData.rowCount);

    const statusCode = journalPaperData.status === "Done" ? 200 : (journalPaperData.errorCode ? 400 : 500);

    res.status(statusCode).send({
        status : journalPaperData.status,
        message : journalPaperData.message,
        rowCount : journalPaperData.rowCount,
        journalPaperId : journalPaperData.journalPaperId,
        documentIds: journalPaperData.documentIds,
        articledocumentsIds: journalPaperData.articledocumentsIds,
        articlImpactFactorIds: journalPaperData.articlImpactFactorIds,
        articlePolicyCadreIds: journalPaperData.articlePolicyCadreIds,
        articleSchoolIds: journalPaperData.articleSchoolIds,
        articleCampusIds: journalPaperData.articleCampusIds,
        journalAuthorsIds: journalPaperData.journalAuthorsIds,
        allArticleAuthorIds: journalPaperData.allArticleAuthorIds,
        schoolList: journalPaperData.schoolList,
        campusList: journalPaperData.campusList,
        impactFactorList : journalPaperData.impactFactorList,
        policyCadreList : journalPaperData.policyCadreList,
        journalDetails : journalPaperData.journalDetails,
        schoolsIdsStrings : journalPaperData.schoolsIdsStrings,
        campusIdsString : journalPaperData.campusIdsString,
        policadreIdsstring : journalPaperData.policadreIdsstring,
        impacatFactorIdsString : journalPaperData.impacatFactorIdsString,
        nmisAuthorIdsstring : journalPaperData.nmisAuthorIdsstring, 
        allAuthorsIdsString : journalPaperData.allAuthorsIdsString, 
        documentIdsString : journalPaperData.documentIdsString,
        articleFilesNameArray : journalPaperData.articleFilesNameArray,
        errorCode : journalPaperData.errorCode ? journalPaperData.errorCode : null
    })
};


module.exports.delJournalPaper = async (req, res, next) => {
    const journalPaperId = req.body.journalPaperId;

    const delJournalData = await journalPaperService.deleteJournalPaper(journalPaperId);

    const statusCode = delJournalData.status === "Done" ? 200 : (delJournalData.errorCode ? 400 : 500);

    res.status(statusCode).send({
        status : delJournalData.status,
        message : delJournalData.message,
        errorCode : delJournalData.errorCode ? delJournalData.errorCode : null
    })

};
 

module.exports.updateJournalPaper = async (req, res, next) => {
    console.log('data is comming from template ==>>>>>', req.body);
    console.log('files in conteroller ===>>>>', req.files)
    
    const updatePaper = await journalPaperService.updateJournalPaper(req.body, req.files);

    console.log('updatePaper updation in controller', updatePaper);
    const statusCode = updatePaper.status === "Done" ? 200 : (updatePaper.errorCode ? 400 : 500);
    console.log('statusCode ==>>>>', statusCode);

    res.status(statusCode).send({
        status : updatePaper.status,
        message : updatePaper.message,
        status : updatePaper.status,
        message : updatePaper.message,
        rowCount : updatePaper.rowCount,
        documentIds: updatePaper.documentIds,
        articledocumentsIds: updatePaper.articledocumentsIds,
        articlImpactFactorIds: updatePaper.articlImpactFactorIds,
        articlePolicyCadreIds: updatePaper.articlePolicyCadreIds,
        articleSchoolIds: updatePaper.articleSchoolIds,
        articleCampusIds: updatePaper.articleCampusIds,
        journalAuthorsIds: updatePaper.journalAuthorsIds,
        allArticleAuthorIds: updatePaper.allArticleAuthorIds,
        schoolList: updatePaper.schoolList,
        campusList: updatePaper.campusList,
        impactFactorList : updatePaper.impactFactorList,
        policyCadreList : updatePaper.policyCadreList,
        schoolsIdsStrings : updatePaper.schoolsIdsStrings,
        campusIdsString : updatePaper.campusIdsString,
        policadreIdsstring :updatePaper.policadreIdsstring,
        impacatFactorIdsString : updatePaper.impacatFactorIdsString,
        nmisAuthorIdsstring : updatePaper.nmisAuthorIdsstring, 
        allAuthorsIdsString : updatePaper.allAuthorsIdsString, 
        documentIdsString : updatePaper.documentIdsString,
        articleFilesNameArray : updatePaper.articleFilesNameArray,
        updateJournalDetails : updatePaper.updateJournalDetails,
        errorCode : updatePaper.errorCode ? updatePaper.errorCode : null
    })
};

module.exports.viewJournalPaper = async(req, res, next) => {
    const journalPaperId = req.body.journalPaperId;
    console.log('journalPaperId for View' , journalPaperId);


    const viewJournalDetails = await journalPaperService.viewJournalPaper({journalPaperId});

    console.log('viewJournalDetails in controller ====>>>>>>', viewJournalDetails);

    const statusCode = viewJournalDetails.status === "Done" ? 200 : (viewJournalDetails.errorCode ? 400 : 500);

    res.status(statusCode).send({
        status : viewJournalDetails.status,
        message : viewJournalDetails.message,
        journalAricleData : viewJournalDetails.journalAricleData,
        nmimsAuthors : viewJournalDetails.nmimsAuthors,
        allAuthorsData : viewJournalDetails.allAuthorsData,
        articleSchoolData : viewJournalDetails.articleSchoolData,
        articleCampusData : viewJournalDetails.articleCampusData,
        articleDocuments : viewJournalDetails.articleDocuments,
        articleImpactFactor : viewJournalDetails.articleImpactFactor,
        articlePolicyCadre : viewJournalDetails.articlePolicyCadre,
        errorCode : viewJournalDetails.errorCode ? viewJournalDetails.errorCode : null
    })
}