const conferencePublicationServices = require('../services/conference-publications.service');
const clientScript = require('../../public/js/client');
const path = require('path');
const upload = require('../../multer');

module.exports.renderConferencePage = async(req, res, next) => {
    const conferenceData = await conferencePublicationServices.fetchConferencePublication()
    res.render('conference-publication' , {
        status : 'done',
        conferenceData : conferenceData.rows,
        rowCount : conferenceData.rowCount,
    })
};



module.exports.insertConferencePublicationSData = async (req, res, next) => {
     const conferencePublications = req.body;
     console.log('Data comming From Template', req.body);
     console.log('files in controller ==>>>', req.files)
     const insertConferenceDataForm = await conferencePublicationServices.insertConferenceData(req.body, req.files);
    const conferenceDocumentData = insertConferenceDataForm.insertConferenceDataForm;
    const conferenceProofData = insertConferenceDataForm.conferenceProofData;
    const conferenceId = insertConferenceDataForm.conferenceId;
    console.log('conferenceId ==>>>', conferenceId)
     if(insertConferenceDataForm){
        res.status(200).send({
            status : 'done',
            conferenceData : conferencePublications,
            conferenceId ,
            conferenceDocumentData,
            conferenceProofData
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
    console.log('files in side controller ==>>', req.files);
    console.log('data in controller for updation ==>>', req.body);
    const upadtedConferenceData = req.body;
    // console.log('fielses in controller :', req.files);
    // const {conferenceProof , conferenceDocument} = req.files;
    // const ConferenceFileToBeUpdate = {conferenceProof , conferenceDocument}
    const updatedConference = await conferencePublicationServices.updatedConferencePublication(req.body, req.files);
    console.log('updatedConference in controller ===>>>', updatedConference)
    if(updatedConference){
        res.status(200).send({
            status : updatedConference.status,
            masssage : updatedConference.massage,
            upadtedConferenceData,
            confernceDocString : updatedConference.confernceDocString,
            conferenceProofString : updatedConference.conferenceProofString
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
