const IPRModels = require('../models/IPR.models');


module.exports.fetchPatentForm = async(userName) => {
    const IPRFormData = await IPRModels.fetchIPRData(userName);
    console.log('IPRFormData ===>>>>>', IPRFormData);

    const iprData = IPRFormData.iprData;
    console.log('iprData ====>>>>>', iprData);
    // console.log('patentSdgGoalData ===>>>>>>', IPRFormData.patentSdgGoalData);


    return IPRFormData.status === "Done" ? {
        status : IPRFormData.status,
        message : IPRFormData.message,
        rowCount : IPRFormData.rowCount,
        iprData : IPRFormData.iprData,
        internalEmpList : IPRFormData.internalEmpList,
        inventionTypData : IPRFormData.inventionTypData,
        patentStatus : IPRFormData.patentStatus,
        schoolList : IPRFormData.nmimsSchoolList,
        campusList : IPRFormData.nmimsCampusList,
        supportingDocumnets : IPRFormData.supportingdocumnets,
        patentSdgGoalData : IPRFormData.patentSdgGoalData,

    } : {}

}


module.exports.IprInsertDataService = async(body, files, userName) => {
    const iprFilesNamesArray = files ?.map(file => file.filename).join(',');
    console.log('iprFilesNamesArray ====>>>>', iprFilesNamesArray);
    const IprData = body;

    const sdgDataIds = JSON.parse(IprData.sdgGoalsContainer);
    // console.log('sdgDataIds ====>>>>>', sdgDataIds);
    const sdgGoalsData = sdgDataIds || []
    const sdgGoalsIdArray = sdgGoalsData.map(Number);
    console.log('sdgGoalsIdArray:', sdgGoalsIdArray);


    const inventionTypesData = JSON.parse(IprData.inventionTypeContainer);
    const invetionIds = inventionTypesData || [];
    const inventionIdsArray = invetionIds.map(Number);

    console.log('inventionIdsArray ===>>>>>', inventionIdsArray);
    // patentStatusIdsArray

    const patentStatusId = body.patentStage;
    console.log("patentStatusId ===>>>>>>>", patentStatusId);

    const patentStatusArray = Array.isArray(patentStatusId)? patentStatusId : [patentStatusId];
    const patentStatus = patentStatusArray.map(Number);

    console.log("patentStatus ===>>>>>>>", patentStatus);
  

    const facultyInternalIds = IprData.facultyContainer ? JSON.parse(IprData.facultyContainer) : null;
    console.log('facultyInternalIds ====>>>>>', facultyInternalIds);
    const internalFacultyArray = facultyInternalIds ? (facultyInternalIds || []) : null;
    const facultyIdsContainer = internalFacultyArray.map(Number);

    console.log('facultyIdsContainer =====>>>>>>>', facultyIdsContainer);
   
    const externalData =  JSON.parse(body.externalFacultyDetails);;
    const externalFacultyData = groupArrayIntoChunks(externalData, 4);
    console.log('externalFacultyData ====>>>>>>', externalFacultyData);

    const insertIprData = await IPRModels.InsetIPRDataModels(IprData, iprFilesNamesArray, sdgGoalsIdArray, inventionIdsArray, patentStatus, facultyIdsContainer, externalFacultyData, userName);

    console.log('insertIprData ===>>>>', insertIprData);
    
    return insertIprData.status === "Done" ? {
        status : insertIprData.status ,
        message : insertIprData.message,
        rowCount : insertIprData.rowCount,
        iprId : insertIprData.iprId,
        iprFacultyIds : insertIprData.iprFacultyIds,
        iprSdgGoalsIds : insertIprData.iprSdgGoalsIds,
        iprInventionIds : insertIprData.iprInventionIds,
        iprStatusIds : insertIprData.iprStatusIds,
        externalIds : insertIprData.externalIds

    } : {
        status : insertIprData.status,
        message : insertIprData.message,
        errorCode : insertIprData.errorCode
    }
}

module.exports.deleteIPRRow = async(iprId) => {
    console.log('iprId in servicess ===>>>>', iprId);

    const IprRowDataToBeDeleted = await IPRModels.deleteIPRData(iprId);

    console.log('IprRowDataToBeDeleted ===>>>>>', IprRowDataToBeDeleted);

    return IprRowDataToBeDeleted.status === "Done" ? {
        status : IprRowDataToBeDeleted.status,
        message : IprRowDataToBeDeleted.message
    } : {
        status : IprRowDataToBeDeleted.status,
        message : IprRowDataToBeDeleted.message,
        errorCode : IprRowDataToBeDeleted.errorCode
    }
}


module.exports.updatedIprData = async(iprId, body, files, userName) => {
    console.log('iprId in service ===>>>', iprId);
    const iprFilesNamesArray = files ?.map(file => file.filename).join(',');

    console.log('iprFilesNamesArray ====>>>>', iprFilesNamesArray);
    const updatedIPRData = body;
    const sdgDataIds = JSON.parse(updatedIPRData.sdgGoalsContainer);
    // console.log('sdgDataIds ====>>>>>', sdgDataIds);
    const sdgGoalsData = sdgDataIds || []
    const sdgGoalsIdArray = sdgGoalsData.map(Number);
    console.log('sdgGoalsIdArray:', sdgGoalsIdArray);
    
    
    const inventionTypesData = JSON.parse(updatedIPRData.inventionTypeContainer);
    const invetionIds = inventionTypesData || [];
    const inventionIdsArray = invetionIds.map(Number);
    console.log('inventionIdsArray ===>>>>>', inventionIdsArray);

    // patentStatusIdsArray
    const patentStatusId = body.patentStage;
    console.log("patentStatusId ===>>>>>>>", patentStatusId);

    const patentStatusArray = Array.isArray(patentStatusId) ? patentStatusId : [patentStatusId];
    console.log("patentStatusArray ===>>>>>", patentStatusArray);
    const patentStatus = patentStatusArray.filter((item) => item !== "").map(Number);
    console.log("patentStatus ===>>>>>>>", patentStatus);

    
    
    const facultyInternalIds = JSON.parse(updatedIPRData.facultyContainer);
    console.log('facultyInternalIds ====>>>>>', facultyInternalIds);
    const internalFacultyArray = facultyInternalIds || [];
    const facultyIdsContainer = internalFacultyArray.map(Number);
    console.log('facultyIdsContainer =====>>>>>>>', facultyIdsContainer);
    
    const externalData =  JSON.parse(body.externalFacultyDetails);
    const externalFacultyData = groupArrayIntoChunks(externalData, 4);
    console.log('externalFacultyData ====>>>>>>', externalFacultyData);

    const updateExeternalDetails = JSON.parse(body.updateExternalData);
    const updateExternalDetailsArray = groupArrayIntoChunks(updateExeternalDetails, 5);
    console.log('updateExternalDetailsArray ====>>>>>>>', updateExternalDetailsArray);

   
    const iprDataToBeUpdated = await IPRModels.updateIPRRecordData(iprId, updatedIPRData, iprFilesNamesArray, sdgGoalsIdArray, inventionIdsArray, patentStatus,
        externalFacultyData, updateExternalDetailsArray, facultyIdsContainer, userName);

    console.log('iprDataToBeUpdated ====>>>>', iprDataToBeUpdated);

    return iprDataToBeUpdated.status === "Done" ? {
        status : iprDataToBeUpdated.status,
        message : iprDataToBeUpdated.message,
        iprFacultyIds : iprDataToBeUpdated.iprFacultyIds,
        iprSdgGoalsIds : iprDataToBeUpdated.iprSdgGoalsIds,
        iprInventionIds : iprDataToBeUpdated.iprInventionIds,
        iprStatusIds : iprDataToBeUpdated.iprStatusIds,
        externalIds : iprDataToBeUpdated.externalIds,
        iprRowCount: iprDataToBeUpdated.iprRowCount, 
        updatedFacultyRowCount: iprDataToBeUpdated.updatedFacultyRowCount       

    } : {
        status : iprDataToBeUpdated.status,
        message : iprDataToBeUpdated.message,
        errorCode : iprDataToBeUpdated.errorCode
    };

}

module.exports.viewIprRecordDataRecord = async(iprId, userName) => {
    console.log('iprId in service ===>>>>', iprId);

    const viewIprRowData = await IPRModels.iprRecordToBeViewed(iprId, userName);

    console.log('viewIprRowData ===>>>', viewIprRowData);

    return viewIprRowData.status === "Done" ? {
        status : viewIprRowData.status,
        message : viewIprRowData.message,
        IPRData : viewIprRowData.IPRData,
        facultyData : viewIprRowData.facultyData,
        iprNmimsSchoolList : viewIprRowData.iprNmimsSchoolList,
        iprNmimsCampusList : viewIprRowData.iprNmimsCampusList,
        iprInventionList : viewIprRowData.iprInventionList,
        iprStatusList : viewIprRowData.iprStatusList,
        iprDocumentsList : viewIprRowData.iprDocumentsList,
        sdgGoals : viewIprRowData.sdgGoals

    } : {
        status : viewIprRowData.status,
        message : viewIprRowData.message,
        errorCode : viewIprRowData.errorCode
    };
}


module.exports.retriveExternalData = async(body, userName) => {
    const iprId = body.iprId;
    const externalFacultyDetails = await IPRModels.retriveExternalDetails(iprId, userName);
  
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
  
    const deleteExternalDetails = await IPRModels.deletedPatentExternalDetails(externalId, userName);
    
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

// service for dropdown school
module.exports.deleteIprInternalFaculty = async(body, userName) => {
    console.log('body in service school ====>>>>', body);

    const iprId = body.iprId;
    const internalId = body.internalId;
    console.log('internalId ===>>>>>', internalId);

    const result = await IPRModels.deleteInternalFaculty(internalId, iprId, userName);
    console.log('result ===>>>>>>>', result);
    return result.status === "Done" ? {
        status : result.status,
        message : result.message
    } : {
        status : result.status,
        message : result.message,
        errorCode : result.errorCode
    }
}

// service for dropdown campus
module.exports.deleteIprSdgDetails = async(body, userName) => {
    console.log('body in service campus ====>>>>', body);
    const iprId = body.iprId;
    const internalId = body.internalId;
    console.log('internalId ===>>>>>', internalId);

    const result = await IPRModels.deleteIprSdgGoals(internalId, iprId, userName);
    console.log('result ===>>>>>>>', result);
    return result.status === "Done" ? {
        status : result.status,
        message : result.message
    } : {
        status : result.status,
        message : result.message,
        errorCode : result.errorCode
    }
}

// service for dropdown internal nmims faculty
module.exports.deleteIprStatusData = async(body, userName) => {
    console.log('body in service internal authors ====>>>>', body);
    const iprId = body.iprId;
    const internalId = body.internalId;
    console.log('internalId ===>>>>>', internalId);

    const result = await IPRModels.deleteIprPatentStatus(internalId, iprId, userName);

    console.log('result ===>>>>>>>', result);
    return result.status === "Done" ? {
        status : result.status,
        message : result.message
    } : {
        status : result.status,
        message : result.message,
        errorCode : result.errorCode
    }
}

// service for dropdown all authors
module.exports.deleteIprInventionTypeData = async(body, userName) => {
    console.log('body in service  all authors ====>>>>', body);
    const iprId = body.iprId;
    const internalId = body.internalId;
    console.log('internalId ===>>>>>', internalId);


    const result = await IPRModels.deletIprInventionType(internalId, iprId, userName);

    console.log('result ===>>>>>>>', result);
    return result.status === "Done" ? {
        status : result.status,
        message : result.message
    } : {
        status : result.status,
        message : result.message,
        errorCode : result.errorCode
    }
}


function groupArrayIntoChunks(array, chunkSize) {
    let groupedArray = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        groupedArray.push(array.slice(i, i + chunkSize));
    }
    return groupedArray;
  }