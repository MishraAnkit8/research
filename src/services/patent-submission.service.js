const patentFormsModels = require('../models/patent-submission.models');


module.exports.fetchPatentForm = async() => {

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
    console.log('patentSubmissionsData ===>>>>>>', patentSubmissionForm.patentSubmissionsData)
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
    console.log('patentGrantFacultyIdContainer =====>>>>>>>>>', patentSubmissionForm.patentGrantFacultyIds)

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
    // const patentSubmissionList = patentSubmissionForm.patentSubmissions.rows;
    // const externalEmpList = patentSubmissionForm.externalEmpList.rows;
    // const internalEmpList = patentSubmissionForm.internalEmpList.rows;

    // // Extract author names from patentList
    // const authorNameArray = patentSubmissionForm.patentSubmissions.rows.map(patent => patent.author_type);
    // const resultArray = [
    //     ...patentSubmissionForm.internalEmpList.rows.map(emp => ({ authorName: emp.employee_name, table: 'internalEmpList' })),
    //     ...patentSubmissionForm.externalEmpList.rows.map(emp => ({ authorName: emp.external_emp_name, table: 'externalEmpList' }))
    // ];

    // console.log('resultArray ====>>>>>>', resultArray)

    // patentSubmissionList.map(patent => {
    //     console.log('project in service====>>>>', patent.author_type);
    //     const facultyTypeAuthors = patent.author_type;
    //     console.log('facultyTypeAuthors ===>>>>', facultyTypeAuthors);
    //     const matchedAuthor = resultArray.find(item => item.authorName === facultyTypeAuthors);
    //     patent.author_type = matchedAuthor ? matchedAuthor : { authorName:facultyTypeAuthors, table : "internalEmpList"}
    //     console.log('matchedAuthor ====>>>>', matchedAuthor)
        
    // });
    // console.log('patentSubmissionList ===>>>', patentSubmissionList)
    // const rowCount = patentSubmissionForm.patentSubmissions.rowCount;
    // console.log('rowCount ===>>>', rowCount)
    // return {
    //     patentSubmissionList : patentSubmissionList,
    //     internalEmpList : internalEmpList,
    //     externalEmpList : externalEmpList,
    //     rowCount : rowCount
    // }
}

module.exports.insertPatentFormData = async(body , files) => {
    console.log('patentData in service', body);
    const patentData = body
    const authorNameArray = JSON.parse(body.authorName);
    //for storing internalNames and externalNames faculty name
    const internalNames = [];
    const externalNames = [];
    authorNameArray.forEach((item) => {
        item.internalEmpList ? internalNames.push(item.internalEmpList) : null;
        item.externalEmpList ? externalNames.push(item.externalEmpList) : null;
    });
    // convert array into string
    const internalNamesString = internalNames.join(", ");
    const externalNamesString = externalNames.join(", ");
    const authorNameString = internalNamesString + externalNamesString;
    console.log('authorNameString ====>>>', internalNamesString + externalNamesString)
    console.log("Internal Names updated:", internalNamesString);
    console.log("External Names updated:", externalNamesString);
    const patentDataFilesString = files?.map(file => file.filename).join(',');
    console.log('patentDataFilesString ===>>>', patentDataFilesString)
    const insertPatentData = await patentFormsModels.insertPatentData(patentData, patentDataFilesString, internalNamesString, externalNamesString);
    console.log('insertPatentData in service ====>>>', insertPatentData);
    return insertPatentData.status === "Done" ? {
        status : insertPatentData.status,
        message : insertPatentData.message,
        externalEmpId : insertPatentData.externalEmpId,
        patentId : insertPatentData.patentId,
        authorNameString : authorNameString,
        patentDataFilesString : patentDataFilesString,
        internalNamesString : internalNamesString,
        externalNamesString : externalNamesString,
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
    console.log('body ====>>>>', body);
    console.log('body type ==>> ' , typeof  body.authorName)
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
    const patentDataFiles = files ?.map(file => file.filename).join(',')
    const upadtedPatentSubmissionData = await patentFormsModels.updatePatentsubmissionData(updatedPatentData, patentId, patentDataFiles, internalNamesString, externalNamesString, existingNameString);
    console.log('upadtedPatentSubmissionData ====>>>>', upadtedPatentSubmissionData);
    return upadtedPatentSubmissionData.status === "Done" ? {
                status : "Done",
                message : upadtedPatentSubmissionData.message,
                patentDataFiles : patentDataFiles ? patentDataFiles : null,
                patentId : patentId,
                authorNameString : authorNameString,
                externalNamesString : externalNamesString,
                internalNamesString : internalNamesString,
                existingNameString : existingNameString,
                externalEmpId : upadtedPatentSubmissionData.externalEmpId ? upadtedPatentSubmissionData.externalEmpId : null,
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
    // if(deletePatentData.rowCount === 1){
    //     return {
    //         status : 'done',
    //         massage : 'data Deleted Successfully'
    //     }
    // }
    // else{
    //     return {
    //         status : 'failed',
    //         massage : 'failed to delete'
    //     }
    // }
}

module.exports.viewPatentsubmission = async(patentId) => {
    console.log('id', patentId)
    const patentDataViewed = await patentFormsModels.viewPatentSubmission(patentId);
    if(patentDataViewed && patentDataViewed.rowCount === 1){
        return patentDataViewed
    }
}