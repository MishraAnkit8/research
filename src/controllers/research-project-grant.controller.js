const researchConsultancyService = require("../services/research-project-grant.service");

module.exports.renderResearchProjectConsultancy = async (req, res, next) => {
  const userName = req.body.username;
  console.log("userName in controller  ===>>>>>>", userName);

  const researchcConsultancyData =
    await researchConsultancyService.fetchResearConsultacyData(userName);

  // console.log('researchcConsultancyData in controller ===>>>>>', researchcConsultancyData);

  res.render("research-project-grant", {
    status: researchcConsultancyData.status,
    researchProjectData: researchcConsultancyData.researchData,
    researchPojectGrantFacultyData:
      researchcConsultancyData.researchPojectGrantFacultyData,
    reseachProjectIds: researchcConsultancyData.reseachProjectIds,
    message: researchcConsultancyData.message,
    rowCount: researchcConsultancyData.rowCount,
    InternalFaculty: researchcConsultancyData.InternalFaculty,
    externalDetails: researchcConsultancyData.externalDetails,
    errorCode: researchcConsultancyData.errorCode
      ? researchcConsultancyData.errorCode
      : null,
  });
};

module.exports.insertResearchConsultancyData = async (req, res, next) => {
  const userName = req.body.username;
  console.log("userName in controller  ===>>>>>>", userName);

  const researchConsultantData = req.body;
  console.log("researchConsultantData ==>>", researchConsultantData);
  console.log("files in controllerr ==>>>", req.files);

  const researchcConsultancyData =
    await researchConsultancyService.insertResearchConsultancyData(
      req.body,
      req.files,
      userName
    );

  console.log("researchcConsultancyData ====>>>>>", researchcConsultancyData);
  const statusCode =
    researchcConsultancyData.status === "Done"
      ? 200
      : researchcConsultancyData.errorCode
      ? 400
      : 500;
  researchcConsultancyData.status === "Done"
    ? res.status(statusCode).send({
        status: researchcConsultancyData.status,
        message: researchcConsultancyData.message,
        externalEmpIds: researchcConsultancyData.externalEmpIds,
        consultantId: researchcConsultancyData.consultantId,
        researchProjectGrantFacultyIds:
          researchcConsultancyData.researchProjectGrantFacultyIds,
        rowCount: researchcConsultancyData.rowCount,
        message: researchcConsultancyData.message,
        researchConsultantData: researchConsultantData,
        consultancyDataFiles: researchcConsultancyData.consultancyDataFiles,
      })
    : res.status(statusCode).send({
        status: researchcConsultancyData.status,
        errorCode: researchcConsultancyData.errorCode,
        message: researchcConsultancyData.message,
      });
};

module.exports.updatedConsultantData = async (req, res, next) => {
  const userName = req.body.username;
  console.log("userName in controller  ===>>>>>>", userName);

  console.log("data comming from templates ==>>", req.body);
  const consultantId = req.body.consultantId;
  const updatedConsultant = req.body;

  const updatedResearchGrant =
    await researchConsultancyService.updateResearchConstant(
      consultantId,
      req.body,
      req.files,
      userName
    );

  console.log("updatedResearchGrant ===>>>>", updatedResearchGrant);

  const sttausCode =
    updatedResearchGrant.status === "Done"
      ? 200
      : updatedResearchGrant.errorCode
      ? 400
      : 500;
  res.status(sttausCode).send({
    status:
      updatedResearchGrant.status === "Done"
        ? "Done"
        : updatedResearchGrant.status,
    updatedConsultant: updatedConsultant,
    updatedConsultantFilesString:
      updatedResearchGrant.updatedConsultantFilesData
        ? updatedResearchGrant.updatedConsultantFilesData
        : null,
    consultantId: consultantId,
    researchProjectGrantFacultyIds:
      updatedResearchGrant.researchProjectGrantFacultyIds
        ? updatedResearchGrant.researchProjectGrantFacultyIds
        : null,
    message: updatedResearchGrant.message,
    errorCode: updatedResearchGrant.errorCode
      ? updatedResearchGrant.errorCode
      : null,
  });
};

module.exports.deleteResearchConsultant = async (req, res, next) => {
  console.log("body", req.body);
  const consultantId = req.body;
  const deleteConstantData =
    await researchConsultancyService.deleteResearchConsultant(consultantId);

  const statusCode =
    deleteConstantData.status === "Done"
      ? 200
      : deleteConstantData.errorCode
      ? 400
      : 500;
  res.status(statusCode).send({
    status: deleteConstantData.status,
    message: deleteConstantData.message,
    rowCount: deleteConstantData.rowCount,
    grantFacultyRowCount: deleteConstantData.grantFacultyRowCount,
    errorCode: deleteConstantData.errorCode
      ? deleteConstantData.errorCode
      : null,
  });
};

module.exports.viewResearchProjectConsultancy = async (req, res, next) => {
  const userName = req.body.username;
  console.log("userName in controller  ===>>>>>>", userName);

  console.log("body ===>>>", req.body.consultantId);
  const consultantId = req.body.consultantId;
  console.log("consultantId  in controller ==>>", consultantId);
  const viewResearchConsultantData =
    await researchConsultancyService.viewReseachProjectData(
      consultantId,
      userName
    );

  console.log(
    "viewResearchConsultantData in controller ===>>",
    JSON.stringify(viewResearchConsultantData.rows)
  );
  const submissionGrantDate = formatDate(
    viewResearchConsultantData.researchData.submission_date
  );
  console.log("submissionGrantDate ===>>>>>", submissionGrantDate);

  const statusCode =
    viewResearchConsultantData.status === "Done"
      ? 200
      : viewResearchConsultantData.errorCode
      ? 400
      : 500;

  res.status(statusCode).send({
    status: viewResearchConsultantData.status,
    message: viewResearchConsultantData.message,
    researchData: viewResearchConsultantData.researchData,
    rowCount: viewResearchConsultantData.rowCount,
    facultyInfoArray: viewResearchConsultantData.facultyInfoArray,
    submissionGrantDate: submissionGrantDate,
    errorCode: viewResearchConsultantData.errorCode
      ? viewResearchConsultantData.errorCode
      : null,
  });
};

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
