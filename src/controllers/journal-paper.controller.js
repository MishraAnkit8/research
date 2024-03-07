const journalPaperService = require('../services/journal-paper.service');


module.exports.renderJournalPaper = async (req, res, next) => {
    const journalList = await journalPaperService.renderJournalPaper();
    console.log('journalList ====>>>>', journalList.rows)
    
    res.render('journal-paper', {
        journalData : journalList.rows,
        rowCount : journalList.rowCount
    });
    console.log('journalList in Controller ==>>', journalList.rowCount)
};


module.exports.createJournalPaper = async (req, res, next) => {
    console.log('data in controller', req.body);
    const journalPaperData = await journalPaperService.insertJournalPapper(req.body);
    console.log(" journalPaperData ===>" , journalPaperData);
    if(journalPaperData.status === 'Done'){
        const journalPaperId = journalPaperData.id;
        const journalDetails = req.body;
        console.log('journalDetails ====>>>>>', journalDetails);
        res.status(200).send({
            status : 'Done',
            massage : 'Data Inserted SuccessFully',
            journalDetails : journalDetails,
            journalPaperId : journalPaperId
        })
    }
    else if(journalPaperData.status === 'Failed'){
        if(journalPaperData.error === 'web_link_doi_number already exists'){
            const errMsg = "WEB Link DOI Number should Be Uniq";
            res.status(502).send({
                status : 'Failed',
                massage : errMsg
            })
        }
        else{
            res.status(500).send({
                status : 'Failed',
                massage : journalPaperData.error
            })
        }
    }
};


module.exports.delJournalPaper = async (req, res, next) => {
    const journalPaperId = req.body.journalPaperId;
    console.log('controller journalPaperId', journalPaperId) 
    const delJournalData = await journalPaperService.deleteJournalPaper(journalPaperId);
    if( delJournalData.status ===  'done'){
        res.status(200).send({
            status : 'done' ,
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
    if(updatePaper.status === 'Done'){
        res.status(200).send({
            status : 'Done',
            massage : updatePaper.massage
        });
    }
    else if(updatePaper.status === 'Failed'){
        if(updatePaper.error === 'duplicate key value violates unique constraint "journal_papers_web_link_doi_number_key"'){
            console.log('updatePaper.error =====>>>>>', updatePaper.error)
            const errMsg = "WEB Link DOI Number should Be Uniq";
            res.status(502).send({
                status : 'Failed',
                massage : errMsg
            })
        }
        else{
            res.status(500).send({
                status : 'Failed',
                massage : updatePaper.error
            })
        }
    }
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