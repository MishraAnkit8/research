const { use } = require('../routes/dashboard.route');
const brandingAndAdvertisingServices = require('../services/branding-advertising.service');

module.exports.renderBrandingAndAdvertising = async(req, res, next) => {
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    const brandingAndAdvertising = await brandingAndAdvertisingServices.fetchBrandingandAdvertisingData(userName);
    if(brandingAndAdvertising){
        res.render('branding-advertising' , {
            advertisingData : brandingAndAdvertising.rows,
            rowCount : brandingAndAdvertising.rowCount,
            userName : userName
        })
    }
}

module.exports.insertBrandingAndAdvertising = async(req, res, next) => {
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    const advertisingData = req.body;
    console.log('data comming from frontend ==>>', advertisingData);
    console.log('files in controller  ==>>', res.files);
    const brandingAndAdvertising = await brandingAndAdvertisingServices.insertBrandingAdvertising(req.body, req.files, userName);
    

    console.log('brandingAndAdvertising in controller ==>>', brandingAndAdvertising);
    const statusCode = brandingAndAdvertising.status === "Done" ? 200 : (brandingAndAdvertising.errorCode ? 400  : 500);
    res.status(statusCode).send({
        status : brandingAndAdvertising.status,
        message : brandingAndAdvertising.message,
        advertisingData : brandingAndAdvertising.advertisingData,
        facultyRecognitionDocuments : brandingAndAdvertising.facultyRecognitionDocuments,
        facultyAwardDocuments : brandingAndAdvertising.facultyAwardDocuments,
        staffAwardDocuments : brandingAndAdvertising.staffAwardDocuments,
        alumniAwardDocuments : brandingAndAdvertising.alumniAwardDocuments,
        studentAwardDocuments : brandingAndAdvertising.studentAwardDocuments,
        internationalLinkageDocuments : brandingAndAdvertising.internationalLinkageDocuments,
        conferenceParticipationDocuments : brandingAndAdvertising.conferenceParticipationDocuments,
        organisingConferenceDocuments : brandingAndAdvertising.organisingConferenceDocuments,
        studentEventParticipationDocuments : brandingAndAdvertising.studentEventParticipationDocuments,
        newspaperArticleDocuments : brandingAndAdvertising.newspaperArticleDocuments,
        rowCount : brandingAndAdvertising.rowCount,
        advertisingId : brandingAndAdvertising.advertisingId,
        errorCode : brandingAndAdvertising.errorCode ? brandingAndAdvertising.errorCode : null
    })
    // const advertisingId = brandingAndAdvertising.advertisingId;
    // const facultyRecognitionDocuments = brandingAndAdvertising.facultyRecognitionDocuments;
    // const facultyAwardDocuments = brandingAndAdvertising.brandingFilesContainer.facultyAwardDocuments;
    // const staffAwardDocuments = brandingAndAdvertising.brandingFilesContainer.staffAwardDocuments;
    // const alumniAwardDocuments = brandingAndAdvertising.brandingFilesContainer.alumniAwardDocuments;
    // const studentAwardDocuments = brandingAndAdvertising.brandingFilesContainer.studentAwardDocuments;
    // const internationalLinkageDocuments = brandingAndAdvertising.brandingFilesContainer.internationalLinkageDocuments;
    // const conferenceParticipationDocuments = brandingAndAdvertising.brandingFilesContainer.conferenceParticipationDocuments;
    // const organisingConferenceDocuments = brandingAndAdvertising.brandingFilesContainer.organisingConferenceDocuments;
    // const studentEventParticipationDocuments = brandingAndAdvertising.brandingFilesContainer.studentEventParticipationDocuments;
    // const newspaperArticleDocuments = brandingAndAdvertising.brandingFilesContainer.newspaperArticleDocuments;
    // if(brandingAndAdvertising){
    //     res.status(200).send({
    //         status : "done" ,
    //         advertisingData : advertisingData,
    //         advertisingId,
    //         facultyRecognitionDocuments,
    //         facultyAwardDocuments,
    //         staffAwardDocuments,
    //         alumniAwardDocuments,
    //         studentAwardDocuments,
    //         internationalLinkageDocuments,
    //         conferenceParticipationDocuments,
    //         organisingConferenceDocuments,
    //         studentEventParticipationDocuments,
    //         newspaperArticleDocuments
    //     })
    // }
}

module.exports.updateBrandingAdvertising = async(req, res, next) => {
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    const updatedAdvertisingData = req.body;
    const advertisingId = req.body.advertisingId;
    console.log('files in controller ===>>', req.files)
    console.log('updated advertising data ==>>', updatedAdvertisingData);

    const updatedAdvertising = await brandingAndAdvertisingServices.updateBrandingAndAdvertising(advertisingId, updatedAdvertisingData, req.files, userName);

    console.log('updatedAdvertising in controller for update ===>>>:::', updatedAdvertising);
    const statusCode = updatedAdvertising.status === "Done" ? 200 : (updatedAdvertising.errorCode ? 400 : 500);
    res.status(statusCode).send({
        status : updatedAdvertising.status,
        message : updatedAdvertising.message,
        rowCount : updatedAdvertising.rowCount,
        updatedAdvertisingData : updatedAdvertising.updatedAdvertisingData,
        facultyRecognitionDocuments : updatedAdvertising.updatedFacultyRecognitionFilesArray,
        facultyAwardDocuments : updatedAdvertising.updatedFacultyAwardFilesArray,
        staffAwardDocuments : updatedAdvertising.updatedStaffAwardFilesArray,
        alumniAwardDocuments : updatedAdvertising.updatedAlumniAwardFilesArray,
        studentAwardDocuments : updatedAdvertising.updatedStudentAwardFilesArray,
        internationalLinkageDocuments : updatedAdvertising.updatedInternationalLinkageFilesArray,
        conferenceParticipationDocuments : updatedAdvertising.updatedConferenceParticipationFilesArray,
        organisingConferenceDocuments : updatedAdvertising.updatedOrganisingConferenceFilesArray,
        studentEventParticipationDocuments : updatedAdvertising.updatedStudentEventParticipationFilesArray,
        newspaperArticleDocuments : updatedAdvertising.updatedNewspaperArticleFilesArray,
        errorCode :  updatedAdvertising.errorCode
    });

    // const facultyRecognitionDocuments = updatedAdvertising.updatedBrandingFilesData.facultyRecognitionDocuments;
    // const facultyAwardDocuments = updatedAdvertising.updatedBrandingFilesData.facultyAwardDocuments;
    // const staffAwardDocuments = updatedAdvertising.updatedBrandingFilesData.staffAwardDocuments;
    // const alumniAwardDocuments = updatedAdvertising.updatedBrandingFilesData.alumniAwardDocuments;
    // const studentAwardDocuments = updatedAdvertising.updatedBrandingFilesData.studentAwardDocuments;
    // const internationalLinkageDocuments = updatedAdvertising.updatedBrandingFilesData.internationalLinkageDocuments;
    // const conferenceParticipationDocuments = updatedAdvertising.updatedBrandingFilesData.conferenceParticipationDocuments;
    // const organisingConferenceDocuments = updatedAdvertising.updatedBrandingFilesData.organisingConferenceDocuments;
    // const studentEventParticipationDocuments = updatedAdvertising.updatedBrandingFilesData.studentEventParticipationDocuments;
    // const newspaperArticleDocuments = updatedAdvertising.updatedBrandingFilesData.newspaperArticleDocuments;
    // // if(updatedAdvertising.status === 'done'){
    // //     res.status(200).send({
    // //         status : 'done',
    // //         massage : 'data updated suceesfully',
    // //         updatedAdvertisingData : updatedAdvertisingData,
    // //         facultyRecognitionDocuments,
    // //         facultyAwardDocuments,
    // //         staffAwardDocuments,
    // //         alumniAwardDocuments,
    // //         studentAwardDocuments,
    // //         internationalLinkageDocuments,
    // //         conferenceParticipationDocuments,
    // //         organisingConferenceDocuments,
    // //         studentEventParticipationDocuments,
    // //         newspaperArticleDocuments
    // //     })
    // // }
    
}

module.exports.viewBrandingadvertising = async(req, res, next) => {
    const  userName = req.body.username;
    console.log('userName in controller  ===>>>>>>', userName);

    console.log('id ==>>', req.body)
    const {advertisingId} = req.body;
    const brandingAndAdvertisingview = await brandingAndAdvertisingServices.viewBrandingadvertising(advertisingId, userName);
    console.log('brandingAndAdvertisingview' , brandingAndAdvertisingview[0]);

    if(brandingAndAdvertisingview) {
        res.status(200).send({
            status : 'done',
            brandingAndAdvertisingData : brandingAndAdvertisingview
        })
    }
}

module.exports.deleteBrandingAdvertising = async(req, res, next) => {
    console.log('id ==>>', req.body);
    const {advertisingId} = req.body;
    const brandingAndadvertisingDelete = await brandingAndAdvertisingServices.deleteAdvertising(advertisingId);
    if(brandingAndadvertisingDelete.status === 'Done'){
        res.status(200).send({
            status : 'Done',
            massage : 'deleted successfully'
        })
    }
}