const journalPaperModel = require('../models/journal-paper.models');
// service for fetch
module.exports.renderJournalPaper = async () => {
    let result = await journalPaperModel.fetchJournalPaper(); 
    return result.rows  
};

// service for insert
module.exports.insertJournalPapper = async (body) => {
    const {journalDetails} =  body;
    const newJournalPaper = await journalPaperModel.createJournalPaper(journalDetails);
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
    const updateJournalData = await journalPaperModel.updateJournalPaperData({journalPaperId, updateJournalDetails});
    console.log('id for  updation in service', journalPaperId);
    console.log('data is service ==>>>', updateJournalData.rows);
    if(updateJournalData.rowCount == 1){
        return {
            status : 'done' ,
            massage : 'data updated successfully'
        };
    }
    else{
        return {
            status : 'failed' ,
            massage : 'data is not updating'
        }
    };
}

// service for view
module.exports.viewJournalPaper = async ({journalPaperId}) => {
    const viewJournalPaperData = await journalPaperModel.viewJournalPaperData({journalPaperId});
    if(viewJournalPaperData.rowCount === 1){
        return  viewJournalPaperData.rows;
    } 
    else{
        return {
            status : 'failed',
            masssage : 'error to fetching'
        }
    }
}