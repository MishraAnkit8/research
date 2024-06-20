const brandingAndAdvertisingModels = require('../models/branding-advertising.model');



module.exports.fetchBrandingandAdvertisingData = async(userName) => {
    const brandingAndAdvertising = await brandingAndAdvertisingModels.fetchBrandingAndadvertising(userName);
    console.log('brandingAndAdvertising ==>>', brandingAndAdvertising.rows)
    return brandingAndAdvertising;
}

module.exports.insertBrandingAdvertising = async(body , files, userName) => {
    const advertisingData = body;
    const facultyRecognitionFilesArray = files.facultyRecognitionDocuments ?.map(file => file.filename).join(',');
    const facultyAwardFilesArray = files.facultyAwardDocuments ?.map(file => file.filename).join(',');
    const staffAwardFilesArray = files.staffAwardDocuments ?.map(file => file.filename).join(',');
    const alumniAwardFilesArray = files.alumniAwardDocuments ?.map(file => file.filename).join(',');
    const studentAwardFilesArray = files.studentAwardDocuments ?.map(file => file.filename).join(','); 
    const internationalLinkageFilesArray = files.internationalLinkageDocuments ?.map(file => file.filename).join(',');
    const conferenceParticipationFilesArray = files.conferenceParticipationDocuments ?.map(file => file.filename).join(',');
    const organisingConferenceFilesArray = files.organisingConferenceDocuments ?.map(file => file.filename).join(',');
    const studentEventParticipationFilesArray = files.studentEventParticipationDocuments ?.map(file => file.filename).join(',');
    const newspaperArticleFilesArray = files.newspaperArticleDocuments ?.map(file => file.filename).join(',');

    // files array container
    const filesArrayContainer = [
            facultyRecognitionFilesArray,
            facultyAwardFilesArray,
            staffAwardFilesArray,
            alumniAwardFilesArray,
            studentAwardFilesArray,
            internationalLinkageFilesArray,
            conferenceParticipationFilesArray,
            organisingConferenceFilesArray,
            studentEventParticipationFilesArray,
            newspaperArticleFilesArray
      ];
    console.log('filesArrayContainer service ===>>', filesArrayContainer);
    const brandingFilesContainer = {
      facultyRecognitionDocuments: facultyRecognitionFilesArray,
      facultyAwardDocuments: facultyAwardFilesArray,
      staffAwardDocuments: staffAwardFilesArray,
      alumniAwardDocuments: alumniAwardFilesArray,
      studentAwardDocuments: studentAwardFilesArray,
      internationalLinkageDocuments: internationalLinkageFilesArray,
      conferenceParticipationDocuments: conferenceParticipationFilesArray,
      organisingConferenceDocuments: organisingConferenceFilesArray,
      studentEventParticipationDocuments: studentEventParticipationFilesArray,
      newspaperArticleDocuments: newspaperArticleFilesArray,

    };


    console.log('brandingFilesContainer ===>>>', brandingFilesContainer);
    console.log('advertisingData==>>Service',advertisingData);

    const brandingAndAdvertising = await brandingAndAdvertisingModels.insertBrandingAndAdvertisingData(advertisingData, brandingFilesContainer, userName);
    console.log('brandingAndAdvertising in services ====>>>>>', brandingAndAdvertising);
    return {
      status : brandingAndAdvertising.status,
      message : brandingAndAdvertising.message,
      errorCode : brandingAndAdvertising.errorCode ? brandingAndAdvertising.errorCode : null
    }

}

module.exports.updateBrandingAndAdvertising = async (advertisingId, updatedAdvertisingData, files, userName) => {
    console.log('filesToUpdate in service ==>>', files);
    console.log('updatedAdvertisingData ==>>', updatedAdvertisingData);
    const updatedFacultyRecognitionFilesArray = files.facultyRecognitionDocuments ?.map(file => file.filename).join(',');
    const updatedFacultyAwardFilesArray = files.facultyAwardDocuments ?.map(file => file.filename).join(',');
    const updatedStaffAwardFilesArray = files.staffAwardDocuments ?.map(file => file.filename).join(',');
    const updatedAlumniAwardFilesArray = files.alumniAwardDocuments ?.map(file => file.filename).join(',');
    const updatedStudentAwardFilesArray = files.studentAwardDocuments ?.map(file => file.filename).join(','); 
    const updatedInternationalLinkageFilesArray = files.internationalLinkageDocuments ?.map(file => file.filename).join(',');
    const updatedConferenceParticipationFilesArray = files.conferenceParticipationDocuments ?.map(file => file.filename).join(',');
    const updatedOrganisingConferenceFilesArray = files.organisingConferenceDocuments ?.map(file => file.filename).join(',');
    const updatedStudentEventParticipationFilesArray = files.studentEventParticipationDocuments ?.map(file => file.filename).join(',');
    const updatedNewspaperArticleFilesArray = files.newspaperArticleDocuments ?.map(file => file.filename).join(',');

    
    const updatedBrandingAndAdvertising = await brandingAndAdvertisingModels.updateBrandingAdvertising(advertisingId, updatedAdvertisingData, updatedFacultyRecognitionFilesArray,
      updatedFacultyAwardFilesArray, updatedStaffAwardFilesArray, updatedAlumniAwardFilesArray, updatedStudentAwardFilesArray,
      updatedInternationalLinkageFilesArray, updatedConferenceParticipationFilesArray, updatedOrganisingConferenceFilesArray,
      updatedStudentEventParticipationFilesArray, updatedNewspaperArticleFilesArray, userName);

    console.log('updatedBrandingAndAdvertising in service ===>>>', updatedBrandingAndAdvertising);

    return {
      status : updatedBrandingAndAdvertising.status,
      message : updatedBrandingAndAdvertising.message,
      errorCode : updatedBrandingAndAdvertising.errorCode ? updatedBrandingAndAdvertising.errorCode : null
    }
};


module.exports.viewBrandingadvertising = async(advertisingId, userName) => {
    const viewAdvertisingData = await brandingAndAdvertisingModels.brandingAndadvertisingview(advertisingId, userName);
    console.log('data in service ==>>', viewAdvertisingData.rows)
    return viewAdvertisingData.rows
}

module.exports.deleteAdvertising = async(advertisingId) => {
    const deleteBrandingAdvertising = await brandingAndAdvertisingModels.brandingAndadvertisingDelete(advertisingId);
    if(deleteBrandingAdvertising && deleteBrandingAdvertising.rowCount === 1){
        return{
            status : 'Done',
            massage : 'deleted successfully'
        }
    }
}