const patentFormsModels = require('../models/patent-submission.models');

module.exports.fetchPatentForm = async () => {

    const patentSubmissionForm = await patentFormsModels.fetchPatentSubMissionForms();

    console.log('patentSubmissionForm in SErvice  ====>>>', patentSubmissionForm);
    console.log('patentSubmissionForm in services ===>>>>>', patentSubmissionForm.patentData);
    console.log('facultTableData in services :::::===>>>>>',patentSubmissionForm.internalFacultyData);
    console.log('research_project_grant_faculty Data In Service ::: ==>>>>', patentSubmissionForm.patentGrantFacultyIdContainer)
    console.log('facultTableData in services :::::===>>>>>',patentSubmissionForm.externalPatentFacultyId);
    console.log('externalPatentFacultyId ===>>>>', patentSubmissionForm.externalPatentFacultyId);
    console.log('patentSdgGoalData ===>>>>>>', patentSubmissionForm.patentSdgGoalData);
    console.log('patentInnovationTypeData in services :::::===>>>>>', patentSubmissionForm.patentInnovationTypeData);
    console.log('patentStagData ===>>>>', patentSubmissionForm.patentStagData);
    console.log('patentSubmissionsData ===>>>>>>', patentSubmissionForm.patentSubmissionsData);

    // const patentSubmissionsData = patentSubmissionForm.patentSubmissionsData
    const patentSubmissionMap = {};
    patentSubmissionForm.patentSubmissionsData.forEach(data => {
        const id = data.patent_submission_grant_id;
        if (!patentSubmissionMap[id]) {
            patentSubmissionMap[id] = data;
          
        }
    });

    const patentSubmissionsData = Object.values(patentSubmissionMap);

    console.log('patentSubmissionsData in service ===>>>>>>>', patentSubmissionsData);
    // console.log('patentSubmissionsData date  ===>>>>', patentSubmissionsData[0].grant_date)
    const dateFormate = []
    for (let i = 0; i <= patentSubmissionsData.length -1 ; i ++){
        patentSubmissionsData[i].grant_date ? patentSubmissionsData[i].grant_date  = formatDate(patentSubmissionsData[i].grant_date) : null
    }
    console.log('patentSubmissionsData in service ===>>>>>>>', patentSubmissionsData);

    const patentGrantFacultyIdContainer = patentSubmissionForm.patentGrantFacultyIds;
    const idContainerArray = {};

    for (const item of patentGrantFacultyIdContainer) {
      if (!idContainerArray[item.patent_submission_grant_id]) {
        idContainerArray[item.patent_submission_grant_id] = {
          patent_submission_grant_id: item.patent_submission_grant_id,
          faculty_id: [],
          id: []
        };
      }
      
      idContainerArray[item.patent_submission_grant_id].faculty_id.push(item.faculty_id);
      idContainerArray[item.patent_submission_grant_id].id.push(item.id);
    }

    const patentGrantFacultyIds = Object.values(idContainerArray);
    // console.log('idContainerArray ===>>>>', idContainerArray);
    // console.log('patentGrantFacultyIds ====>>>>', patentGrantFacultyIds);

    return patentSubmissionForm.status === "Done" ? {
        status : patentSubmissionForm.status,
        message : patentSubmissionForm.rowCount,
        patentData : patentSubmissionForm.patentData,
        patentSubmissionsData : patentSubmissionsData,
        rowCount : patentSubmissionForm.rowCount,
        patentStagData : patentSubmissionForm.patentStagData,
        patentSubmissionsDataList : patentSubmissionForm.patentSubmissionsDataList,
        internalFacultyData : patentSubmissionForm.internalFacultyData,
        patentSdgGoalData : patentSubmissionForm.patentSdgGoalData,
        patentInventionTypeData : patentSubmissionForm.patentInventionTypeData,
        patentData : patentSubmissionForm.patentData,
        internalPatentFacultyId : patentSubmissionForm.internalPatentFacultyId,
        externalPatentFacultyId : patentSubmissionForm.externalPatentFacultyId,
        patentGrantFacultyIdContainer : patentSubmissionForm.patentGrantFacultyIdContainer,
        patentGrantFacultyIds : patentGrantFacultyIds

    } : {
        status : patentSubmissionForm.status,
        message : patentSubmissionForm.message,
        errorCode : patentSubmissionForm.errorCode
    }

}

module.exports.insertExternalDetails = async(body) => {
    console.log('body ===>>>>>>', body);
    const exetrnalFacultyDetails = body.externalFacultyDetails;
    console.log('exetrnalFacultyDetails in service ==>>>>', exetrnalFacultyDetails)

    const insertExternalData = await patentFormsModels.insertFacultyDetails(exetrnalFacultyDetails);

    console.log('insertExternalData ===>>>>>', insertExternalData)

    return insertExternalData.status === "Done" ? {
        status : insertExternalData.status,
        message : insertExternalData.message,
        externalFacultyId : insertExternalData.externalFacultyId,
        rowCount : insertExternalData.rowCount,
        facultyData : exetrnalFacultyDetails
    } : {
        status : insertExternalData.status,
        message : insertExternalData.message,
        errorCode : insertExternalData.errorCode
    }
}

module.exports.insertPatentFormData = async(body , files) => {
    console.log('patentData in service', body);
    const patentData = body;
    console.log('patentData in service', patentData);
    const sdgDataIds = JSON.parse(patentData.sdgGoalsContainer);
    const sdgGoalsData = sdgDataIds || []
    const sdgGoalsIdArray = sdgGoalsData.map(Number);
    console.log('sdgGoalsIdArray:', sdgGoalsIdArray);
    const inventionTypesData = JSON.parse(patentData.typeOfInvention);
    console.log('inventionTypesData ===>>>>', inventionTypesData);
    const inventionTypesIds = inventionTypesData.typeOfInventions || [];
    const inventionIdsArray = inventionTypesIds.map(Number);
    console.log('inventionIdsArray ===>>>>>', inventionIdsArray);
    const patentStatusId = parseInt(patentData.patentStage);
    const patentStatusArray = [patentStatusId];
    console.log('patentStatusArray ==>>>>', patentStatusArray)

    // Parse the facultyDataContainer property to extract internalFaculty and externalEmpList arrays
    const facultyData = JSON.parse(patentData.facultyDataContainer);
    // Extract internalFaculty and externalEmpList arrays
    const internalFaculty = facultyData.find(item => item !== null && item.internalFaculty)?.internalFaculty || [];
    const externalEmpList = facultyData.find(item => item  !== null && item.externalEmpList )?.externalEmpList || [];
    const internalFacultyList =  internalFaculty.map(Number)
    console.log('externalEmpList:', externalEmpList);
    console.log('internalFacultyList:', internalFacultyList);
    const FacultydataArray = [...externalEmpList, ...internalFacultyList];
    console.log('FacultydataArray ===>>>>>', FacultydataArray);
    const patentDataFilesString = files?.map(file => file.filename).join(',');

    const insertPatentData = await patentFormsModels.insertPatentData(patentData, patentDataFilesString, sdgGoalsIdArray, inventionIdsArray, FacultydataArray, patentStatusArray, patentStatusId);

    console.log('insertPatentData in service ====>>>', insertPatentData);

    return insertPatentData.status === "Done" ? {
            status : insertPatentData.status,
            message : insertPatentData.message,
            patentId : insertPatentData.patentId,
            patentDataFilesString : patentDataFilesString,
            patentGrantIds: insertPatentData.patentGrantIds,
            dsgGoalsIds : insertPatentData.dsgGoalsIds,
            inventionTypeIds : insertPatentData.inventionTypeIds,
            patentStatusId : insertPatentData.patentStatusId,
            patentData : patentData,
            rowCount : insertPatentData.rowCount

    } : {
            status : insertPatentData.status,
            message : insertPatentData.message,
            errorCode : insertPatentData.errorCode
    }
}
   


module.exports.updatPatentSubmission = async(body, patentId, files) => {
    const updatedPatentData = body;
    console.log('body in service  ====>>>>', body);
    const sdgDataIds =  updatedPatentData.sdgGoalsContainer !== 'undefined' || null ? JSON.parse(updatedPatentData.sdgGoalsContainer) : null;
    const sdgGoalsData = sdgDataIds !== 'undefined' || null ? sdgDataIds || [] : null;
    console.log('sdgGoalsData ===>>>',sdgGoalsData);
    const sdgGoalsIdArray = sdgGoalsData.map(Number);
    console.log('sdgGoalsIdArray:', sdgGoalsIdArray);
    const inventionIdsArray = [parseInt(updatedPatentData.typeOfInvention)];
    console.log('inventionIdsArray ===>>>>>', inventionIdsArray);
    const patentStatusIdArray = [parseInt(updatedPatentData.patentStage)];
    console.log('patentStatusIdArray ===>>>>', patentStatusIdArray);

    // Parse the facultyDataContainer property to extract internalFaculty and externalEmpList arrays
    const facultyData = JSON.parse(updatedPatentData.facultyDataContainer);
    // Extract internalFaculty and externalEmpList arrays
    const internalFaculty = facultyData.find(item => item !== null && item.internalFaculty)?.internalFaculty || [];
    const externalEmpList = facultyData.find(item => item  !== null && item.externalEmpList )?.externalEmpList || [];
    const internalFacultyList =  internalFaculty.map(Number)
    console.log('externalEmpList:', externalEmpList);
    console.log('internalFacultyList:', internalFacultyList);
    const FacultydataArray = [...externalEmpList, ...internalFacultyList];
    console.log('FacultydataArray ===>>>>>', FacultydataArray);
    const patentDataFiles = files ?.map(file => file.filename).join(',')

    const upadtedPatentSubmissionData = await patentFormsModels.updatePatentsubmissionData(updatedPatentData, patentId, patentDataFiles, sdgGoalsIdArray, inventionIdsArray, FacultydataArray, patentStatusIdArray);

    console.log('upadtedPatentSubmissionData ====>>>>', upadtedPatentSubmissionData);

    return upadtedPatentSubmissionData.status === "Done" ? {
                status : "Done",
                message : upadtedPatentSubmissionData.message,
                patentDataFiles : patentDataFiles ? patentDataFiles : null,
                patentId : patentId,
                patentStageId : upadtedPatentSubmissionData.patentstage,
                patentGrantIds : upadtedPatentSubmissionData.patentGrantIds,
                InventionTypeIds : upadtedPatentSubmissionData.InventionTypeIds,
                sdgGoalsIds : upadtedPatentSubmissionData.sdgGoalsIds,
                updatedPatentData : updatedPatentData
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

module.exports.viewPatentsubmission = async(patentId) => {
    console.log('id', patentId);

    const patentDataViewed = await patentFormsModels.viewPatentSubmission(patentId);

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


function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }