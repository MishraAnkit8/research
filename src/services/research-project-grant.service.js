const researchCunsultancyModel = require("../models/research-project-grant.models");

module.exports.fetchResearConsultacyData = async (userName) => {
  const researchConsultancyData =
    await researchCunsultancyModel.fetchResearchConsultancy(userName);
  const fetchInternalFaculty = await researchCunsultancyModel.fetchInternal();
  // console.log('researchConsultancyData in services ===>>>>>',researchConsultancyData.researchData);
  // console.log('facultTableData in services :::::===>>>>>',researchConsultancyData.facultTableData);
  // console.log('research_project_grant_faculty Data In Service ::: ==>>>>', researchConsultancyData.researchPojectGrantFacultyData)
  // console.log('facultTableData in services :::::===>>>>>',researchConsultancyData.extrnalFacultyData);
  // console.log('researchGrantExternalIds ===>>>>', researchConsultancyData.researchGrantExternalIds);
  // console.log('researchInternalIds ===>>>>>>', researchConsultancyData.researchInternalIds)
  console.log(
    "externalDataDetails ======>>>>>>",
    researchConsultancyData.externalDataDetails
  );
  // const groupedData = researchConsultancyData.externalDataDetails.reduce(
  //   (acc, obj) => {
  //     const { research_project_grant_id, id, ...rest } = obj;
  //     if (!acc[research_project_grant_id]) {
  //       acc[research_project_grant_id] = [];
  //     }
  //     acc[research_project_grant_id].push([id, { ...rest }]);
  //     return acc;
  //   },
  //   {}
  // );

  // Converting the grouped data object into an array
  // const externalDetails = Object.keys(groupedData).map((key) => {
  //   const details = groupedData[key];
  //   return details.map(([id, rest]) => [id, { ...rest }]);
  // });

  // console.log(externalDetails);

  // console.log('reseachGrantIdsContainer ::: >>>>>', researchConsultancyData.reseachGrantIdsContainer)
  const reseachGrantIdsContainer =
    researchConsultancyData.reseachGrantIdsContainer;
  const idContainerArray = {};

  for (const item of reseachGrantIdsContainer) {
    if (!idContainerArray[item.research_project_grant_id]) {
      idContainerArray[item.research_project_grant_id] = {
        research_project_grant_id: item.research_project_grant_id,
        faculty_id: [],
        id: [],
      };
    }

    idContainerArray[item.research_project_grant_id].faculty_id.push(
      item.faculty_id
    );
    idContainerArray[item.research_project_grant_id].id.push(item.id);
  }

  const reseachProjectIds = Object.values(idContainerArray);
  // console.log('idContainerArray ===>>>>', idContainerArray);
  // console.log('reseachProjectIds ====>>>>', reseachProjectIds);

  return researchConsultancyData.status === "Done"
    ? {
        status: researchConsultancyData.status,
        researchData: researchConsultancyData.researchData,
        InternalFaculty: researchConsultancyData.facultTableData,
        researchPojectGrantFacultyData:
          researchConsultancyData.researchPojectGrantFacultyData,
        reseachProjectIds: reseachProjectIds,
        message: researchConsultancyData.message,
        rowCount: researchConsultancyData.rowCount,
        externalDetails: researchConsultancyData.externalDataDetails,
        internalFaculty: fetchInternalFaculty.internalFaculty,
        nmimsSchoolList: researchConsultancyData.nmimsSchoolList,
        nmimsCampusList: researchConsultancyData.nmimsCampusList,
      }
    : {
        status: researchConsultancyData.status,
        message: researchConsultancyData.message,
        errorCode: researchConsultancyData.errorCode,
      };
};

module.exports.insertResearchConsultancyData = async (
  body,
  files,
  userName
) => {
  const researchCunsultancyData = body;

  const facultyData = JSON.parse(researchCunsultancyData.facultyDataContainer);
  const nmimsSchoolIds = JSON.parse(researchCunsultancyData.nmimsSchoolIds);
  const nmimsCampusIds = JSON.parse(researchCunsultancyData.nmimsCampusIds);

  const schoolIdsArray = (nmimsSchoolIds.nmimsSchool || []).map((id) =>
    parseInt(id)
  );
  const campusIdsArray = (nmimsCampusIds.nmimsCampus || []).map((id) =>
    parseInt(id)
  );

  const schoolsIdsStrings = schoolIdsArray.join(",");
  const campusIdsString = campusIdsArray.join(",");

  // Extract internalFaculty and externalEmpList arrays
  const internalFaculty =
    facultyData.find((item) => item !== null && item.internalFaculty)
      ?.internalFaculty || [];
  const externalEmpList =
    facultyData.find((item) => item !== null && item.externalEmpList)
      ?.externalEmpList || [];
  const internalFacultyList = internalFaculty.map(Number);
  console.log("externalEmpList:", externalEmpList);
  console.log("internalFacultyList:", internalFacultyList);
  const FacultydataArray = [...externalEmpList, ...internalFacultyList];
  console.log("FacultydataArray ===>>>>>", FacultydataArray);
  const consultancyDataFiles = files?.map((file) => file.filename).join(",");
  console.log("consultancyDataFiles ===>>>>", consultancyDataFiles);

  const researchProjectConsultancy =
    await researchCunsultancyModel.insertResearhcProjectConstancyData(
      schoolIdsArray,
      campusIdsArray,
      researchCunsultancyData,
      consultancyDataFiles,
      FacultydataArray,
      userName
    );

  console.log("researchProjectConsultancy ===>>>", researchProjectConsultancy);
  return researchProjectConsultancy.status === "Done"
    ? {
        status: "Done",
        externalEmpIds: researchProjectConsultancy.externalEmpIds,
        consultantId: researchProjectConsultancy.consultantId,
        rowCount: researchProjectConsultancy.rowCount,
        researchProjectGrantFacultyIds:
          researchProjectConsultancy.researchProjectGrantFacultyIds,
        message: researchProjectConsultancy.message,
        consultancyDataFiles: consultancyDataFiles,
        schoolsIdsStrings: schoolsIdsStrings,
        campusIdsString: campusIdsString,
      }
    : {
        status: researchProjectConsultancy.status,
        message: researchProjectConsultancy.message,
        errorCode: researchProjectConsultancy.errorCode,
      };
};

module.exports.updateResearchConstant = async (
  consultantId,
  body,
  files,
  userName
) => {
  console.log("data in service ====>>>>>>>", body);
  const updatedResearchGrant = body;
  // console.log('data in service =====>>>>', updatedResearchGrant.internalEmpId)
  // Parse the facultyDataContainer property to extract internalFaculty and externalEmpList arrays
  const facultyData = JSON.parse(updatedResearchGrant.facultyDataContainer);
  const updateNmimsSchoolIds = JSON.parse(updatedResearchGrant.nmimsSchoolIds);
  const updateNmimsCampusIds = JSON.parse(updatedResearchGrant.nmimsCampusIds);

  const updateSchoolIdsArray = (updateNmimsSchoolIds.nmimsSchool || []).map(
    (id) => parseInt(id)
  );

  const updateCampusIdsArray = (updateNmimsCampusIds.nmimsCampus || []).map(
    (id) => parseInt(id)
  );
  // const updateNmimsAuthorsArray = (
  //   updateNmimsFacultiesIds.nmimsInternalFaculty || []
  // ).map((id) => parseInt(id));

  const schoolsIdsStrings = updateSchoolIdsArray.join(",");
  const campusIdsString = updateCampusIdsArray.join(",");

  // Extract internalFaculty and externalEmpList arrays
  const internalFaculty =
    facultyData.find((item) => item !== null && item.internalFaculty)
      ?.internalFaculty || [];
  const externalEmpList =
    facultyData.find((item) => item !== null && item.externalEmpList)
      ?.externalEmpList || [];
  const internalFacultyList = internalFaculty.map(Number);
  console.log("externalEmpList:", externalEmpList);
  console.log("internalFacultyList:", internalFacultyList);
  const FacultydataArray = [...externalEmpList, ...internalFacultyList];
  console.log("FacultydataArray ===>>>>>", FacultydataArray);

  const updatedConsultantFilesData = files
    ?.map((file) => file.filename)
    .join(",");

  const updateResearchProjectConstant =
    await researchCunsultancyModel.updateResearchConsultantData(
      consultantId,
      updatedResearchGrant,
      updatedConsultantFilesData,
      FacultydataArray,
      userName,
      updateSchoolIdsArray,
      updateCampusIdsArray
    );

  console.log(
    "updateResearchProjectConstant =====>>>>>",
    updateResearchProjectConstant
  );
  return updateResearchProjectConstant.status === "Done"
    ? {
        status: updateResearchProjectConstant.status,
        message: updateResearchProjectConstant.message,
        updateResearchProjectConstant,
        updatedConsultantFilesData,
        researchProjectGrantFacultyIds:
          updateResearchProjectConstant.researchGrantsIds,
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
          address: row.address,
          employeeId: row.employee_id,
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
