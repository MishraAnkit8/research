const researchCunsultancyModel = require("../models/research-project-grant.models");

module.exports.fetchResearConsultacyData = async (userName) => {
  const researchConsultancyData = await researchCunsultancyModel.fetchResearchConsultancy(userName);
  console.log('researchConsultancyData ===>>>>>>', researchConsultancyData)

  return researchConsultancyData.status === "Done"
    ? {
        status: researchConsultancyData.status,
        researchData: researchConsultancyData.researchData,
        InternalFaculty: researchConsultancyData.internalEmpList,
        rowCount: researchConsultancyData.rowCount
      }
    : {
        status: researchConsultancyData.status,
        message: researchConsultancyData.message,
        errorCode: researchConsultancyData.errorCode,
      };
};

module.exports.insertResearchConsultancyData = async (body, files, userName) => {
  const researchCunsultancyData = body;
  console.log('data in service ====>>>>>>>', researchCunsultancyData);

  const facultyInternalIds = researchCunsultancyData.facultyContainer ? JSON.parse(researchCunsultancyData.facultyContainer) : null;
  console.log('facultyInternalIds ====>>>>>', facultyInternalIds);
  const internalFacultyArray = facultyInternalIds ? (facultyInternalIds || []) : null;
  const facultyIdsContainer = internalFacultyArray ?  (internalFacultyArray.map(Number)) : [];

  console.log('facultyIdsContainer =====>>>>>>>', facultyIdsContainer);
 
  const externalData =  JSON.parse(body.externalFacultyDetails);;
  const externalFacultyData = groupArrayIntoChunks(externalData, 4);
  console.log('externalFacultyData ====>>>>>>', externalFacultyData);
  const consultancyDataFiles = files?.map((file) => file.filename).join(",");
  console.log("consultancyDataFiles ===>>>>", consultancyDataFiles);

  const researchProjectConsultancy = await researchCunsultancyModel.insertResearhcProjectConstancyData(
      researchCunsultancyData, consultancyDataFiles, facultyIdsContainer, externalFacultyData,  userName);

  console.log("researchProjectConsultancy ===>>>", researchProjectConsultancy);

  return researchProjectConsultancy.status === "Done"
    ? {
        status: researchProjectConsultancy.status,
        message : researchProjectConsultancy.message,
        externalIds: researchProjectConsultancy.externalIds,
        consultantId: researchProjectConsultancy.consultantId,
        consultantFacultyIds : researchProjectConsultancy.consultantFacultyIds,
        rowCount: researchProjectConsultancy.rowCount,
      }
    : {
        status: researchProjectConsultancy.status,
        message: researchProjectConsultancy.message,
        errorCode: researchProjectConsultancy.errorCode,
      };
};

module.exports.updateResearchConstant = async (consultantId, body, files, userName) => {
  console.log("data in service ====>>>>>>>", body);
  const updatedResearchGrant = body; 
  console.log('consultantId ====>>>>>>>', consultantId);
  
  const facultyInternalIds = JSON.parse(updatedResearchGrant.facultyContainer);
  console.log('facultyInternalIds ====>>>>>', facultyInternalIds);
  const internalFacultyArray = facultyInternalIds || [];
  const facultyIdsContainer = internalFacultyArray.map(Number);
  console.log('facultyIdsContainer =====>>>>>>>', facultyIdsContainer);
  
  const externalData =  JSON.parse(body.externalFacultyDetails);
  const externalFacultyDataInsert = groupArrayIntoChunks(externalData, 4);
  console.log('externalFacultyDataInsert ====>>>>>>', externalFacultyDataInsert);

  const updateExeternalDetails = JSON.parse(body.updateExternalData);
  const updateExternalDetailsArray = groupArrayIntoChunks(updateExeternalDetails, 5);
  console.log('updateExternalDetailsArray ====>>>>>>>', updateExternalDetailsArray);


  const updatedConsultantFilesData = files ?.map((file) => file.filename).join(",");

  const updateResearchProjectConstant = await researchCunsultancyModel.updateResearchConsultantData(consultantId, updatedResearchGrant, facultyIdsContainer, externalFacultyDataInsert, updateExternalDetailsArray,
    updatedConsultantFilesData, userName);

  console.log("updateResearchProjectConstant =====>>>>>",updateResearchProjectConstant);

  return updateResearchProjectConstant.status === "Done"
    ? {
        status: updateResearchProjectConstant.status,
        message: updateResearchProjectConstant.message,
        consultancyRowCount : updateResearchProjectConstant.consultancyRowCount,
        updatedFacultyRowCount : updateResearchProjectConstant.updatedFacultyRowCount,
        consultantFacultyId : updateResearchProjectConstant.consultantFacultyId,
        externalIds : updateResearchProjectConstant.externalIds
      }
    : {
        status: updateResearchProjectConstant.status,
        message: updateResearchProjectConstant.message,
        errorCode: updateResearchProjectConstant.errorCode,
      };
};

module.exports.deleteResearchConsultant = async ({ consultantId }) => {
  console.log("Id in serevice for delete ", consultantId);

  const deleteRseachConsultancy =
    await researchCunsultancyModel.deleteResearchConsultantData(consultantId);

  console.log("deleteRseachConsultancy ====>>>>", deleteRseachConsultancy);
  return deleteRseachConsultancy.status === "Done"
    ? {
        status: deleteRseachConsultancy.status,
        message: deleteRseachConsultancy.message,
        rowCount: deleteRseachConsultancy.rowCount,
        grantFacultyRowCount: deleteRseachConsultancy.grantFacultyRowCount,
      }
    : {
        status: deleteRseachConsultancy.status,
        message: deleteRseachConsultancy.message,
        errorCode: deleteRseachConsultancy.errorCode,
      };
};

module.exports.viewReseachProjectData = async (consultantId, userName) => {
  console.log("consultantId in servicve ===>>>", consultantId);
  const researchConsultancy =
    await researchCunsultancyModel.viewResearchConsultancy(
      consultantId,
      userName
    );

  console.log("researchConsultancy ==>>", researchConsultancy);

  const facultyInfoArray =
    researchConsultancy && researchConsultancy.researchData
      ? researchConsultancy.researchData.map((row) => ({
          facultyName: row.faculty_name,
          designation: row.designation,
          institutionName: row.institution_name,
          address: row.address,
        }))
      : null;

  console.log("facultyInfoArray ===>>>>", facultyInfoArray);

  return researchConsultancy.status === "Done"
    ? {
        status: researchConsultancy.status,
        message: researchConsultancy.message,
        researchData: researchConsultancy.researchData[0],
        rowCount: researchConsultancy.rowCount,
        facultyInfoArray: facultyInfoArray,
      }
    : {
        status: researchConsultancy.status,
        message: researchConsultancy.message,
        errorCode: researchConsultancy.errorCode,
      };
};


module.exports.retriveExternalData = async(body, userName) => {
  const consultantId = body.consultantId;
  const externalFacultyDetails = await researchCunsultancyModel.retriveExternalDetails(consultantId, userName);

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

  const deleteExternalDetails = await researchCunsultancyModel.deletedExternalDetails(externalId, userName);
  
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

module.exports.deleteConsultantInternalFaculty = async(body, userName) => {
  console.log('body in service school ====>>>>', body);

  const consultantId = body.consultantId;
  const internalId = body.internalId;
  console.log('internalId ===>>>>>', internalId);

  const result = await researchCunsultancyModel.deleteInternalFaculty(internalId, consultantId, userName);
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
