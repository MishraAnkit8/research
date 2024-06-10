const patentFormsModels = require('../models/patent-submission.models');

module.exports.fetchPatentForm = async (userName) => {
    const patentSubmissionForm = await patentFormsModels.fetchPatentSubMissionForms(userName);

    console.log('patentSubmissionForm in service =====>>>>>>>', patentSubmissionForm);

    return patentSubmissionForm.status === "Done" ? {
        status : patentSubmissionForm.status,
        message : patentSubmissionForm.message,
        rowCount: patentSubmissionForm.rowCount,
        patentStagData: patentSubmissionForm.patentStagData,
        patentSubmissionsData: patentSubmissionForm.patentSubmissionsData,
        internalFacultyData: patentSubmissionForm.internalFacultyData,
        patentSdgGoalData: patentSubmissionForm.patentSdgGoalData,
        patentInventionTypeData: patentSubmissionForm.patentInventionTypeData
        
    } : {
        status : patentSubmissionForm.status,
        message : patentSubmissionForm.message,
        errorCode : patentSubmissionForm.errorCode
    }

}



module.exports.insertPatentFormData = async(body , files, userName) => {

    const patentData = body;
    console.log('patentData in service', patentData);

    const sdgDataIds = JSON.parse(patentData.sdgGoalsContainer);
    // console.log('sdgDataIds ====>>>>>', sdgDataIds);
    const sdgGoalsData = sdgDataIds || []
    const sdgGoalsIdArray = sdgGoalsData.map(Number);
    console.log('sdgGoalsIdArray:', sdgGoalsIdArray);

    const inventionTypesData = JSON.parse(patentData.typeOfInvention);
    const invetionIds = inventionTypesData || [];
    const inventionIdsArray = invetionIds.map(Number);
    console.log('inventionIdsArray ===>>>>>', inventionIdsArray);
    // patentStatusIdsArray
    const patentStatusId = JSON.parse(patentData.patentStatusIdsArray);
    const PatentStageIds = patentStatusId || [];
    const patentStatusArray = PatentStageIds.map(Number);
    console.log('patentStatusArray ==>>>>', patentStatusArray)

    const facultyInternalIds = patentData.facultyContainer ? JSON.parse(patentData.facultyContainer) : null;
    console.log('facultyInternalIds ====>>>>>', facultyInternalIds);
    const internalFacultyArray = facultyInternalIds ? (facultyInternalIds || []) : null;
    const facultyIdsContainer = internalFacultyArray ?  (internalFacultyArray.map(Number)) : [];

    console.log('facultyIdsContainer =====>>>>>>>', facultyIdsContainer);
   
    const externalData =  JSON.parse(body.externalFacultyDetails);;
    const externalFacultyData = groupArrayIntoChunks(externalData, 4);
    console.log('externalFacultyData ====>>>>>>', externalFacultyData);

    const patentDataFilesString = files?.map(file => file.filename).join(',');

    const insertPatentData = await patentFormsModels.insertPatentData(patentData, patentDataFilesString, sdgGoalsIdArray, inventionIdsArray, facultyIdsContainer, patentStatusArray, externalFacultyData, userName);

    console.log('insertPatentData in service ====>>>', insertPatentData);

    return insertPatentData.status === "Done" ? {
            status : insertPatentData.status,
            message : insertPatentData.message,
            patentId : insertPatentData.patentId,
            patentFacultyIds : insertPatentData.patentFacultyIds,
            patentSdgGoalsIds : insertPatentData.patentSdgGoalsIds,
            patentInventionIds : insertPatentData.patentInventionIds,
            patentSatausIds : insertPatentData.patentSatausIds,
            rowCount : insertPatentData.rowCount

    } : {
            status : insertPatentData.status,
            message : insertPatentData.message,
            errorCode : insertPatentData.errorCode
    }
}
   


module.exports.updatPatentSubmission = async(body, patentId, files, userName) => {
    const updatedPatentData = body;
    console.log('body in service  ====>>>>', body);
    const sdgDataIds = JSON.parse(updatedPatentData.sdgGoalsContainer);
    console.log("sdgDataIds ====>>>>>", sdgDataIds);
    const sdgGoalsData = sdgDataIds || [];
    const sdgGoalsIdArray = sdgGoalsData.map(Number);
    console.log("sdgGoalsIdArray:", sdgGoalsIdArray);

    const inventionTypesData = JSON.parse(updatedPatentData.typeOfInvention);
    const inventionTypesIds = inventionTypesData || [];
    const inventionIdsArray = inventionTypesIds.map(Number);
    console.log("inventionIdsArray ===>>>>>", inventionIdsArray);
    // patentStatusIdsArray

    const patentStatusId = JSON.parse(updatedPatentData.patentStatusIdsArray);
    const PatentStageIds = patentStatusId || [];
    const patentStatusArray = PatentStageIds.map(Number);
    console.log("patentStatusArray ==>>>>", patentStatusArray);

    const facultyInternalIds = updatedPatentData.facultyContainer ? JSON.parse(updatedPatentData.facultyContainer)
      : null;
    const facultyIds = facultyInternalIds || [];
    const facultyIdsArray = facultyIds.map(Number);
    console.log("facultyIdsArray ==>>>>", facultyIdsArray);
    
    console.log("facultyInternalIds ====>>>>>", facultyInternalIds);
    const internalFacultyArray = facultyInternalIds ? facultyInternalIds || [] : [];
    const facultyIdsContainer =  internalFacultyArray ? internalFacultyArray.map(Number) : [];

    console.log("facultyIdsContainer =====>>>>>>>", facultyIdsContainer);
    

    const externalData = JSON.parse(body.externalFacultyDetails);
    const externalFacultyData = groupArrayIntoChunks(externalData, 4);
    console.log("externalFacultyData ====>>>>>>", externalFacultyData);

    const updateExternalDetailsUpdate =  body.externalFacultyUpdate ? JSON.parse(body.externalFacultyUpdate) : null;
    const externalDetailsUpdate =  updateExternalDetailsUpdate ? groupArrayIntoChunks(updateExternalDetailsUpdate, 5) : null;
   
    const patentDataFiles = files ?.map(file => file.filename).join(',')

    const upadtedPatentSubmissionData = await patentFormsModels.updatePatentsubmissionData(patentId, updatedPatentData, patentDataFiles, userName,
        sdgGoalsIdArray, inventionIdsArray, patentStatusArray, facultyIdsContainer, externalDetailsUpdate, externalFacultyData
    );

    console.log('upadtedPatentSubmissionData ====>>>>', upadtedPatentSubmissionData);

    return upadtedPatentSubmissionData.status === "Done" ? {
                status : "Done",
                message : upadtedPatentSubmissionData.message,
                // patentDataFiles : patentDataFiles ? patentDataFiles : null,
                // patentId : patentId,
                // patentStageId : upadtedPatentSubmissionData.patentstage,
                // patentGrantIds : upadtedPatentSubmissionData.patentGrantIds,
                // InventionTypeIds : upadtedPatentSubmissionData.InventionTypeIds,
                // sdgGoalsIds : upadtedPatentSubmissionData.sdgGoalsIds,
                // updatedPatentData : updatedPatentData
    } : {
                status : upadtedPatentSubmissionData.status,
                message : upadtedPatentSubmissionData.message,
                errorCode : upadtedPatentSubmissionData.errorCode
    }   
}

module.exports.deletePatentSubmission = async(body) => {
    const {patentId} = body;
    console.log('patent Id in Service for deletion ', patentId);
    const deletePatentData = await patentFormsModels.deletePatentSubmissionData(patentId);

    console.log('deletePatentData ===>>>>', deletePatentData);

    return deletePatentData.status === "Done" ? {
        status : deletePatentData.status,
        message : deletePatentData.message
    } : {
        status : deletePatentData.status,
        message : deletePatentData.message,
        errorCode : deletePatentData.errorCode
    }

}

module.exports.viewPatentsubmission = async(patentId, userName) => {
    console.log('id', patentId);

    const patentDataViewed = await patentFormsModels.viewPatentSubmission(patentId, userName);

    console.log('patentDataViewed ===>>>>>>', patentDataViewed);
    const patentSubmissionMap = {};
    patentDataViewed.patentData.forEach(data => {
        const id = data.patent_submission_grant_id;
        if (!patentSubmissionMap[id]) {
            patentSubmissionMap[id] = data;
          
        }
    });

    const patentSubmissionsData = Object.values(patentSubmissionMap);

    console.log('patentSubmissionsData in service ===>>>>>>>', patentSubmissionsData);
    console.log('patentSubmissionsData date  ===>>>>', patentSubmissionsData[0].grant_date)
    const dateFormate = []
    for (let i = 0; i <= patentSubmissionsData.length -1 ; i ++){
        patentSubmissionsData[i].grant_date  = formatDate(patentSubmissionsData[i].grant_date)
    }
    console.log('patentSubmissionsData in service ===>>>>>>>', patentSubmissionsData);

    const facultyData =  patentDataViewed.facultyData;
    const sdgGoalsData = patentDataViewed.sdgGoalsData;
    const inventionTypeData = patentDataViewed.inventionTypeData;

    return patentDataViewed.status === "Done" ? {
        status : patentDataViewed.status,
        message : patentDataViewed.message,
        facultyData : facultyData,
        sdgGoalsData : sdgGoalsData,
        inventionTypeData : inventionTypeData,
        patentSubmissionsData : patentSubmissionsData
    } : {
        status : patentDataViewed.status,
        message : patentDataViewed.message,
        errorCode : patentDataViewed.errorCode
    }

}

module.exports.retriveExternalData = async(body, userName) => {
    const patentId = body.patentId;
    const externalFacultyDetails = await patentFormsModels.retriveExternalDetails(patentId, userName);
  
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
  
    const deleteExternalDetails = await patentFormsModels.deletedPatentExternalDetails(externalId, userName);
    
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
  
  
  
module.exports.deletePatentInternalFacultyData = async(body, userName) => {
    const internalId = body.internalId;
    const patentId = body.patentId
    const deleteInternalDetails = await patentFormsModels.deletePatentInternalFaculty(internalId, patentId, userName);
    console.log('deleteInternalDetails ====>>>>', deleteInternalDetails);
    console.log('deleteInternalDetails ====>>>>', deleteInternalDetails);
    return deleteInternalDetails.status === "Done" ? {
        status : deleteInternalDetails.status,
        message : deleteInternalDetails.message,
        rowCount : deleteInternalDetails.rowCount
      } : {
        status : deleteInternalDetails.status,
        message : deleteInternalDetails.message,
        errorCode : deleteInternalDetails.errorCode
      }
  
  }

module.exports.deletePatentInvention = async(body, userName) => {
    const internalId = body.internalId;

    const patentId = body.patentId
    const deleteInternalDetails = await patentFormsModels.deletePatentInventionType(internalId, patentId, userName);
    console.log('deleteInternalDetails ====>>>>', deleteInternalDetails);
    return deleteInternalDetails.status === "Done" ? {
        status : deleteInternalDetails.status,
        message : deleteInternalDetails.message,
        rowCount : deleteInternalDetails.rowCount
      } : {
        status : deleteInternalDetails.status,
        message : deleteInternalDetails.message,
        errorCode : deleteInternalDetails.errorCode
      }
    
  
  }

module.exports.deletePatentStage = async(body, userName) => {
    const internalId = body.internalId;
    const patentId = body.patentId
    const deleteInternalDetails = await patentFormsModels.deletPatentPatentStatus(internalId, patentId, userName);
    console.log('deleteInternalDetails ====>>>>', deleteInternalDetails);
    console.log('deleteInternalDetails ====>>>>', deleteInternalDetails);
    return deleteInternalDetails.status === "Done" ? {
        status : deleteInternalDetails.status,
        message : deleteInternalDetails.message,
        rowCount : deleteInternalDetails.rowCount
      } : {
        status : deleteInternalDetails.status,
        message : deleteInternalDetails.message,
        errorCode : deleteInternalDetails.errorCode
      }
  
  }

module.exports.deletePatenGoals = async(body, userName) => {
    const internalId = body.internalId;
    const patentId = body.patentId
    const deleteInternalDetails = await patentFormsModels.deletePatentSdgGoals(internalId, patentId, userName);
    console.log('deleteInternalDetails ====>>>>', deleteInternalDetails);
    console.log('deleteInternalDetails ====>>>>', deleteInternalDetails);
    return deleteInternalDetails.status === "Done" ? {
        status : deleteInternalDetails.status,
        message : deleteInternalDetails.message,
        rowCount : deleteInternalDetails.rowCount
      } : {
        status : deleteInternalDetails.status,
        message : deleteInternalDetails.message,
        errorCode : deleteInternalDetails.errorCode
      }
  
  }




function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }


  function groupArrayIntoChunks(array, chunkSize) {
    let groupedArray = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        groupedArray.push(array.slice(i, i + chunkSize));
    }
    return groupedArray;
  }

  