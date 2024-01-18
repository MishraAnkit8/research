const conferencePublicationServices = require('../services/conference-publications.service');
const clientScript = require('../../public/js/client');
const path = require('path');

module.exports.renderConferencePage = async(req, res, next) => {
    const fileuploadStatus = req.app.locals.fileuploadStatus;
    console.log('fileuploadStatus===>',req.app.locals.fileuploadStatus);
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
        conferenceData : conferenceData.rows,
        rowCount : conferenceData.rowCount,
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

module.exports.deleteConferencePublication = async(req, res, next) => {
    const conferenceId = req.body;
    console.log('conferenceId in controller' , conferenceId);
    const deleteConferenceRequest = await conferencePublicationServices.deleteConferencePublicationData(conferenceId);
    if(deleteConferenceRequest){
        res.status(200).send({
            status : 'done',
            massage : 'data deleted successfully'
        })
    }
    else{
        res.status(500).send({
            status : 'failed',
            massage : 'failed to delete'
        })
    }
}

module.exports.updateConferencePublication = async(req, res, next) => {
    const conferenceId = req.body.id;
    console.log('id for updation', conferenceId)
    console.log('data in controller for updation ==>>', req.body);
    const upadtedConferenceData = req.body;
    console.log('fi;es in controller :', req.files);
    const {conferenceProof , conferenceDocument} = req.files;
    const updateConference = await conferencePublicationServices.updatedConferencePublication(req.body, conferenceProof, conferenceDocument);
    if(updateConference){
        res.status(200).send({
            status : updateConference.status,
            masssage : updateConference.massage,
            upadtedConferenceData,
            ConferenceDocument : conferenceDocument[0].filename,
            ConferenceProof : conferenceProof[0].filename
        })
    }
    else{
        res.status(500).send({
            status : 'failed',
            massage : 'failed to update data',

        })
    }
   
}

module.exports.viewConferencePublication = async(req, res, next) => {
    console.log('data Id in Controller', req.body);
    const {conferenceId} = req.body
    const viewConferencePublicationData = await conferencePublicationServices.viewConferencePublication(conferenceId);
    if(viewConferencePublicationData){
        res.status(200).send({
            status : 'done',
            viewConferenceData : viewConferencePublicationData.rows
        })
    }
}
