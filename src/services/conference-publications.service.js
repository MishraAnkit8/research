const conferencePublicationModels = require('../models/conference-publications.modles');


module.exports.fetchConferencePublication = async() => {
    const conferencePublicationData = await conferencePublicationModels.fetchConferencePublication();
    console.log('feched data in service  ==>' , conferencePublicationData);
    const conferenceDataList = conferencePublicationData.conferenceDataList.rows;
    const externalEmpList = conferencePublicationData.externalEmpList.rows;
    const internalEmpList = conferencePublicationData.internalEmpList.rows;

    // Extract author names from patentList
    const authorNameArray = conferencePublicationData.conferenceDataList.rows.map(conference => conference.author_type);
    const resultArray = [
        ...conferencePublicationData.internalEmpList.rows.map(emp => ({ authorName: emp.employee_name, table: 'internalEmpList' })),
        ...conferencePublicationData.externalEmpList.rows.map(emp => ({ authorName: emp.external_emp_name, table: 'externalEmpList' }))
    ];

    console.log('resultArray ====>>>>>>', resultArray)

    conferenceDataList.map(conference => {
        console.log('project in service====>>>>', conference.author_type);
        const facultyTypeAuthors = conference.author_type;
        console.log('facultyTypeAuthors ===>>>>', facultyTypeAuthors);
        const matchedAuthor = resultArray.find(item => item.authorName === facultyTypeAuthors);
        conference.author_type = matchedAuthor ? matchedAuthor : { authorName:facultyTypeAuthors, table : "internalEmpList"}
        console.log('matchedAuthor ====>>>>', matchedAuthor)
        
    });
    console.log('conferenceDataList ===>>>', conferenceDataList)
    const rowCount = conferencePublicationData.conferenceDataList.rowCount;
    console.log('rowCount ===>>>', rowCount)
    return {
      conferenceDataList : conferenceDataList,
        internalEmpList : internalEmpList,
        externalEmpList : externalEmpList,
        rowCount : rowCount
    }
};

module.exports.insertConferenceData = async(body , files) => {
    console.log('data in service' , body);
    console.log('files in service ==>' , files);
    const conferencePublications = body;
    const authorNameArray = JSON.parse(body.authorName);
    const internalNames = [];
    const externalNames = [];
    authorNameArray.forEach(item => {
      item.internalEmpList ? internalNames.push(item.internalEmpList) : null;
      item.externalEmpList ? externalNames.push(item.externalEmpList) : null;
      
    });
    // convert array into string
    const internalNamesString = internalNames.join(", ");
    const externalNamesString = externalNames.join(", ");
    const authorNameString = internalNamesString + externalNamesString;
    const conferenceDocument = files.conferenceDocument?.map(file => file.filename).join(',');
    const conferenceProofFile = files.conferenceProof?.map(file => file.filename).join(',');
    console.log('authorNameString ===>>>', authorNameString)
    console.log('conferenceDocumentData string in service ===>>>', conferenceDocument)
    console.log('conferenceProofData string in service  ==>>>', conferenceProofFile)
    const insertConferencePublication = await conferencePublicationModels.insertConferencePublication(conferencePublications, conferenceDocument, conferenceProofFile, internalNamesString, externalNamesString);
    console.log('insertConferencePublication in service ===>>>>', insertConferencePublication);
    return insertConferencePublication.status === "Done" ? {
      status : "Done",
      message : insertConferencePublication.message,
      conferenceId : insertConferencePublication.conferenceId,
      externalEmpId : insertConferencePublication.externalEmpId ? insertConferencePublication.externalEmpId : null,
      conferenceDocument : conferenceDocument,
      conferenceProofFile : conferenceProofFile,
      rowCount : insertConferencePublication.rowCount,
      conferencePublications : conferencePublications,
      authorNameString : authorNameString, 
      internalNamesString : internalNamesString,
      externalNamesString : externalNamesString

    } : {
      status : insertConferencePublication.status,
      message : insertConferencePublication.message,
      errorCode : insertConferencePublication.errorCode ? insertConferencePublication.errorCode : null,
    };

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

module.exports.updatedConferencePublication = async (body, files) => {
    console.log('data in service' , body);
    const upadtedConferenceData = body
    const conferenceId =  body.conferenceId;
    const authorNameArray = JSON.parse(body.authorName) ? JSON.parse(body.authorName) : body.authorName ;
    console.log('authorNameArray ===>>>', authorNameArray)
   
    const internalNames = [];
    const externalNames = [];
    const existingName = [];
   
    authorNameArray.forEach((item) => {
      item.internalEmpList ? internalNames.push(item.internalEmpList) : null;
      item.externalEmpList ? externalNames.push(item.externalEmpList) : null;
      item.existingNameValue ? existingName.push(item.existingNameValue) : null;
     });
    // convert array into string
    const internalNamesString = internalNames.join(", ");
    const externalNamesString = externalNames.join(", ");
    const existingNameString = existingName.join(",");
    const authorNameString = internalNamesString + externalNamesString + existingNameString;
    console.log("Internal Names updated:", internalNamesString);
    console.log("External Names updated:", externalNamesString);
    console.log('storedNameString ===>>>', existingNameString);
    console.log('authorNameString ====>>>', authorNameString);
    const confernceDocString = files.conferenceDocument?.map(file => file.filename).join(',');
    const conferenceProofString = files.conferenceProof?.map(file => file.filename).join(',');
    console.log('authorNameString ===>>>', authorNameString)
    console.log('conferenceDocumentData string in service ===>>>', conferenceDocument)
    console.log('conferenceProofData string in service  ==>>>', conferenceProofFile)
    console.log('confernceDocString in service ==>>', confernceDocString);
    console.log('conferenceProofString in service ==>>', conferenceProofString);
    const updateConferencePublicationData =
      await conferencePublicationModels.updateConferencePublication(
        upadtedConferenceData,
        conferenceId,
        confernceDocString,
        conferenceProofString,
        internalNamesString,
        externalNamesString,
        existingNameString
      );

    // const ConferenceFileToBeUpdate = {confernceDocString , conferenceProofString}
    // const updateConferencePublicationData = await conferencePublicationModels.updateConferencePublication(upadtedConferenceData, conferenceId, ConferenceFileToBeUpdate);
    // if(updateConferencePublicationData && updateConferencePublicationData.rowCount === 1){
    //     console.log('updateConferencePublicationData in service ==>>', updateConferencePublicationData);
    //     return {
    //         status : 'done',
    //         massage : 'data updated successfully',
    //         confernceDocString : confernceDocString,
    //         conferenceProofString : conferenceProofString
    //     }
    // }
    // else{
    //     return {
    //         status : 'failed',
    //         massage : 'failed to update',
    //     }
    // }
     
}

module.exports.viewConferencePublication = async(conferenceId) => {
    const viewConferenceData  = await conferencePublicationModels.viewConferencePublication(conferenceId);
    if(viewConferenceData && viewConferenceData.rowCount === 1){
        return viewConferenceData
    }
}