const journalPaperModel = require('../models/journal-paper.models');
// service for fetch
module.exports.renderJournalPaper = async () => {
    let result = await journalPaperModel.fetchJournalPaper();
    return result  
};

// service for insert
module.exports.insertJournalPapper = async (body) => {
    const journalDetails =  body;
    console.log('journalDetails inservice ==>>', journalDetails)
    const newJournalPaper = await journalPaperModel.createJournalPaper(journalDetails);
    console.log('newJournalPaper ==>>', newJournalPaper)
    return newJournalPaper ;
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