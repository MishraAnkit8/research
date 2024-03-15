const brandingAndAdvertisingModels = require('../models/branding-advertising.model');



module.exports.fetchBrandingandAdvertisingData = async() => {
    const brandingAndAdvertising = await brandingAndAdvertisingModels.fetchBrandingAndadvertising();
    console.log('brandingAndAdvertising ==>>', brandingAndAdvertising.rows)
    return brandingAndAdvertising;
}

module.exports.insertBrandingAdvertising = async(body , files) => {
    const advertisingData = body;
    let brandingFilesContainer = {};
    if(files){
      const facultyRecognitionFilesArray = files.facultyRecognitionDocuments;
      const facultyAwardFilesArray = files.facultyAwardDocuments;
      const staffAwardFilesArray = files.staffAwardDocuments;
      const alumniAwardFilesArray = files.alumniAwardDocuments;
      const studentAwardFilesArray = files.studentAwardDocuments; 
      const internationalLinkageFilesArray = files.internationalLinkageDocuments;
      const conferenceParticipationFilesArray = files.conferenceParticipationDocuments;
      const organisingConferenceFilesArray = files.organisingConferenceDocuments;
      const studentEventParticipationFilesArray = files.studentEventParticipationDocuments;
      const newspaperArticleFilesArray = files.newspaperArticleDocuments;

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
      const keyNameArray = [
          'facultyRecognitionDocuments',
          'facultyAwardDocuments',
          'staffAwardDocuments',
          'alumniAwardDocuments',
          'studentAwardDocuments',
          'internationalLinkageDocuments',
          'conferenceParticipationDocuments',
          'organisingConferenceDocuments',
          'studentEventParticipationDocuments',
          'newspaperArticleDocuments'
      ];
      console.log('keyNameArray ===>>',keyNameArray);

      const filesValues = [];
      for(let i = 0; i <= filesArrayContainer.length - 1; i++){
          var fileStringName = '';
          for(let j = 0; j <= filesArrayContainer[i].length - 1; j++){
            if(filesArrayContainer[i][j].filename){
              fileStringName += filesArrayContainer[i][j].filename + ',';
            }
          }
          filesValues.push(fileStringName);
      }

      console.log('filesValues ====>>>', filesValues);
    // for appending key and files name as key value pair in object
        for(let k = 0; k <= filesValues.length - 1; k++){
          const keyName = keyNameArray[k];
          const stringValue = filesValues[k];
          if(stringValue){
            brandingFilesContainer[keyName] = stringValue;
          }
        }

    };
    console.log('brandingFilesContainer ===>>>', brandingFilesContainer);

    const brandingAndAdvertising = await brandingAndAdvertisingModels.insertBrandingAndAdvertisingData(advertisingData, brandingFilesContainer);

    console.log('brandingAndAdvertising id ==>>', brandingAndAdvertising.rows[0].id);
    const advertisingId = brandingAndAdvertising.rows[0].id;
    if(brandingAndAdvertising && brandingAndAdvertising.rows[0].id){
        return {
          advertisingId,
          brandingFilesContainer
        }
    } 
}

module.exports.updateBrandingAndAdvertising = async (advertisingId, updatedAdvertisingData, files) => {
    console.log('filesToUpdate in service ==>>', files);
    console.log('updatedAdvertisingData ==>>', updatedAdvertisingData);
    // let updatedBrandingFilesData = {};
    // if(Object.keys(files).length > 0){
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

      // // files array container
      // const updatedFilesArrayContainer = [
      //       updatedFacultyRecognitionFilesArray,
      //       updatedFacultyAwardFilesArray,
      //       updatedStaffAwardFilesArray,
      //       updatedAlumniAwardFilesArray,
      //       updatedStudentAwardFilesArray,
      //       updatedInternationalLinkageFilesArray,
      //       updatedConferenceParticipationFilesArray,
      //       updatedOrganisingConferenceFilesArray,
      //       updatedStudentEventParticipationFilesArray,
      //       updatedNewspaperArticleFilesArray
      // ];
      // console.log('updatedFilesArrayContainer ===>>>', updatedFilesArrayContainer);
      // console.log(' updatedfilesArrayContainer service ===>>', updatedFilesArrayContainer);
    //   const keyNameArray = [
    //       'facultyRecognitionDocuments',
    //       'facultyAwardDocuments',
    //       'staffAwardDocuments',
    //       'alumniAwardDocuments',
    //       'studentAwardDocuments',
    //       'internationalLinkageDocuments',
    //       'conferenceParticipationDocuments',
    //       'organisingConferenceDocuments',
    //       'studentEventParticipationDocuments',
    //       'newspaperArticleDocuments'
    //   ];

    //   const advertisingFilesStringContainer = [];
    //   // now push the string value into filesStringContainer array
    //   for(let i = 0; i <= updatedFilesArrayContainer.length - 1; i++){
    //         var filesString = '';
    //         if (updatedFilesArrayContainer[i]) {
    //           for (j = 0; j <= updatedFilesArrayContainer[i].length - 1; j++) {
    //             if (updatedFilesArrayContainer[i][j].filename) {
    //               filesString +=
    //                 updatedFilesArrayContainer[i][j].filename + ",";
    //             }
    //           }
    //         }
    //         advertisingFilesStringContainer.push(filesString);
    //   }
    //   console.log('advertisingFilesStringContainer ===>>>', advertisingFilesStringContainer);
    //   // appending key and value into object container
    //   for(k = 0; k <= advertisingFilesStringContainer.length - 1; k++){
    //       const keyName = keyNameArray[k];
    //       const valueString = advertisingFilesStringContainer[k];
    //       if(valueString){
    //         updatedBrandingFilesData[keyName] = valueString;
    //       }
    //   }
      
    // }
    // console.log('updatedBrandingFilesData ===>>>', updatedBrandingFilesData)
    
			

  const updatedBrandingAndAdvertising = await brandingAndAdvertisingModels.updateBrandingAdvertising(advertisingId, updatedAdvertisingData, updatedFacultyRecognitionFilesArray,
      updatedFacultyAwardFilesArray, updatedStaffAwardFilesArray, updatedAlumniAwardFilesArray, updatedStudentAwardFilesArray,
      updatedInternationalLinkageFilesArray, updatedConferenceParticipationFilesArray, updatedOrganisingConferenceFilesArray,
      updatedStudentEventParticipationFilesArray, updatedNewspaperArticleFilesArray);

  console.log('updatedBrandingAndAdvertising in service ===>>>', updatedBrandingAndAdvertising);
  return updatedBrandingAndAdvertising.status === "Done" ? {
          status : updatedBrandingAndAdvertising.status,
          message : updatedBrandingAndAdvertising.message,
          rowCount : updatedBrandingAndAdvertising.rowCount,
          updatedAdvertisingData : updatedAdvertisingData,
          updatedFacultyRecognitionFilesArray,
          updatedFacultyAwardFilesArray,
          updatedStaffAwardFilesArray,
          updatedAlumniAwardFilesArray,
          updatedStudentAwardFilesArray,
          updatedInternationalLinkageFilesArray,
          updatedConferenceParticipationFilesArray,
          updatedOrganisingConferenceFilesArray,
          updatedStudentEventParticipationFilesArray,
          updatedNewspaperArticleFilesArray
   } : {
      status : updatedBrandingAndAdvertising.status,
      message : updatedBrandingAndAdvertising.message,
      errorCode :  updatedBrandingAndAdvertising.errorCode
   }
};


module.exports.viewBrandingadvertising = async(advertisingId) => {
    const viewAdvertisingData = await brandingAndAdvertisingModels.brandingAndadvertisingview(advertisingId);
    console.log('data in service ==>>', viewAdvertisingData.rows)
    return viewAdvertisingData.rows
}

module.exports.deleteAdvertising = async(advertisingId) => {
    const deleteBrandingAdvertising = await brandingAndAdvertisingModels.brandingAndadvertisingDelete(advertisingId);
    if(deleteBrandingAdvertising && deleteBrandingAdvertising.rowCount === 1){
        return{
            status : 'done',
            massage : 'deleted successfully'
        }
    }
}