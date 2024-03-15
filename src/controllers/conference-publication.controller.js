const conferencePublicationServices = require('../services/conference-publications.service');

module.exports.renderConferencePage = async(req, res, next) => {
    const conferenceData = await conferencePublicationServices.fetchConferencePublication();
    console.log('conferenceData ====>>>>>', conferenceData);
    res.render('conference-publication' , {
        status : 'Done',
        conferenceData : conferenceData.conferenceDataList,
        rowCount : conferenceData.rowCount,
        internalEmpList : conferenceData.internalEmpList,
        externalEmpList : conferenceData.externalEmpList,
    })
};



module.exports.insertConferencePublicationSData = async (req, res, next) => {
    console.log('Data comming From Template', req.body);
    console.log('files in controller ==>>>', req.files)
    const insertConferenceDataForm = await conferencePublicationServices.insertConferenceData(req.body, req.files);
    console.log('insertConferenceDataForm in controller ===>>>>', insertConferenceDataForm);
    const statusCode = insertConferenceDataForm.status === "Done" ? 200 : (insertConferenceDataForm.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : insertConferenceDataForm.status,
        message : insertConferenceDataForm.message,
        conferenceId : insertConferenceDataForm.status === "Done" ? insertConferenceDataForm.conferenceId : null,
        externalEmpId : insertConferenceDataForm.status === "Done" ? (insertConferenceDataForm.externalEmpId ? insertConferenceDataForm.externalEmpId : null) : null,
        conferenceDocument : insertConferenceDataForm.status === "Done" ?  insertConferenceDataForm.conferenceDocument : null,
        conferenceProofFile : insertConferenceDataForm.status === "Done" ? insertConferenceDataForm.conferenceProofFile : null,
        rowCount :  insertConferenceDataForm.status === "Done" ? insertConferenceDataForm.rowCount : null,
        conferenceData : insertConferenceDataForm.status === "Done" ? insertConferenceDataForm.conferencePublications : null,
        authorNameString : insertConferenceDataForm.status === "Done" ? insertConferenceDataForm.authorNameString : null, 
        internalNamesString : insertConferenceDataForm.status === "Done" ? insertConferenceDataForm.internalNamesString : null,
        externalNamesString : insertConferenceDataForm.status === "Done" ? insertConferenceDataForm.externalNamesString : null,
        errorCode : insertConferenceDataForm.errorCode ? insertConferenceDataForm.errorCode : null
    })
}

module.exports.deleteConferencePublication = async(req, res, next) => {
    const conferenceId = req.body;
    console.log('conferenceId in controller' , conferenceId);
    const deleteConferenceRequest = await conferencePublicationServices.deleteConferencePublicationData(conferenceId);
    const statusCode = deleteConferenceRequest.status === "Done" ? 200 : (deleteConferenceRequest.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : deleteConferenceRequest.status,
        message : deleteConferenceRequest.message,
        errorCode : deleteConferenceRequest.errorCode ? deleteConferenceRequest.errorCode : null
    })
}

module.exports.updateConferencePublication = async(req, res, next) => {
    const conferenceId = req.body.id;
    console.log('id for updation', conferenceId)
    console.log('files in side controller ==>>', req.files);
    console.log('data in controller for updation ==>>', req.body);
    const upadtedConferenceData = req.body;
    const updatedConference = await conferencePublicationServices.updatedConferencePublication(req.body, req.files);
    console.log('updatedConference in controller ===>>>', updatedConference)
    const statusCode = updatedConference.status === "Done" ? 200 :(updatedConference.errorCode ? 400 : 500)
    res.status(statusCode).send({
        status : updatedConference.status,
        message : updatedConference.message,
        confernceDocString : updatedConference.status === "Done" ? updatedConference.confernceDocString : null,
        conferenceProofString : updatedConference.status === "Done" ? updatedConference.conferenceProofString : null,
        internalNamesString : updatedConference.status === "Done" ? updatedConference.internalNamesString : null,
        externalNamesString : updatedConference.status === "Done" ? updatedConference.externalNamesString : null,
        existingNameString : updatedConference.status === "Done" ? updatedConference.existingNameString : null,
        authorNameString : updatedConference.status === "Done" ? updatedConference.authorNameString : null,
        upadtedConferenceData : updatedConference.status === "Done" ? updatedConference.upadtedConferenceData : null,
        errorCode : updatedConference.errorCode ? updatedConference.errorCode : null
    })
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
