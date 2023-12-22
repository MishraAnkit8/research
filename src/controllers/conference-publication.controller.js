const conferencePublicationServices = require('../services/conference-publications.service');
const clientScript = require('../../public/js/client');
const path = require('path');

module.exports.renderConferencePage = async(req, res, next) => {
    const fileuploadStatus = req.app.locals.fileuploadStatus;
    console.log('fileuploadStatus===>',req.app.locals.fileuploadStatus );
    const docuploadStatus = req.app.locals.docuploadStatus;
    const htmlVal = res.app.locals.htmlVal;
    const errorMsg = res.app.locals.errorMsg;
    req.app.locals.fileuploadStatus = false;
    req.app.locals.docuploadStatus = false;
    res.app.locals.htmlVal = '';
    clientScript.includeHtml(htmlVal);
    const conferenceData = await conferencePublicationServices.fetchConferencePublication()
    res.render('conference-publication' , {
        status : 'done',
        conferenceData : conferenceData,
        utils: clientScript,
        fileuploadStatus: fileuploadStatus,
        docuploadStatus: docuploadStatus,
        errorMsg: errorMsg,
        htmlVal: htmlVal,
    })
};



module.exports.insertConferencePublicationSData = async (req, res, next) => {
     const conferencePublications = req.body;
     console.log('Data comming From Template', req.body);
     const { conferenceDocument, conferenceProof } = req.files;
     console.log('Conference Document:', conferenceDocument[0].filename);
     console.log('Conference Proof:', conferenceProof[0].filename);
     const insertConferenceDataForm = await conferencePublicationServices.insertConferenceData(req.body, req.files);
     if(insertConferenceDataForm){
        res.status(200).send({
            status : 'done',
            conferenceData : conferencePublications,
            conferenceId : insertConferenceDataForm.rows[0].id,
            ConferenceDocument : conferenceDocument[0].filename,
            ConferenceProof : conferenceProof[0].filename
        })
     }
  
}

