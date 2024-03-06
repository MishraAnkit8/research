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
    const successCondition = journalPaperData.success;
    console.log('successMassage ====>>>>>', successCondition)
    if(successCondition === false){
        const errorMassage = journalPaperData.error;
        res.status(500).send({
            status : 'Failed',
            errorMassage : errorMassage
        })
    }
    
   
    // if(journalPaperData.success === "false"){
    //     console.log('yes condtion is failed')
    // }
    // if(journalPaperData && journalPaperData.rows[0].id) {
    //     const rowCount = journalPaperData.rowCount;
    //     console.log('rowCount ===>>>', rowCount);
    //     res.status(200).send({
    //         status : 'done',
    //         journalPaperId : journalPaperData.rows[0].id,
    //         rowCount
    //     });
    // }
    // else if(journalPaperData.success === "false"){
    //         res.status(500).send({
    //             status : 'False',
    //             errorMsg : journalPaperData.error
    //         })
    //     }

//     const errorMsg = journalPaperData.error;
//     console.log('errorMsg ====>>>>', errorMsg)
//     if(journalPaperData.success === "false"){
//         res.status(500).send({
//             status : 'False',
//             errorMsg : errorMsg
//         })
//     }
//     else{
//         const rowCount = journalPaperData.rowCount;
//         console.log('rowCount ===>>>', rowCount);
//   }
 

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
    console.log('id for updation', updatePaper);
    if(updatePaper.status === 'done'){
        res.status(200).send({
            status : 'done',
            massage : updatePaper.massage
        });
    }
    else{
        res.status(500).send({
            status  : 'failed',
            massage : updatePaper.massage
        });
    };
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