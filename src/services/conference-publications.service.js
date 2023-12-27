const conferencePublicationModels = require('../models/conference-publications.modles');


module.exports.fetchConferencePublication = async() => {
    const conferencePublicationData = await conferencePublicationModels.fetchConferencePublication();
    console.log('feched data in service  ==>' , conferencePublicationData.rows);
    return conferencePublicationData.rows;
};

module.exports.insertConferenceData = async(body , files) => {
    console.log('data in service' , body);
    const conferencePublications = body;
    console.log('files in service ==>' , files);
    const conferenceDocument = files.conferenceDocument[0].filename;
    const conferenceProof = files.conferenceProof[0].filename
    console.log('conferenceDocument:' , conferenceDocument);
    console.log('conferenceProof:' , conferenceProof);
    const insertConferencePublication = await conferencePublicationModels.insertConferencePublication(conferencePublications, conferenceDocument, conferenceProof);
    if(insertConferencePublication && insertConferencePublication.rows[0].id){
        return insertConferencePublication
    }
    
}

module.exports.deleteConferencePublicationData = async(body) => {
    const conferenceId = body;
    const deleteConferencePublication = await conferencePublicationModels.DeleteConference(conferenceId);
    if(deleteConferencePublication && deleteConferencePublication.rowCount === 1){
        return {
            status : 'done',
            massage : 'data deleted successfully'
        }
    }
    else{
        return {
            status : 'failed ',
            massage : 'failed to delete the data'
        }
    }
}

module.exports.updatedConferencePublication = async (body, conferenceProof, conferenceDocument) => {
    console.log('data in service' , body);
    const upadtedConferenceData = body
    const conferenceId =  body.conferenceId;
    const updateConferencePublicationData = await conferencePublicationModels.updateConferencePublication(upadtedConferenceData, conferenceId, conferenceProof, conferenceDocument);
    if(updateConferencePublicationData && updateConferencePublicationData.rowCount === 1){
        console.log('updateConferencePublicationData in service ==>>', updateConferencePublicationData);
        return {
            status : 'done',
            massage : 'data updated successfully'
        }
    }
    else{
        return {
            status : 'failed',
            massage : 'failed to update'
        }
    }
     
}

module.exports.viewConferencePublication = async(conferenceId) => {
    const viewConferenceData  = await conferencePublicationModels.viewConferencePublication(conferenceId);
    if(viewConferenceData && viewConferenceData.rowCount === 1){
        return viewConferenceData
    }
}