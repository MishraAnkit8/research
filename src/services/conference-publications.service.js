const conferencePublicationModels = require('../models/conference-publications.modles');


module.exports.fetchConferencePublication = async() => {
    const conferencePublicationData = await conferencePublicationModels.fetchConferencePublication();
    console.log('feched data in service  ==>' , conferencePublicationData.rows);
    return conferencePublicationData.rows;
};

module.exports.viewConferencePublication = async(conferenceId) => {
    console.log('ID For View : ==>>' , conferenceId);
    const conferenceDetails = await conferencePublicationModels.viewConferenceData(conferenceId);
    console.log('Data in  service  ==>>', conferenceDetails.rows);
    if(conferenceDetails.rowCount === 1){
        return conferenceDetails.rows;
    }
    else{
        return {
            status : 'failed',
            massage : 'Error in View '
        }
    }
};

module.exports.insertConferencePublicationData = async(body) => {
    const {conferencePublications} = body;
    console.log('Data For insert ', body);
    const conferenceData = await conferencePublicationModels.insertConferencePublication({conferencePublications});
    return  conferenceData;
}

module.exports.deleteConferencePublication = async(conferenceId) => {
    const conferencePubForDelete = await conferencePublicationModels.DeleteConference({conferenceId});
    console.log('for  id for delet ==>>', conferenceId );
    if(conferencePubForDelete.rowCount === 1){
        return {
            status : 'done',
            massage : 'daat deleted successfully'
        }
    }
    else{
        return{
            status : 'failed',
            massage : 'error in deleting'
        }
    }
};

module.exports.updatedConference = async({conferenceId , upadtedConference}) => {
    const upadtedConferencePublication = await conferencePublicationModels.updateConferencePublication({conferenceId, upadtedConference});
    console.log('ID In Service ::', conferenceId);
    console.log('Data In Service ==>>', upadtedConferencePublication.rows);
    if(upadtedConferencePublication.rowCount === 1){
        return {
            status : 'done',
            massage : "Data Updated SuccessFully"
        }
    }
    else{
        return {
            status : 'Failed',
            massage : 'Unable to update Data'
        }
    }
};