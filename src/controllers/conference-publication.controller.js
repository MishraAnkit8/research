const conferencePublicationServices = require('../services/conference-publications.service');

module.exports.renderConferencePage = async(req, res, next) => {
    const conferenceData = await conferencePublicationServices.fetchConferencePublication()
    res.render('conference-publication' , {
        conferenceData : conferenceData
    })
};

module.exports.viewconferencePublication = async(req, res, next) => {
    const conferenceId = req.body.conferenceId
    const conferencePublicationDetails = await conferencePublicationServices.viewConferencePublication(conferenceId);
    if(conferencePublicationDetails){
        res.status(200).send(conferencePublicationDetails)
    }
    else{
        res.status(500).send({
            status : 'Failed',
            massage : 'Failed to view'
        })
    }
}

module.exports.insertConferencePublicationSData = async (req, res, next) => {
     const conferencePublications = req.body;
     console.log('Data comming From Template', conferencePublications);
     const conferenceData = await conferencePublicationServices.insertConferencePublicationData(req.body);
     console.log('ID ===>>>>',conferenceData.rows[0].id )
     if(conferenceData && conferenceData.rows[0].id){
        res.status(200).send({
            status : 'done',
            conferenceId : conferenceData.rows[0].id
        })
     }
     else{
        res.status(200).send('Fialed To insert Data');
     }

}

module.exports.deleteConference = async(req, res, next) =>{
    const conferenceId = req.body.conferenceId;
    const delConferenceData = await conferencePublicationServices.deleteConferencePublication(conferenceId);
    if(delConferenceData.status === 'done'){
        res.status(200).send({
            status : 'done',
            massage : 'data deleted successfully'
        })
    }
    else {
        res.status(500).send({
            status : delConferenceData.status,
            massage : delConferenceData.massage
        })
    }
   
}

module.exports.updateConference = async(req, res, next) => {
    const conferenceId = req.body.conferenceId;
    const upadtedConference = req.body;
    console.log('updatedConference In Controller ==>', req.body); 
    const updatedConferenceData = await conferencePublicationServices.updatedConference({conferenceId , upadtedConference });
    if(updatedConferenceData){
        res.status(200).send({
            status : 'done',
            massage : 'Data Updated SuccessFully'
        })
    }
    else{
        res.status(500).send({
            status : 'failed',
            massage : 'Unable To update'
        })
    }


}