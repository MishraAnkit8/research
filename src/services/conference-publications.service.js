const conferencePublicationModels = require('../models/conference-publications.modles');
const errorMsgMidWare = require('../middleware/error.middleware');

module.exports.fetchConferencePublication = async(userName) => {

    const conferencePublicationData = await conferencePublicationModels.fetchConferencePublication(userName);
    
    console.log('feched data in service  ==>' , conferencePublicationData);
    
    const conferenceDataList = conferencePublicationData.conferenceDataList;
    const internalEmpList = conferencePublicationData.internalEmpList;

    return {
        conferenceDataList : conferenceDataList,
        internalEmpList : internalEmpList,
        rowCount : conferencePublicationData.rowCount
    }
};

module.exports.insertConferenceData = async(body , files, userName) => {
    console.log('data in service' , body);
    console.log('files in service ==>' , files);
    const conferencePublications = body;

    const facultyInternalIds =  body.facultycontainer ? JSON.parse(body.facultycontainer) : null;
    console.log('facultyInternalIds ====>>>>>', facultyInternalIds);
    const internalFacultyArray = facultyInternalIds ? (facultyInternalIds || []) : null;
    const facultyIdscontainer = internalFacultyArray.map(Number);
    

    const externalData =  JSON.parse(body.externalFacultyDetails);;
    const externalFacultyData = groupArrayIntoChunks(externalData, 4);

    // console.log('externalFacultyData ======>>>>>>>', externalFacultyData);

    const conferenceDocument = files.conferenceDocument?.map(file => file.filename).join(',');
    const conferenceProofFile = files.conferenceProof?.map(file => file.filename).join(',');

    // console.log('authorNameString ===>>>', authorNameString)
    // console.log('conferenceDocumentData string in service ===>>>', conferenceDocument)
    // console.log('conferenceProofData string in service  ==>>>', conferenceProofFile)

    const insertConferencePublication = await conferencePublicationModels.insertConferencePublication(conferencePublications, conferenceDocument, conferenceProofFile, facultyIdscontainer, externalFacultyData, userName);
    
    // console.log('insertConferencePublication in service ===>>>>', insertConferencePublication);

    return insertConferencePublication.status === "Done" ? {
      status : "Done",
      message : insertConferencePublication.message,
      conferenceId : insertConferencePublication.conferenceId,
      conferenceFacultiesIds : insertConferencePublication.conferenceFacultiesIds,
      conferenceDocument : conferenceDocument,
      conferenceProofFile : conferenceProofFile,
      rowCount : insertConferencePublication.rowCount,
      conferencePublications : conferencePublications,
     

    } : {
      status : insertConferencePublication.status,
      message : insertConferencePublication.message,
      errorCode : insertConferencePublication.errorCode ? insertConferencePublication.errorCode : null,
    };

}

module.exports.deleteConferencePublicationData = async(body) => {
    const conferenceId = body;
    const deleteConferencePublication = await conferencePublicationModels.DeleteConference(conferenceId);
    return deleteConferencePublication.status === "Done" ? {
      status : deleteConferencePublication.status,
      massage : deleteConferencePublication.message
    }: {
      status : deleteConferencePublication.status,
      message : deleteConferencePublication.message,
      errorCode : deleteConferencePublication.errorCode
    }
}

module.exports.updatedConferencePublication = async (body, files, userName) => {
    console.log('data in service' , body);
    const upadtedConferenceData = body
    const conferenceId =  body.conferenceId;
    // console.log('files in service ==>' , files);
 

    const facultycontainer =  body.facultycontainer ? JSON.parse(body.facultycontainer) : null;
    // console.log('facultycontainer =====>>>>>>', facultycontainer);

    const internalUpdate = body.internalUpdate ? JSON.parse(body.internalUpdate) : null;
    // console.log('internalUpdate ====>>>>>>', internalUpdate);

    // Step 2: Flatten the nested array
    const facultyLastElement =  facultycontainer ? facultycontainer[facultycontainer.length - 1] : null;
    // console.log('facultyLastElement ====>>>>>>>', facultyLastElement);
    const facultyIds = facultyLastElement ? facultyLastElement.flat() : null;

    // console.log('facultyIds ======>>>>>>>>>>', facultyIds);

    // Step 3: Convert each element to an integer and subtract 2
    const facultyIdscontainer = facultyIds ? facultyIds.map(element => parseInt(element)) : null;
    // console.log('facultyIdscontainer ===>>>>>', facultyIdscontainer);

    const externalFacultyUpdate =  JSON.parse(body.externalFacultyUpdate);
    const externalFacultyDataUpdate = groupArrayIntoChunks(externalFacultyUpdate, 5);
    // console.log('externalFacultyDataUpdate ======>>>>>>>', externalFacultyDataUpdate);

    const externalFacultyDetailsInsert = body.externalFacultyDetails ?  JSON.parse(body.externalFacultyDetails) : null;
    const insertExternalData = groupArrayIntoChunks(externalFacultyDetailsInsert, 4);

    const confernceDocString = files.conferenceDocument ? files.conferenceDocument.map(file => file.filename).join(',') : null;
    const conferenceProofString = files.conferenceProof ? files.conferenceProof.map(file => file.filename).join(',') : null;
    // console.log('confernceDocString in service ==>>', confernceDocString);
    // console.log('conferenceProofString in service ==>>', conferenceProofString);

    const updateConferencePublicationData = await conferencePublicationModels.updateConferencePublication(upadtedConferenceData, conferenceId, confernceDocString,
        conferenceProofString,
        insertExternalData,
        externalFacultyDataUpdate,
        facultyIdscontainer,
        userName
      );
    console.log('updateConferencePublicationData  in service ===>>>>', updateConferencePublicationData);

    return updateConferencePublicationData.status === "Done" ? {
      status : 'Done',
      message : updateConferencePublicationData.message,
      confernceDocString : confernceDocString,
      conferenceProofString : conferenceProofString,
      upadtedConferenceData : upadtedConferenceData

    }:{
      status : updateConferencePublicationData.status,
      message : updateConferencePublicationData.message,
      errorCode : updateConferencePublicationData.errorCode
    };
     
}

module.exports.viewConferencePublication = async(conferenceId, userName) => {
    const viewConferenceData  = await conferencePublicationModels.viewConferencePublication(conferenceId, userName);
    console.log('viewConferenceData ====>>>>', viewConferenceData);
    return viewConferenceData.status === "Done" ? {
      status : viewConferenceData.status,
      message : viewConferenceData.message,
      viewConferenceData : viewConferenceData.conferencePresentation,
      facultyDetails : viewConferenceData.facultyDetails
    } : {
      status : viewConferenceData.status,
      message : viewConferenceData.message,
      errorCode : viewConferenceData.errorCode
    }
}


module.exports.retriveExternalData = async(body, userName) => {
  const conferenceId = body.conferenceId;
  const externalFacultyDetails = await conferencePublicationModels.retriveExternalDetails(conferenceId, userName);

  console.log('externalFacultyDetails =====>>>>>>', externalFacultyDetails);
  return externalFacultyDetails.status === "Done" ? {
    status : externalFacultyDetails.status,
    message : externalFacultyDetails.message,
    exetrnalData : externalFacultyDetails.exetrnalData,
    rowCount : externalFacultyDetails.rowCount
  } : {
    status : externalFacultyDetails.status,
    message : externalFacultyDetails.message,
    errorCode : externalFacultyDetails.errorCode
  }
}

module.exports.deleteExternalFacultyDetails = async(body, userName) => {

  const externalId = body.tableId;
  console.log('externalId =====>>>>>>>', externalId);

  const deleteExternalDetails = await conferencePublicationModels.deletedExternalDetails(externalId, userName);
  
  console.log('deleteExternalDetails ====>>>>>>>', deleteExternalDetails);

  return deleteExternalDetails.status === "Done" ? {
    status : deleteExternalDetails.status,
    message : deleteExternalDetails.message,
    rowCount : deleteExternalDetails.rowCount
  } : {
    status : deleteExternalDetails.status,
    message : deleteExternalDetails.message,
    errorCode : deleteExternalDetails.errorCode
  }

}



module.exports.deleteInternalData = async(body, userName) => {
  const internalId = body.internalId;
  const conferenceId = body.conferenceId
  const deleteInternalDetails = await conferencePublicationModels.deleteInternalFaculty(internalId, conferenceId, userName);
  console.log('deleteInternalDetails ====>>>>', deleteInternalDetails);

}

function groupArrayIntoChunks(array, chunkSize) {
  let groupedArray = [];
  for (let i = 0; i < array.length; i += chunkSize) {
      groupedArray.push(array.slice(i, i + chunkSize));
  }
  return groupedArray;
}



