const brandingAndAdvertisingServices = require('../services/branding-advertising.service');

module.exports.renderBrandingAndAdvertising = async(req, res, next) => {
    const brandingAndAdvertising = await brandingAndAdvertisingServices.fetchBrandingandAdvertisingData();
    if(brandingAndAdvertising){
        res.render('branding-advertising' , {
            advertisingData : brandingAndAdvertising
        })
    }
}

module.exports.insertBrandingAndAdvertising = async(req, res, next) => {
    const advertisingData = req.body;
    console.log('data comming from frontend ==>>', advertisingData);
    console.log('files ==>>', res.files);
    const {facultyRecognitionDocuments, facultyAwardDocuments, staffAwardDocuments, alumniAwardDocuments, studentAwardDocuments, internationalLinkageDocuments, conferenceParticipationDocuments, organisingConferenceDocuments,
            studentEventParticipationDocuments, newspaperArticleDocuments} = req.files
    const brandingAndAdvertising = await brandingAndAdvertisingServices.insertBrandingAdvertising(req.body, req.files);
    console.log('brandingAndAdvertising ==>>', brandingAndAdvertising)
    if(brandingAndAdvertising){
        res.status(200).send({
            status : "done" ,
            advertisingData : advertisingData,
            advertisingId : brandingAndAdvertising,
            facultyRecognitionDocuments,
            facultyAwardDocuments,
            staffAwardDocuments,
            alumniAwardDocuments,
            studentAwardDocuments,
            internationalLinkageDocuments,
            conferenceParticipationDocuments,
            organisingConferenceDocuments,
            studentEventParticipationDocuments,
            newspaperArticleDocuments
        })
    }
}

module.exports.updateBrandingAdvertising = async(req, res, next) => {
    const updatedAdvertisingData = req.body;
    const advertisingId = req.body.advertisingId;
    console.log('data comming from frontend ==>>', updatedAdvertisingData);
    const {facultyRecognitionDocuments, facultyAwardDocuments, staffAwardDocuments, alumniAwardDocuments, studentAwardDocuments, internationalLinkageDocuments, conferenceParticipationDocuments, organisingConferenceDocuments,
            studentEventParticipationDocuments, newspaperArticleDocuments} = req.files
    const updatedAdvertising = await brandingAndAdvertisingServices.updateBrandingAndAdvertising(advertisingId, updatedAdvertisingData , req.files);
    if(updatedAdvertising.status === 'done'){
        res.status(200).send({
            status : 'done',
            massage : 'data updated suceesfully',
            updatedAdvertisingData : updatedAdvertisingData,
            facultyRecognitionDocuments,
            facultyAwardDocuments,
            staffAwardDocuments,
            alumniAwardDocuments,
            studentAwardDocuments,
            internationalLinkageDocuments,
            conferenceParticipationDocuments,
            organisingConferenceDocuments,
            studentEventParticipationDocuments,
            newspaperArticleDocuments


        })
    }
    
}

module.exports.viewBrandingadvertising = async(req, res, next) => {
    console.log('id ==>>', req.body)
    const {advertisingId} = req.body;
    const brandingAndAdvertisingview = await brandingAndAdvertisingServices.viewBrandingadvertising(advertisingId);
    console.log('brandingAndAdvertisingview' , brandingAndAdvertisingview)
    if(brandingAndAdvertisingview) {
        res.status(200).send({
            status : 'done',
            brandingAndAdvertisingview : brandingAndAdvertisingview
        })
    }
}