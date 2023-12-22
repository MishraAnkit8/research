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

