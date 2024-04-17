const journalPaperService = require('../services/journal-paper.service');


module.exports.renderJournalPaper = async (req, res, next) => {

    const journalList = await journalPaperService.renderJournalPaper();

    // console.log('journalList in controller ====>>>>', journalList);
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

    console.log("journalPaperData ===>" , journalPaperData);

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
        errorCode : journalPaperData.errorCode ? journalPaperData.errorCode : null
    })
};


module.exports.delJournalPaper = async (req, res, next) => {
    const journalPaperId = req.body.journalPaperId;
    console.log('controller journalPaperId', journalPaperId) 
    const delJournalData = await journalPaperService.deleteJournalPaper(journalPaperId);
    if( delJournalData.status ===  'done'){
        res.status(200).send({
            status : 'Done' ,
            massage : delJournalData.massage
        });
    }
    else{
        res.status(500).send({
            status : 'failed' ,
            massage : delJournalData.massage
        })

    };
};
 

module.exports.updateJournalPaper = async (req, res, next) => {
    const updateJournalDetails = req.body;
    const journalPaperId = req.body.journalPaperId;
    console.log('journalPaperId for updation in controller', journalPaperId)
    console.log('updateJournalDetails ==>>' , updateJournalDetails);
    const updatePaper = await journalPaperService.updateJournalPaper({journalPaperId, updateJournalDetails});
    console.log('id for updation in controller', updatePaper);
    res.status(200).send({
        status : 'Done',
        message : "Record Updated Successfully",
        journalPaperId : journalPaperId,
        updateJournalDetails : updateJournalDetails
    })
};

module.exports.viewJournalPaper = async(req, res, next) => {
    const journalPaperId = req.body.journalPaperId;
    console.log('journalPaperId for View' , journalPaperId);
    console.log('viewDataDetails ==>', req.body);
    const viewJournalDetails = await journalPaperService.viewJournalPaper({journalPaperId});
    console.log(' view data=>>', viewJournalDetails)
    if(viewJournalDetails){
        res.status(200).send(viewJournalDetails)
    }
    else{
        res.status(500).send({
            status : 'failed',
            massage : viewJournalDetails.masssage   
        })
    }   
}